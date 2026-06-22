// Vercel serverless function — emails the reservation confirmation via Resend.
// Self-contained: no imports from src/ (Vercel's bundler doesn't include it).

export const config = { runtime: 'edge' }

const FARM_EMAIL = 'brookerhousehold@gmail.com'
const FARM = {
  name: 'Creekside Fields',
  address: '49 Clarks Mills Rd, Greenwich, NY 12834',
  contact: FARM_EMAIL,
}
const SENDER = `${FARM.name} <hello@creeksidefields.com>`

const PICKUP_LABELS: Record<string, string> = {
  farm: 'Farm pickup (Greenwich, NY)',
  processor: 'Direct from the processor',
  either: 'Either — to be confirmed when pickup is scheduled',
}

const SHARE_KIND_TITLE: Record<string, string> = {
  whole: 'Whole pig share',
  half: 'Half pig share',
  quarter: 'Quarter pig share',
  eighth: 'Eighth pig share',
}

// Mirror of SHARE_PRICE_RANGE in src/content/sharesCopy.ts — kept in sync here
// because this edge function is bundled separately and can't import from src.
const SHARE_PRICE_RANGE: Record<string, string> = {
  quarter: '$680–$770',
  half: '$1,370–$1,540',
  whole: '$2,730–$3,080',
}

interface ConfirmationData {
  customer: { name: string; email: string; phone: string | null; address: string | null }
  share: {
    id: string
    kind: string
    label: string | null
    deposit_cents: number
    est_total_low_cents: number | null
    est_total_high_cents: number | null
    rate_per_lb_hw_cents: number | null
  }
  animal: {
    id: string
    breed: string | null
    dob: string | null
    estimated_live_weight_lbs: number | null
    rate_per_lb_hw_cents: number | null
  }
  pickup_preference: string | null
  share_percentage: number | null
  date: string
}

function escape(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatCents(cents: number | null | undefined): string {
  if (cents == null) return '—'
  return `$${(cents / 100).toFixed(0)}`
}

function priceRange(low: number | null | undefined, high: number | null | undefined): string {
  if (!low && !high) return 'Ask for price'
  if (low && high && low !== high) return `${formatCents(low)}–${formatCents(high)}`
  return formatCents(low ?? high)
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function fmtMonth(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' })
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

function renderConfirmationEmail(data: ConfirmationData): string {
  const { customer, share, animal, pickup_preference, date } = data
  const shareLabel = SHARE_KIND_TITLE[share.kind] ?? share.label ?? share.kind

  const inner = `
    <tr><td style="border-bottom:2px solid #2a2522;padding-bottom:12px;">
      <h1 style="margin:0;font-size:24px;font-family:Georgia,serif;">Reservation confirmation</h1>
      <p style="margin:6px 0 0 0;font-size:12px;color:#6f655c;">Reserved: ${escape(fmtDate(date))}</p>
    </td></tr>
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 14px 0;font-size:15px;">Hi ${escape(customer.name.split(' ')[0])}, thanks for reserving a share with ${escape(FARM.name)}. Here's your confirmation — there's nothing to sign. We'll follow up with deposit and pickup details.</p>
      ${block('Farm', `<strong>${escape(FARM.name)}</strong><br>${escape(FARM.address)}<br>${escape(FARM.contact)}`)}
      ${block(
        'Reserved by',
        `<strong>${escape(customer.name)}</strong>${customer.address ? `<br>${escape(customer.address)}` : ''}<br>${escape(customer.email)}${customer.phone ? `<br>${escape(customer.phone)}` : ''}`,
      )}
      ${block(
        'Your share',
        `<strong>${escape(shareLabel)}</strong>
         <ul style="margin:6px 0 0 18px;padding:0;">
           <li>Breed: <strong>${escape(animal.breed)}</strong></li>
           <li>Date of birth: <strong>${escape(fmtMonth(animal.dob))}</strong></li>
           ${animal.estimated_live_weight_lbs ? `<li>Est. live weight: <strong>${animal.estimated_live_weight_lbs} lb</strong></li>` : ''}
         </ul>`,
      )}
      ${block(
        'Estimated price',
        `<span style="font-size:22px;font-family:Georgia,serif;">${escape(SHARE_PRICE_RANGE[share.kind] ?? priceRange(share.est_total_low_cents, share.est_total_high_cents))}</span><br>
         <span style="font-size:12px;color:#6f655c;">Estimated range for this ${escape(share.kind)} share. Your final price is a single flat amount, confirmed once the animal is processed — based on the actual weight of the meat and the cuts included. Processing included; no added nitrates.</span>`,
      )}
      ${block(
        'Deposit',
        `<span style="font-size:22px;font-family:Georgia,serif;">${escape(formatCents(share.deposit_cents))}</span><br>
         <span style="font-size:12px;color:#6f655c;">Holds your share and is credited toward the final total. Balance due at pickup.</span>`,
      )}
      ${block(
        'Pickup',
        `<strong>${escape(pickup_preference ? PICKUP_LABELS[pickup_preference] ?? pickup_preference : 'To be confirmed')}</strong>`,
      )}
      <p style="margin:14px 0 4px 0;font-size:13px;font-weight:bold;">Good to know</p>
      <ul style="margin:0 0 0 18px;padding:0;font-size:12px;color:#3a322d;line-height:1.5;">
        <li>Raised on our pasture without added growth hormones or antibiotics, and processed at a USDA-inspected facility.</li>
        <li>Your deposit confirms the share and is credited toward the final total; the balance is due at pickup.</li>
        <li>Final price, quantity, and the exact mix of cuts depend on the finished animal and are confirmed after processing.</li>
        <li>We'll confirm your pickup date once the slaughter date is scheduled.</li>
      </ul>
      <p style="margin:22px 0 0 0;font-size:11px;color:#6f655c;border-top:1px solid #2a2522;padding-top:10px;">
        Reservation ref: ${escape(String(animal.id ?? '').slice(0, 8))}/${escape(String(share.id ?? '').slice(0, 8))} · ${escape(FARM.name)} · ${escape(FARM.contact)}
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
        properties: { $lib: 'server', source: 'send-confirmation', ...properties },
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

  const distinctId = req.headers.get('x-posthog-distinct-id') ?? ''
  const sessionId = req.headers.get('x-posthog-session-id') ?? ''

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return json({ error: 'RESEND_API_KEY missing on server' }, 500)
  }

  let payload: { data?: ConfirmationData }
  try {
    payload = (await req.json()) as { data?: ConfirmationData }
  } catch {
    return json({ error: 'Bad JSON' }, 400)
  }
  const data = payload.data
  if (!data?.customer?.email || !data?.share?.id || !data?.animal?.id) {
    return json({ error: 'Missing required fields' }, 400)
  }

  let html: string
  try {
    html = renderConfirmationEmail(data)
  } catch (e) {
    await capturePostHog('confirmation_render_failed', distinctId, {
      share_id: data.share.id,
      animal_id: data.animal.id,
      customer_email: data.customer.email,
      error: e instanceof Error ? e.message : String(e),
      $session_id: sessionId || undefined,
    })
    return json({ error: 'Failed to render email template', detail: e instanceof Error ? e.message : String(e) }, 500)
  }
  const subject = `Reservation confirmation — Creekside Fields — ${data.customer.name ?? 'Customer'}`

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SENDER,
      to: data.customer.email,
      cc: FARM_EMAIL,
      reply_to: FARM_EMAIL,
      subject,
      html,
    }),
  })

  const respBody = (await resp.json().catch(() => ({}))) as Record<string, unknown>
  const phProps: Record<string, unknown> = {
    share_kind: data.share.kind,
    share_id: data.share.id,
    animal_id: data.animal.id,
    customer_email: data.customer.email,
    $session_id: sessionId || undefined,
  }
  if (!resp.ok) {
    await capturePostHog('confirmation_email_send_failed', distinctId, {
      ...phProps,
      status: resp.status,
      detail: respBody,
    })
    return json({ error: 'Resend failed', detail: respBody }, 502)
  }
  await capturePostHog('confirmation_email_send_succeeded', distinctId, {
    ...phProps,
    resend_id: respBody.id,
  })
  return json({ ok: true, id: respBody.id }, 200)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
