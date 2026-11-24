// Vercel serverless function — emails an order from one of the site's order
// forms (geese & ducks, individual pork cuts) via Resend. The customer gets a
// confirmation and the farm is CC'd, so every order lands in the farm inbox
// (these orders don't go through the reservations table).
// Self-contained: no imports from src/ (Vercel's bundler doesn't include it).

export const config = { runtime: 'edge' }

const FARM_EMAIL = 'brookerhousehold@gmail.com'
const FARM = {
  name: 'Creekside Fields',
  address: '49 Clarks Mills Rd, Greenwich, NY 12834',
  contact: FARM_EMAIL,
}
const SENDER = `${FARM.name} <hello@creeksidefields.com>`

// Email wording per order form. The kinds and MAX_PER_ITEM mirror
// src/content/orders.ts — kept in sync here because this edge function is
// bundled separately and can't import from src.
const KINDS = {
  birds: {
    title: 'Goose & duck order',
    next: "we'll be in touch to confirm your order, your total, and a pickup time.",
    price: "Each bird is priced by the pound, so we'll confirm your total once your birds are weighed.",
  },
  pork: {
    title: 'Pork order',
    next: "we'll be in touch to confirm your order and a pickup time.",
    price: "Each pack is priced by weight — we'll weigh your order and give you the total at pickup.",
  },
} as const
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
  if (!name || !email || !phone) return { error: 'Name, email, and phone are required.' }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    notes.length > LIMITS.notes
  ) {
    return { error: 'One of the fields is too long.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'That email address doesn’t look right.' }
  if (!Array.isArray(o.items) || o.items.length === 0) return { error: 'Choose at least one item.' }
  if (o.items.length > MAX_LINES) return { error: 'That order has too many lines.' }
  const items = o.items.map(parseLine)
  if (items.some((l) => l === null)) return { error: `Choose between 1 and ${MAX_PER_ITEM} of each item.` }

  return {
    order: {
      kind: o.kind as Kind,
      customer: { name, email, phone },
      items: items as OrderLine[],
      notes: notes || null,
    },
  }
}

function escape(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

function renderOrderEmail(order: Order, ref: string, dateIso: string): string {
  const { customer, notes } = order
  const wording = KINDS[order.kind]
  const items = order.items
    .map(
      (l) =>
        `<li style="margin:0 0 6px 0;"><strong>${l.quantity} × ${escape(l.title)}</strong>${
          l.detail ? `<br><span style="font-size:12px;color:#6f655c;">${escape(l.detail)}</span>` : ''
        }</li>`,
    )
    .join('')

  const inner = `
    <tr><td style="border-bottom:2px solid #2a2522;padding-bottom:12px;">
      <h1 style="margin:0;font-size:24px;font-family:Georgia,serif;">${escape(wording.title)}</h1>
      <p style="margin:6px 0 0 0;font-size:12px;color:#6f655c;">Ordered: ${escape(fmtDate(dateIso))}</p>
    </td></tr>
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 14px 0;font-size:15px;">Hi ${escape(customer.name.split(' ')[0])}, thanks for ordering from ${escape(FARM.name)}. Here's what you asked for — ${escape(wording.next)}</p>
      ${block('Farm', `<strong>${escape(FARM.name)}</strong><br>${escape(FARM.address)}<br>${escape(FARM.contact)}`)}
      ${block(
        'Ordered by',
        `<strong>${escape(customer.name)}</strong><br>${escape(customer.email)}<br>${escape(customer.phone)}`,
      )}
      ${block('Your order', `<ul style="margin:0 0 0 18px;padding:0;">${items}</ul>`)}
      ${block(
        'Price',
        `<strong>Priced by weight</strong><br>
         <span style="font-size:12px;color:#6f655c;">${escape(wording.price)}</span>`,
      )}
      ${block(
        'Pickup',
        `<strong>Farm pickup (Greenwich, NY)</strong><br>
         <span style="font-size:12px;color:#6f655c;">We'll reach out to arrange a pickup time.</span>`,
      )}
      ${notes ? block('Your notes', escape(notes).replace(/\r?\n/g, '<br>')) : ''}
      <p style="margin:22px 0 0 0;font-size:11px;color:#6f655c;border-top:1px solid #2a2522;padding-top:10px;">
        Order ref: ${escape(ref)} · ${escape(FARM.name)} · ${escape(FARM.contact)}
      </p>
    </td></tr>`
  return shell(inner)
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
  const html = renderOrderEmail(order, ref, new Date().toISOString())
  const subject = `${KINDS[order.kind].title} — ${FARM.name} — ${order.customer.name}`

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SENDER,
      to: order.customer.email,
      cc: FARM_EMAIL,
      reply_to: FARM_EMAIL,
      subject,
      html,
    }),
  })

  const respBody = (await resp.json().catch(() => ({}))) as Record<string, unknown>
  const phProps: Record<string, unknown> = {
    order_ref: ref,
    kind: order.kind,
    items: order.items.map(({ id, quantity }) => ({ id, quantity })),
    total_quantity: order.items.reduce((sum, l) => sum + l.quantity, 0),
    customer_email: order.customer.email,
    $session_id: sessionId || undefined,
  }
  if (!resp.ok) {
    await capturePostHog('order_email_send_failed', distinctId, {
      ...phProps,
      status: resp.status,
      detail: respBody,
    })
    return json({ error: 'Resend failed', detail: respBody }, 502)
  }
  await capturePostHog('order_email_send_succeeded', distinctId, {
    ...phProps,
    resend_id: respBody.id,
  })
  return json({ ok: true, ref }, 200)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
