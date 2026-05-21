// Vercel serverless function — sends the signed bill of sale via Resend.
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
  either: 'Either — to be confirmed when slaughter is scheduled',
}

interface BillOfSaleData {
  customer: { name: string; email: string; phone: string | null; address: string | null }
  share: {
    id: string
    kind: string
    label: string | null
    deposit_cents: number
    est_total_low_cents: number | null
    est_total_high_cents: number | null
  }
  animal: {
    id: string
    breed: string | null
    dob: string | null
    estimated_live_weight_lbs: number | null
  }
  pickup_preference: string | null
  share_percentage: number | null
  date: string
  signature_url?: string | null
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

function renderBillOfSaleEmail(data: BillOfSaleData): string {
  const { customer, share, animal, pickup_preference, share_percentage, date, signature_url } = data
  const shareLabel = share_percentage
    ? `${share_percentage}% undivided interest`
    : share.label ?? share.kind

  const sigSection = signature_url
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 0 0;">
        <tr><td style="font-size:11px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:#6f655c;">Buyer signature</td></tr>
        <tr><td style="padding-top:6px;"><img src="${escape(signature_url)}" alt="Signature" style="max-width:280px;height:auto;border-bottom:2px solid #2a2522;display:block;"/></td></tr>
        <tr><td style="padding-top:4px;font-size:13px;">${escape(customer.name)} · signed ${escape(fmtDate(date))}</td></tr>
      </table>`
    : `<p style="margin:18px 0 0 0;font-size:13px;color:#6f655c;">Awaiting buyer signature.</p>`

  const inner = `
    <tr><td style="border-bottom:2px solid #2a2522;padding-bottom:12px;">
      <h1 style="margin:0;font-size:24px;font-family:Georgia,serif;">Bill of Sale — Live Animal Share</h1>
      <p style="margin:6px 0 0 0;font-size:12px;color:#6f655c;">Issued: ${escape(fmtDate(date))}</p>
    </td></tr>
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 14px 0;font-size:13px;color:#6f655c;">
        Records the sale of an undivided percentage interest in a specific live animal, executed prior to slaughter,
        pursuant to federal custom-exempt processing under 9 CFR 303.1(a)(2)(i) and NY Ag &amp; Markets Law Article 5-A §96-d.
      </p>
      ${block('Seller', `<strong>${escape(FARM.name)}</strong><br>${escape(FARM.address)}<br>${escape(FARM.contact)}`)}
      ${block(
        'Buyer',
        `<strong>${escape(customer.name)}</strong>${customer.address ? `<br>${escape(customer.address)}` : ''}<br>${escape(customer.email)}${customer.phone ? `<br>${escape(customer.phone)}` : ''}`,
      )}
      ${block(
        'Item sold',
        `<strong>${escape(shareLabel)}</strong> in one (1) live hog:
         <ul style="margin:6px 0 0 18px;padding:0;">
           <li>Breed: <strong>${escape(animal.breed)}</strong></li>
           <li>Date of birth: <strong>${escape(fmtMonth(animal.dob))}</strong></li>
           ${animal.estimated_live_weight_lbs ? `<li>Est. live weight: <strong>~${animal.estimated_live_weight_lbs} lb</strong></li>` : ''}
           <li>Animal ID: <strong>${escape(animal.id)}</strong></li>
         </ul>`,
      )}
      ${block(
        'Price',
        `Estimated total: <strong>${escape(priceRange(share.est_total_low_cents, share.est_total_high_cents))}</strong><br>
         Final = hanging weight × per-pound rate, locked at slaughter.`,
      )}
      ${block(
        'Deposit (due at signing)',
        `<span style="font-size:22px;font-family:Georgia,serif;">${escape(formatCents(share.deposit_cents))}</span><br>
         <span style="font-size:12px;color:#6f655c;">Credited toward the final total. Balance due at pickup.</span>`,
      )}
      ${block(
        'Pickup preference',
        `<strong>${escape(pickup_preference ? PICKUP_LABELS[pickup_preference] ?? pickup_preference : 'To be confirmed')}</strong>`,
      )}
      <p style="margin:14px 0 4px 0;font-size:13px;font-weight:bold;">Terms (summary)</p>
      <ol style="margin:0 0 0 18px;padding:0;font-size:12px;color:#3a322d;line-height:1.5;">
        <li>Purchased for buyer's personal household consumption; not for resale.</li>
        <li>Ownership of the share transfers on the issued date, prior to slaughter.</li>
        <li>Custom-exempt processing under 9 CFR 303.1(a)(2)(i); packages bear the "Not For Sale" stamp.</li>
        <li>Deposit refundable (or applied to a replacement) if the animal is lost prior to slaughter through no fault of seller.</li>
        <li>Quality/yield depends on the processor and is not warranted by seller.</li>
        <li>Governed by the laws of the State of New York.</li>
      </ol>
      ${sigSection}
      <p style="margin:22px 0 0 0;font-size:11px;color:#6f655c;border-top:1px solid #2a2522;padding-top:10px;">
        Bill of sale ref: ${escape(animal.id.slice(0, 8))}/${escape(share.id.slice(0, 8))} · ${escape(FARM.name)} · ${escape(FARM.contact)}
      </p>
    </td></tr>`
  return shell(inner)
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return json({ error: 'RESEND_API_KEY missing on server' }, 500)
  }

  let payload: { data?: BillOfSaleData }
  try {
    payload = (await req.json()) as { data?: BillOfSaleData }
  } catch {
    return json({ error: 'Bad JSON' }, 400)
  }
  const data = payload.data
  if (!data?.customer?.email || !data?.share?.id || !data?.animal?.id) {
    return json({ error: 'Missing required fields' }, 400)
  }

  const html = renderBillOfSaleEmail(data)
  const subject = `Bill of sale — Creekside Fields — ${data.customer.name}`

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
  if (!resp.ok) {
    return json({ error: 'Resend failed', detail: respBody }, 502)
  }
  return json({ ok: true, id: respBody.id }, 200)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
