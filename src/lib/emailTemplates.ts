import type { BillOfSaleData } from '../components/BillOfSale'
import { formatCents, priceRange } from './insforge'
import { SHARE_PRICE_RANGE } from '../content/sharesCopy'

const PICKUP_LABELS: Record<string, string> = {
  farm: 'Farm pickup (Greenwich, NY)',
  processor: 'Direct from the processor',
  either: 'Either — to be confirmed when slaughter is scheduled',
}

const FARM = {
  name: 'Creekside Fields',
  address: '49 Clarks Mills Rd, Greenwich, NY 12834',
  contact: 'brookerhousehold@gmail.com',
}

function escape(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

function block(label: string, body: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #2a2522;border-radius:14px;padding:14px;margin:0 0 12px 0;">
    <tr><td style="font-size:11px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:#6f655c;padding-bottom:6px;">${escape(label)}</td></tr>
    <tr><td style="font-size:14px;line-height:1.5;">${body}</td></tr>
  </table>`
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function fmtMonth(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' })
}

export function renderBillOfSaleEmail(data: BillOfSaleData): string {
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
           ${animal.estimated_live_weight_lbs ? `<li>Est. live weight: <strong>${animal.estimated_live_weight_lbs} lb</strong></li>` : ''}
           <li>Animal ID: <strong>${escape(animal.id)}</strong></li>
         </ul>`,
      )}
      ${block(
        'Price',
        `Estimated range: <strong>${escape(SHARE_PRICE_RANGE[share.kind] ?? priceRange(share.est_total_low_cents, share.est_total_high_cents))}</strong><br>
         Your final price is a single flat amount for this ${escape(share.kind)} share, confirmed once the animal is processed — based on the actual weight of the meat and the cuts included.`,
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

export interface InvoiceEmailData {
  customer: { name: string; email: string }
  share: { label: string | null; kind: string }
  finalTotalCents: number
  depositPaidCents: number
  balanceCents: number
  processor: { name: string; address: string | null } | null
}

export function renderInvoiceEmail(d: InvoiceEmailData): string {
  const dollar = (c: number) => `$${(c / 100).toFixed(0)}`
  const pickup = d.processor
    ? `Pickup at <strong>${escape(d.processor.name)}</strong>${d.processor.address ? ` (${escape(d.processor.address)})` : ''}. Processing is already included in the total above — one bill, paid to us.`
    : 'Pickup details to follow.'

  const inner = `
    <tr><td style="border-bottom:2px solid #2a2522;padding-bottom:12px;">
      <h1 style="margin:0;font-size:24px;">Final invoice — ${escape(d.share.label ?? d.share.kind)}</h1>
      <p style="margin:6px 0 0 0;font-size:13px;color:#6f655c;">${escape(FARM.name)}</p>
    </td></tr>
    <tr><td style="padding-top:18px;">
      <p style="margin:0 0 14px 0;font-size:15px;">Hi ${escape(d.customer.name.split(' ')[0])}, your pork is processed and ready.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #2a2522;border-radius:14px;padding:14px;font-size:14px;">
        <tr><td><strong>Your share total</strong></td><td align="right"><strong>${dollar(d.finalTotalCents)}</strong></td></tr>
        <tr><td>Less deposit paid</td><td align="right">− ${dollar(d.depositPaidCents)}</td></tr>
        <tr><td style="padding-top:8px;border-top:1px solid #2a2522;font-size:16px;"><strong>Balance due</strong></td><td align="right" style="padding-top:8px;border-top:1px solid #2a2522;font-size:16px;"><strong>${dollar(d.balanceCents)}</strong></td></tr>
      </table>
      <p style="margin:12px 0 0 0;font-size:12px;color:#6f655c;">A single flat price for your share, set from the actual weight of the meat and the cuts included.</p>
      <p style="margin:16px 0 0 0;font-size:14px;">${pickup}</p>
      <p style="margin:14px 0 0 0;font-size:14px;">Payment: check (to ${escape(FARM.name)}), Venmo, or Zelle — reply for details.</p>
      <p style="margin:22px 0 0 0;font-size:14px;">Thanks,<br>Matt — Creekside Fields</p>
    </td></tr>`
  return shell(inner)
}
