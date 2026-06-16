import type { Animal, ShareOption } from '../lib/types'
import { formatCents, priceRange } from '../lib/insforge'
import { SHARE_PRICE_RANGE } from '../content/sharesCopy'

export interface BillOfSaleData {
  customer: { name: string; email: string; phone: string | null; address: string | null }
  share: ShareOption
  animal: Animal
  pickup_preference: string | null
  share_percentage: number | null
  date: string
  signature_url?: string | null
  signed_at?: string | null
}

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

export default function BillOfSale({ data }: { data: BillOfSaleData }) {
  const { customer, share, animal, pickup_preference, share_percentage, date, signature_url, signed_at } = data
  const issued = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const dob = animal.dob
    ? new Date(animal.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' })
    : '—'
  const animalIdLine = [animal.breed, animal.sex && animal.sex !== 'unknown' ? `(${animal.sex})` : null].filter(Boolean).join(' ')
  const shareLabel = share_percentage ? `${share_percentage}% undivided interest` : (share.label ?? share.kind)

  return (
    <article className="bos card mx-auto max-w-3xl bg-cream-50 print:border-0 print:bg-white print:p-0 print:shadow-none">
      <header className="border-b-2 border-mud-800 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="hand text-2xl text-blush-500 print:hidden">Bill of sale</p>
            <h2 className="font-display text-3xl">Bill of Sale — Live Animal Share</h2>
          </div>
          <p className="text-right text-sm">
            <strong>Issued:</strong> {issued}
          </p>
        </div>
        <p className="mt-2 text-sm text-mud-600">
          This document records the sale of an undivided percentage interest in a specific live
          animal, executed prior to slaughter, pursuant to federal custom-exempt processing under
          9 CFR 303.1(a)(2)(i) and NY Ag &amp; Markets Law Article 5-A §96-d.
        </p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Block label="Seller">
          <p className="font-semibold">{FARM.name}</p>
          <p className="text-sm">{FARM.address}</p>
          <p className="text-sm">{FARM.contact}</p>
        </Block>
        <Block label="Buyer">
          <p className="font-semibold">{customer.name}</p>
          {customer.address && <p className="text-sm">{customer.address}</p>}
          <p className="text-sm">{customer.email}</p>
          {customer.phone && <p className="text-sm">{customer.phone}</p>}
        </Block>
      </section>

      <section className="mt-6">
        <Block label="Item sold">
          <p className="font-semibold">
            {shareLabel} in one (1) live hog described as:
          </p>
          <ul className="mt-2 ml-5 list-disc text-sm">
            <li>Breed: <strong>{animalIdLine || animal.breed || '—'}</strong></li>
            <li>Date of birth: <strong>{dob}</strong></li>
            {animal.estimated_live_weight_lbs && (
              <li>Estimated live weight at signing: <strong>{animal.estimated_live_weight_lbs} lb</strong></li>
            )}
            <li>Internal animal ID: <strong>{animal.id}</strong></li>
            {animal.headline && <li>Common reference: "{animal.headline}"</li>}
          </ul>
        </Block>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Block label="Price">
          <p className="font-display text-2xl">
            {SHARE_PRICE_RANGE[share.kind] ?? priceRange(share.est_total_low_cents, share.est_total_high_cents)}
          </p>
          <p className="mt-1 text-xs text-mud-600">
            Estimated range for this {share.kind} share. Your final price is a single flat amount,
            confirmed once the animal is processed — based on the actual weight of the meat and the
            cuts included. Processing is included; no added nitrates on any cured or smoked product.
          </p>
        </Block>
        <Block label="Deposit (due at signing)">
          <p className="font-display text-2xl">{formatCents(share.deposit_cents)}</p>
          <p className="mt-1 text-xs text-mud-600">
            Credited toward the final total. Balance due at pickup.
          </p>
        </Block>
      </section>

      <section className="mt-6">
        <Block label="Pickup preference">
          <p className="font-semibold">
            {pickup_preference ? PICKUP_LABELS[pickup_preference] ?? pickup_preference : 'To be confirmed'}
          </p>
          <p className="mt-2 text-sm">
            Pickup location and date will be confirmed by Seller once the slaughter date is scheduled
            with the processor. Processing fees are included in the final price; Buyer pays a single
            invoice to Seller.
          </p>
        </Block>
      </section>

      <section className="mt-6">
        <h3 className="font-display text-lg">Terms &amp; recitals</h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
          <li>
            <strong>Personal consumption.</strong> Buyer represents that this share is purchased
            for Buyer's personal household consumption (Buyer, Buyer's household, non-paying
            guests, and employees) and is not for resale.
          </li>
          <li>
            <strong>Pre-slaughter transfer.</strong> Ownership of the share described above
            transfers from Seller to Buyer on the Issued date above, which precedes the date the
            animal is delivered to the custom processor.
          </li>
          <li>
            <strong>Custom-exempt processing.</strong> Seller, acting solely as scheduling agent
            for Buyer and the other share-owners of the animal, will deliver the animal to a
            custom-exempt processor under 9 CFR 303.1(a)(2)(i) and remit the processor's fees on
            Buyer's behalf. Processing fees are passed through at cost in the final invoice. Every
            wrapped package will bear the federally-required "Not For Sale" stamp.
          </li>
          <li>
            <strong>Risk of loss.</strong> If the animal is lost, injured, or dies prior to
            slaughter through no fault of the Seller, the deposit is fully refundable, or may be
            applied to a comparable replacement share at Buyer's option.
          </li>
          <li>
            <strong>No warranties beyond the live animal.</strong> Seller warrants the animal was
            raised on Seller's pasture without growth hormones or antibiotics. Quality, yield,
            and individual cuts depend on the processor and are not warranted by Seller.
          </li>
          <li>
            <strong>Governing law.</strong> This agreement is governed by the laws of the State
            of New York.
          </li>
        </ol>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <SignatureBlock
          label="Buyer signature"
          name={customer.name}
          signatureUrl={signature_url}
          signedAt={signed_at}
        />
        <SignatureBlock label="Seller signature" name={FARM.name} />
      </section>

      <footer className="mt-8 border-t-2 border-mud-800 pt-3 text-xs text-mud-600">
        Bill of sale ref: {animal.id.slice(0, 8)}/{share.id.slice(0, 8)} · {FARM.name} · {FARM.contact}
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

function SignatureBlock({
  label,
  name,
  signatureUrl,
  signedAt,
}: {
  label: string
  name: string
  signatureUrl?: string | null
  signedAt?: string | null
}) {
  const dateStr = signedAt
    ? new Date(signedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mud-600">{label}</p>
      <div className="flex h-12 items-end border-b-2 border-mud-800">
        {signatureUrl && (
          <img src={signatureUrl} alt="Signature" className="max-h-12 max-w-full object-contain" />
        )}
      </div>
      <p className="mt-1 text-sm">{name}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-mud-600">
        <span>Date:</span>
        {dateStr ? (
          <span className="flex-1">{dateStr}</span>
        ) : (
          <div className="h-4 flex-1 border-b border-mud-800" />
        )}
      </div>
    </div>
  )
}
