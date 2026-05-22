import type { Animal, Processor, Reservation, ShareOption } from '../lib/types'
import { formatCents, getShareRateCents } from '../lib/insforge'

const FARM = {
  name: 'Creekside Fields',
  address: '49 Clarks Mills Rd, Greenwich, NY 12834',
  contact: 'brookerhousehold@gmail.com',
  payments: 'Pay by check, Venmo, or Zelle. Details on the next email; reply if you need them now.',
}

export interface InvoiceData {
  reservation: Reservation
  share: ShareOption
  animal: Animal
  processor: Processor | null
}

export function computeInvoice(data: InvoiceData) {
  const { reservation, share, animal } = data
  const sharePct = reservation.share_percentage ?? sharePctFromKind(share.kind)
  const hangingWeight = animal.hanging_weight_lbs
  const rate = getShareRateCents(share, animal)
  const shareHwLbs = hangingWeight != null && sharePct != null ? (hangingWeight * sharePct) / 100 : null
  const finalTotalCents =
    shareHwLbs != null && rate != null ? Math.round(shareHwLbs * rate) : reservation.final_total_cents ?? null
  const depositCents = share.deposit_cents
  const balanceCents = finalTotalCents != null ? Math.max(0, finalTotalCents - (reservation.total_paid_cents || 0)) : null
  return {
    sharePct,
    hangingWeight,
    rate,
    shareHwLbs,
    finalTotalCents,
    depositCents,
    balanceCents,
    canCompute: shareHwLbs != null && rate != null,
  }
}

export function sharePctFromKind(kind: string): number {
  return { whole: 100, half: 50, quarter: 25, eighth: 12.5 }[kind] ?? 0
}

export default function Invoice({ data }: { data: InvoiceData }) {
  const { reservation, animal, processor } = data
  const calc = computeInvoice(data)
  const issued = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const slaughter = animal.slaughter_date
    ? new Date(animal.slaughter_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : null

  return (
    <article className="bos card mx-auto max-w-3xl bg-cream-50 print:border-0 print:bg-white print:p-0 print:shadow-none">
      <header className="border-b-2 border-mud-800 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="hand text-2xl text-blush-500 print:hidden">Invoice</p>
            <h2 className="font-display text-3xl">Final Invoice — Live Animal Share</h2>
          </div>
          <p className="text-right text-sm">
            <strong>Issued:</strong> {issued}
            <br />
            <span className="text-mud-600">Ref: {reservation.id.slice(0, 8)}</span>
          </p>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Block label="From">
          <p className="font-semibold">{FARM.name}</p>
          <p className="text-sm">{FARM.address}</p>
          <p className="text-sm">{FARM.contact}</p>
        </Block>
        <Block label="Bill to">
          <p className="font-semibold">{reservation.customer_name}</p>
          {reservation.customer_address && <p className="text-sm">{reservation.customer_address}</p>}
          <p className="text-sm">{reservation.customer_email}</p>
          {reservation.customer_phone && <p className="text-sm">{reservation.customer_phone}</p>}
        </Block>
      </section>

      <section className="mt-6">
        <Block label="What you bought">
          <p className="font-semibold">
            {calc.sharePct}% undivided interest in one (1) live hog
          </p>
          <p className="mt-1 text-sm">
            {animal.breed}
            {animal.headline ? ` · "${animal.headline}"` : ''}
            {slaughter ? ` · processed ${slaughter}` : ''}
          </p>
        </Block>
      </section>

      {calc.canCompute ? (
        <section className="mt-6">
          <Block label="Charges">
            <table className="w-full text-sm">
              <tbody>
                <Row label="Animal hanging weight" value={`${calc.hangingWeight} lb`} />
                <Row label="Your share" value={`${calc.sharePct}% × ${calc.hangingWeight} lb = ${calc.shareHwLbs?.toFixed(1)} lb HW`} />
                <Row label="Rate" value={`$${((calc.rate ?? 0) / 100).toFixed(2)} / lb hanging weight`} />
                <Row label="Subtotal" value={formatCents(calc.finalTotalCents)} bold />
                <Row label="Deposit paid" value={`− ${formatCents(reservation.total_paid_cents || 0)}`} />
                <Row label="Balance due" value={formatCents(calc.balanceCents)} bold highlight />
              </tbody>
            </table>
            <p className="mt-3 text-xs text-mud-600">
              Hanging weight is the dressed carcass weight; your share is your % of that weight × the
              per-pound rate. Processing fees (kill, cut, wrap, smoking) are included in this total —
              one bill, paid to us.
            </p>
          </Block>
        </section>
      ) : (
        <section className="mt-6">
          <Block label="Charges">
            <p className="text-sm italic text-mud-600">
              Hanging weight or per-lb rate not set yet — invoice cannot be finalized. Set the
              hanging weight on the animal (Animals tab) and the rate on this share (Shares tab),
              then refresh.
            </p>
          </Block>
        </section>
      )}

      <section className="mt-6">
        <Block label="How to pay">
          <p className="text-sm">{FARM.payments}</p>
          {processor && (
            <p className="mt-2 text-sm">
              <strong>Pickup location:</strong> {processor.name}
              {processor.address ? ` — ${processor.address}` : ''} (or from the farm if you'd prefer).
            </p>
          )}
        </Block>
      </section>

      <footer className="mt-8 border-t-2 border-mud-800 pt-3 text-xs text-mud-600">
        Invoice ref: {reservation.id.slice(0, 8)} · {FARM.name} · {FARM.contact}
      </footer>
    </article>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-mud-800 bg-cream-50 p-4 print:border-mud-800">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mud-600">{label}</p>
      {children}
    </div>
  )
}

function Row({ label, value, bold, highlight }: { label: string; value: React.ReactNode; bold?: boolean; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'border-t-2 border-mud-800' : 'border-t border-mud-800/10'}>
      <td className={`py-2 ${bold ? 'font-semibold' : ''}`}>{label}</td>
      <td className={`py-2 text-right ${bold ? 'font-display text-lg' : ''} ${highlight ? 'text-blush-500' : ''}`}>{value}</td>
    </tr>
  )
}
