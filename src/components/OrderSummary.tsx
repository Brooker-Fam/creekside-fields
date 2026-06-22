import type { Animal, ShareOption } from '../lib/types'
import { formatCents, priceRange } from '../lib/insforge'
import { SHARE_PRICE_RANGE } from '../content/sharesCopy'

export interface OrderSummaryData {
  customer: { name: string; email: string; phone: string | null; address: string | null }
  share: ShareOption
  animal: Animal
  pickup_preference: string | null
  share_percentage: number | null
  date: string
}

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

const FARM = {
  name: 'Creekside Fields',
  address: '49 Clarks Mills Rd, Greenwich, NY 12834',
  contact: 'brookerhousehold@gmail.com',
}

export default function OrderSummary({ data }: { data: OrderSummaryData }) {
  const { customer, share, animal, pickup_preference, date } = data
  const issued = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const dob = animal.dob
    ? new Date(animal.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' })
    : '—'
  const animalIdLine = [animal.breed, animal.sex && animal.sex !== 'unknown' ? `(${animal.sex})` : null].filter(Boolean).join(' ')
  const shareLabel = SHARE_KIND_TITLE[share.kind] ?? share.label ?? share.kind

  return (
    <article className="bos card mx-auto max-w-3xl bg-cream-50 print:border-0 print:bg-white print:p-0 print:shadow-none">
      <header className="border-b-2 border-mud-800 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="hand text-2xl text-blush-500 print:hidden">Reservation</p>
            <h2 className="font-display text-3xl">Reservation confirmation</h2>
          </div>
          <p className="text-right text-sm">
            <strong>Reserved:</strong> {issued}
          </p>
        </div>
        <p className="mt-2 text-sm text-mud-600">
          A summary of the pork share you've reserved with {FARM.name}. There's nothing to sign — keep
          this for your records and we'll be in touch with deposit and pickup details.
        </p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Block label="Farm">
          <p className="font-semibold">{FARM.name}</p>
          <p className="text-sm">{FARM.address}</p>
          <p className="text-sm">{FARM.contact}</p>
        </Block>
        <Block label="Reserved by">
          <p className="font-semibold">{customer.name}</p>
          {customer.address && <p className="text-sm">{customer.address}</p>}
          <p className="text-sm">{customer.email}</p>
          {customer.phone && <p className="text-sm">{customer.phone}</p>}
        </Block>
      </section>

      <section className="mt-6">
        <Block label="Your share">
          <p className="font-semibold">{shareLabel}</p>
          <ul className="mt-2 ml-5 list-disc text-sm">
            <li>Breed: <strong>{animalIdLine || animal.breed || '—'}</strong></li>
            <li>Date of birth: <strong>{dob}</strong></li>
            {animal.estimated_live_weight_lbs && (
              <li>Estimated live weight: <strong>{animal.estimated_live_weight_lbs} lb</strong></li>
            )}
            {animal.headline && <li>Common reference: "{animal.headline}"</li>}
          </ul>
        </Block>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Block label="Estimated price">
          <p className="font-display text-2xl">
            {SHARE_PRICE_RANGE[share.kind] ?? priceRange(share.est_total_low_cents, share.est_total_high_cents)}
          </p>
          <p className="mt-1 text-xs text-mud-600">
            Estimated range for this {share.kind} share. Your final price is a single flat amount,
            confirmed once the animal is processed — based on the actual weight of the meat and the
            cuts included. Processing is included; no added nitrates on any cured or smoked product.
          </p>
        </Block>
        <Block label="Deposit">
          <p className="font-display text-2xl">{formatCents(share.deposit_cents)}</p>
          <p className="mt-1 text-xs text-mud-600">
            Holds your share and is credited toward the final total. Balance due at pickup.
          </p>
        </Block>
      </section>

      <section className="mt-6">
        <Block label="Pickup">
          <p className="font-semibold">
            {pickup_preference ? PICKUP_LABELS[pickup_preference] ?? pickup_preference : 'To be confirmed'}
          </p>
          <p className="mt-2 text-sm">
            We'll confirm your pickup date once the slaughter date is scheduled with the processor.
            Processing fees are included in the final price; you pay a single invoice to the farm.
          </p>
        </Block>
      </section>

      <section className="mt-6">
        <h3 className="font-display text-lg">Good to know</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm">
          <li>
            Our pigs are raised on the farm's pasture without added growth hormones or antibiotics,
            and are processed at a USDA-inspected facility.
          </li>
          <li>
            Reserving holds your share. Your deposit confirms it and is credited toward the final
            total; the balance is due at pickup.
          </li>
          <li>
            Final price, quantity, and the exact mix of cuts depend on the finished animal and are
            confirmed after processing.
          </li>
        </ul>
      </section>

      <footer className="mt-8 border-t-2 border-mud-800 pt-3 text-xs text-mud-600">
        Reservation ref: {animal.id.slice(0, 8)}/{share.id.slice(0, 8)} · {FARM.name} · {FARM.contact}
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
