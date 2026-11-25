// Vercel serverless function — emails orders and messages from the site's
// forms (pig shares, individual cuts, geese & ducks, and the contact form) via
// Resend. Two emails go out:
//   1. to the farm, with Reply-To set to the customer, so a plain "Reply"
//      starts the conversation;
//   2. to the customer, a confirmation with Reply-To set to the farm.
// Nothing is stored in the database — the farm's email is the record.
// Self-contained: no imports from src/ (Vercel's bundler doesn't include it).

export const config = { runtime: 'edge' }

const FARM_EMAIL = 'brookerhousehold@gmail.com'
const FARM = {
  name: 'Creekside Fields',
  address: '49 Clarks Mills Rd, Greenwich, NY 12834',
  contact: FARM_EMAIL,
}
const SENDER = `${FARM.name} <hello@creeksidefields.com>`

// Email wording per form. The kinds and MAX_PER_ITEM mirror
// src/content/orders.ts — kept in sync here because this edge function is
// bundled separately and can't import from src.
const KINDS = {
  pork: {
    title: 'Pork order',
    price: "Shares are $10 a pound of take-home pork, and cuts are priced per pound as listed. We'll weigh everything and send your total.",
  },
  birds: {
    title: 'Goose & duck order',
    price: "Each bird is priced by the pound. We'll weigh your birds and send your total.",
  },
  // Older pages sent share orders on their own; still accepted.
  shares: {
    title: 'Pig share order',
    price: "Shares are $10 a pound of take-home pork. We'll weigh your share and send your total.",
  },
  message: {
    title: 'Message',
    price: '',
  },
} as const

const SIGN_OFF = '<p style="margin:20px 0 0 0;font-size:15px;">See you at the farm,<br>Creekside Fields</p>'
type Kind = keyof typeof KINDS
const MAX_PER_ITEM = 10
const MAX_LINES = 30

const LIMITS = { name: 120, email: 254, phone: 40, notes: 2000, title: 80, detail: 80 }

interface OrderLine {
  id: string
  title: string
  detail: string
  quantity: number
}

interface Order {
  kind: Kind
  customer: { name: string; email: string; phone: string }
  items: OrderLine[]
  notes: string | null
}

type Parsed = { order: Order } | { error: string }

function text(v: unknown, singleLine = true): string {
  if (typeof v !== 'string') return ''
  const t = v.trim()
  return singleLine ? t.replace(/[\r\n\t]+/g, ' ') : t
}

function parseLine(raw: unknown): OrderLine | null {
  const l = (raw ?? {}) as Record<string, unknown>
  const id = text(l.id)
  const title = text(l.title)
  const detail = text(l.detail)
  const q = l.quantity
  if (!/^[a-z0-9-]{1,40}$/.test(id) || !title || title.length > LIMITS.title || detail.length > LIMITS.detail) {
    return null
  }
  if (typeof q !== 'number' || !Number.isInteger(q) || q < 1 || q > MAX_PER_ITEM) return null
  return { id, title, detail, quantity: q }
}

function parseOrder(raw: unknown): Parsed {
  const o = (raw ?? {}) as Record<string, unknown>
  const c = (o.customer ?? {}) as Record<string, unknown>
  const name = text(c.name)
  const email = text(c.email)
  const phone = text(c.phone)
  const notes = text(o.notes, false)

  if (typeof o.kind !== 'string' || !Object.hasOwn(KINDS, o.kind)) return { error: 'Unknown order type.' }
  const kind = o.kind as Kind
  const isMessage = kind === 'message'

  if (!name || !email) return { error: 'Please add your name and email.' }
  if (!isMessage && !phone) return { error: 'Name, email, and phone are required.' }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    notes.length > LIMITS.notes
  ) {
    return { error: 'One of the fields is too long.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'That email address doesn’t look right.' }

  let items: OrderLine[] = []
  if (isMessage) {
    if (!notes) return { error: 'Please write a message.' }
  } else {
    if (!Array.isArray(o.items) || o.items.length === 0) return { error: 'Choose at least one item.' }
    if (o.items.length > MAX_LINES) return { error: 'That order has too many lines.' }
    const parsed = o.items.map(parseLine)
    if (parsed.some((l) => l === null)) return { error: `Choose between 1 and ${MAX_PER_ITEM} of each item.` }
    items = parsed as OrderLine[]
  }

  return { order: { kind, customer: { name, email, phone }, items, notes: notes || null } }
}

function escape(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function multiline(s: string): string {
  return escape(s).replace(/\r?\n/g, '<br>')
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  })
}

function block(label: string, body: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #2a2522;border-radius:14px;padding:14px;margin:0 0 12px 0;">
    <tr><td style="font-size:11px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:#6f655c;padding-bottom:6px;">${escape(label)}</td></tr>
    <tr><td style="font-size:14px;line-height:1.5;">${body}</td></tr>
  </table>`
}

function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f1e8;font-family:Georgia,'Times New Roman',serif;color:#2a2522;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f1e8;padding:24px 8px;">
  <tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fffaf2;border:2px solid #2a2522;border-radius:18px;padding:28px;">
      ${inner}
    </table>
  </td></tr>
</table>
</body></html>`
}

function header(title: string, dateIso: string): string {
  return `<tr><td style="border-bottom:2px solid #2a2522;padding-bottom:12px;">
      <h1 style="margin:0;font-size:24px;font-family:Georgia,serif;">${escape(title)}</h1>
      <p style="margin:6px 0 0 0;font-size:12px;color:#6f655c;">${escape(fmtDate(dateIso))}</p>
    </td></tr>`
}

function itemsBlock(order: Order): string {
  if (!order.items.length) return ''
  const items = order.items
    .map(
      (l) =>
        `<li style="margin:0 0 6px 0;"><strong>${l.quantity} × ${escape(l.title)}</strong>${
          l.detail ? `<br><span style="font-size:12px;color:#6f655c;">${escape(l.detail)}</span>` : ''
        }</li>`,
    )
    .join('')
  return block('Order', `<ul style="margin:0 0 0 18px;padding:0;">${items}</ul>`)
}

function footer(ref: string): string {
  return `<p style="margin:22px 0 0 0;font-size:11px;color:#6f655c;border-top:1px solid #2a2522;padding-top:10px;">
        Ref: ${escape(ref)} · ${escape(FARM.name)} · ${escape(FARM.contact)}
      </p>`
}

/** The farm's copy: who it's from, how to reach them, and what they want. */
function renderFarmEmail(order: Order, ref: string, dateIso: string): string {
  const { customer, notes, kind } = order
  const isMessage = kind === 'message'
  const contact = [
    `<strong>${escape(customer.name)}</strong>`,
    `<a href="mailto:${escape(customer.email)}" style="color:#2a2522;">${escape(customer.email)}</a>`,
    customer.phone ? `<a href="tel:${escape(customer.phone)}" style="color:#2a2522;">${escape(customer.phone)}</a>` : '',
  ]
    .filter(Boolean)
    .join('<br>')
  const inner = `
    ${header(isMessage ? 'New message' : `New ${KINDS[kind].title.toLowerCase()}`, dateIso)}
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 14px 0;font-size:15px;">From the website. Just reply to this email to reach ${escape(customer.name.split(' ')[0])}.</p>
      ${block('From', contact)}
      ${itemsBlock(order)}
      ${notes ? block(isMessage ? 'Message' : 'Notes', multiline(notes)) : ''}
      ${footer(ref)}
    </td></tr>`
  return shell(inner)
}

/** The customer's confirmation. */
function renderCustomerEmail(order: Order, ref: string, dateIso: string): string {
  const { customer, notes, kind } = order
  const wording = KINDS[kind]
  const first = escape(customer.name.split(' ')[0])
  const inner =
    kind === 'message'
      ? `
    ${header('Thanks for getting in touch', dateIso)}
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 14px 0;font-size:15px;">Hi ${first}, thanks for writing! We'll write back soon. Here's a copy of your message.</p>
      ${notes ? block('Your message', multiline(notes)) : ''}
      ${SIGN_OFF}
      ${footer(ref)}
    </td></tr>`
      : `
    ${header(wording.title, dateIso)}
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 14px 0;font-size:15px;">Hi ${first}, thanks for your order! Here's a copy. We'll write back soon with your total and a time to pick it up at the farm.</p>
      ${itemsBlock(order)}
      ${block('Price', `<strong>Priced by weight</strong><br><span style="font-size:12px;color:#6f655c;">${escape(wording.price)}</span>`)}
      ${block('Pickup', `<strong>At our farm</strong><br>${escape(FARM.address)}<br><span style="font-size:12px;color:#6f655c;">Nothing to pay online.</span>`)}
      ${notes ? block('Your notes', multiline(notes)) : ''}
      <p style="margin:14px 0 0 0;font-size:15px;">Questions? Just hit reply.</p>
      ${SIGN_OFF}
      ${footer(ref)}
    </td></tr>`
  return shell(inner)
}

async function sendEmail(apiKey: string, email: Record<string, unknown>) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: SENDER, ...email }),
  })
  const body = (await resp.json().catch(() => ({}))) as Record<string, unknown>
  return { ok: resp.ok, status: resp.status, body }
}

async function capturePostHog(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>,
): Promise<void> {
  const phKey = process.env.POSTHOG_KEY
  if (!phKey || !distinctId) return
  const host = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com'
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: phKey,
        event,
        distinct_id: distinctId,
        properties: { $lib: 'server', source: 'send-order', ...properties },
        timestamp: new Date().toISOString(),
      }),
    })
  } catch {
    // ignore analytics failures — don't break the email flow
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-POSTHOG-DISTINCT-ID, X-POSTHOG-SESSION-ID',
      },
    })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let payload: { order?: unknown }
  try {
    payload = (await req.json()) as { order?: unknown }
  } catch {
    return json({ error: 'Bad JSON' }, 400)
  }

  const parsed = parseOrder(payload.order)
  if ('error' in parsed) {
    return json({ error: parsed.error }, 400)
  }
  const { order } = parsed

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return json({ error: 'RESEND_API_KEY missing on server' }, 500)
  }

  const distinctId = req.headers.get('x-posthog-distinct-id') ?? ''
  const sessionId = req.headers.get('x-posthog-session-id') ?? ''
  const ref = crypto.randomUUID().slice(0, 8)
  const now = new Date().toISOString()
  const title = KINDS[order.kind].title
  const phProps: Record<string, unknown> = {
    order_ref: ref,
    kind: order.kind,
    items: order.items.map(({ id, quantity }) => ({ id, quantity })),
    total_quantity: order.items.reduce((sum, l) => sum + l.quantity, 0),
    customer_email: order.customer.email,
    $session_id: sessionId || undefined,
  }

  // 1. The farm's copy comes first — it's the one that matters.
  const farm = await sendEmail(apiKey, {
    to: FARM_EMAIL,
    reply_to: order.customer.email,
    subject:
      order.kind === 'message'
        ? `Message from ${order.customer.name}`
        : `New ${title.toLowerCase()} from ${order.customer.name}`,
    html: renderFarmEmail(order, ref, now),
  })
  if (!farm.ok) {
    await capturePostHog('order_email_send_failed', distinctId, { ...phProps, status: farm.status, detail: farm.body })
    return json({ error: 'Resend failed', detail: farm.body }, 502)
  }

  // 2. The customer's confirmation. If only this fails, the farm still has the
  //    order, so report success and let the page skip "we've emailed you".
  const customer = await sendEmail(apiKey, {
    to: order.customer.email,
    reply_to: FARM_EMAIL,
    subject: order.kind === 'message' ? `Thanks for getting in touch — ${FARM.name}` : `${title} — ${FARM.name}`,
    html: renderCustomerEmail(order, ref, now),
  })

  await capturePostHog('order_email_send_succeeded', distinctId, {
    ...phProps,
    resend_id: farm.body.id,
    customer_emailed: customer.ok,
    customer_email_status: customer.status,
  })
  return json({ ok: true, ref, customerEmailed: customer.ok }, 200)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
