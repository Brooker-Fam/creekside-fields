import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge, formatCents, priceRange } from '../lib/insforge'
import type { Animal, ShareOption } from '../lib/types'
import { SHARE_PRICE_RANGE } from '../content/sharesCopy'
import { INQUIRY_PREFILL_KEY, type InquiryPrefill } from '../components/storybook/ContactInquiryForm'

const SHARE_PCT: Record<string, number> = {
  whole: 100,
  half: 50,
  quarter: 25,
  eighth: 12.5,
}

const SHARE_KIND_TITLE: Record<string, string> = {
  whole: 'Whole hog',
  half: 'Half hog',
  quarter: 'Quarter hog',
  eighth: 'Eighth hog',
}

const SHARE_KIND_BLURB: Record<string, { meat: string; freezer: string }> = {
  whole:   { meat: '~180–240 lb of cut & wrapped pork', freezer: 'fills a chest freezer' },
  half:    { meat: '~90–120 lb of cut & wrapped pork',  freezer: 'fits an upright freezer' },
  quarter: { meat: '~45–60 lb of cut & wrapped pork',   freezer: 'fits in a freezer drawer' },
  eighth:  { meat: '~18–20 lb of cut & wrapped pork',   freezer: 'fits a freezer shelf' },
}

function readInquiryPrefill(): InquiryPrefill | null {
  try {
    const raw = sessionStorage.getItem(INQUIRY_PREFILL_KEY)
    if (!raw) return null
    sessionStorage.removeItem(INQUIRY_PREFILL_KEY)
    return JSON.parse(raw) as InquiryPrefill
  } catch {
    sessionStorage.removeItem(INQUIRY_PREFILL_KEY)
    return null
  }
}

export default function Reserve() {
  const { shareId } = useParams()
  const navigate = useNavigate()
  const posthog = usePostHog()
  const [share, setShare] = useState<ShareOption | null>(null)
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prefill] = useState(readInquiryPrefill)

  useEffect(() => {
    if (!shareId) return
    // The param is either a specific share_option UUID (legacy/admin link) or a
    // kind name (whole|half|quarter|eighth) — the customer-facing flow always
    // uses kind. If it's a kind, pick any available share of that kind.
    const isKind = shareId in SHARE_PCT
    const query = isKind
      ? insforge.database
          .from('share_options')
          .select('*')
          .eq('kind', shareId)
          .eq('status', 'available')
          .limit(1)
          .maybeSingle()
      : insforge.database.from('share_options').select('*').eq('id', shareId).maybeSingle()
    query.then(async ({ data }) => {
      if (!data) {
        setLoading(false)
        return
      }
      const s = data as ShareOption
      setShare(s)
      const { data: animalData } = await insforge.database
        .from('animals').select('*').eq('id', s.animal_id).single()
      if (animalData) setAnimal(animalData as Animal)
      setLoading(false)
    })
  }, [shareId])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!share) return
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    // Curated shares — customers don't pick cuts. We only stash the pickup preference here
    // (the column is still named cut_preferences for backward compatibility).
    const prefs: Record<string, unknown> = {}

    const sharePct = SHARE_PCT[share.kind] ?? null
    const customer_name = String(fd.get('customer_name') ?? '').trim()
    const customer_email = String(fd.get('customer_email') ?? '').trim()
    const customer_phone = String(fd.get('customer_phone') ?? '').trim() || null
    const customer_address = String(fd.get('customer_address') ?? '').trim() || null
    const pickupPreference = 'farm' // everyone picks up from the farm once the share is ready
    const reservationNotes = String(fd.get('notes') ?? '').trim() || null
    if (pickupPreference) prefs.pickup_preference = pickupPreference

    // Generate the reservation ID client-side so we don't need a public SELECT
    // policy on `reservations` to read the row back after insert. The customer
    // still gets a stable id for the signature step + admin lookup.
    const reservationId = crypto.randomUUID()
    let insertError: { message?: string } | null = null
    try {
      const { error: dbError } = await insforge.database
        .from('reservations')
        .insert([
          {
            id: reservationId,
            share_option_id: share.id,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            share_percentage: sharePct,
            cut_preferences: prefs,
            notes: reservationNotes,
          },
        ])
      insertError = dbError
    } catch (err) {
      posthog?.captureException(err, { context: 'reservation_insert_exception', share_kind: share.kind, share_id: share.id })
      setError(err instanceof Error ? err.message : 'Something went sideways. Try again or email us.')
      setSubmitting(false)
      return
    }

    if (insertError) {
      posthog?.captureException(insertError, { context: 'reservation_insert', share_kind: share.kind, share_id: share.id })
      posthog?.capture('reservation_submit_failed', {
        share_kind: share.kind,
        share_id: share.id,
        reason: insertError.message,
      })
      setError(insertError.message ?? 'Something went sideways. Try again or email us.')
      setSubmitting(false)
      return
    }
    posthog?.identify(customer_email, { email: customer_email, name: customer_name })
    posthog?.capture('reservation_submitted', {
      share_kind: share.kind,
      share_id: share.id,
      share_percentage: sharePct,
      animal_id: share.animal_id,
      deposit_cents: share.deposit_cents,
      est_total_low_cents: share.est_total_low_cents,
      est_total_high_cents: share.est_total_high_cents,
      pickup_preference: pickupPreference,
      has_phone: Boolean(customer_phone),
      has_address: Boolean(customer_address),
      has_notes: Boolean(reservationNotes),
    })
    navigate(`/reserve/${share.id}/confirmed`, {
      state: {
        reservation_id: reservationId,
        customer: { name: customer_name, email: customer_email, phone: customer_phone, address: customer_address },
        share,
        animal,
        pickup_preference: pickupPreference,
        cut_preferences: prefs,
        notes: reservationNotes,
        share_percentage: sharePct,
        date: new Date().toISOString(),
      },
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="eyebrow">Loading</p>
        <p className="mt-4 text-earth-600">Gathering share details…</p>
      </div>
    )
  }
  if (!share || !animal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="eyebrow">Unavailable</p>
        <h1 className="mt-2 font-display text-4xl text-forest-800">That share isn't available.</h1>
        <p className="mt-4 text-earth-600">It may have just been claimed. Head back and pick another size.</p>
        <Link to="/" className="btn-secondary mt-6 inline-flex">Back to the farm</Link>
      </div>
    )
  }

  const kindTitle = SHARE_KIND_TITLE[share.kind] ?? share.label ?? share.kind
  const blurb = SHARE_KIND_BLURB[share.kind]
  const heroImage = animal.hero_image_url ?? '/farm-media/pig-grazing.jpg'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/" className="text-sm font-medium text-copper-500 hover:underline">
        ← Back to shares
      </Link>
      <p className="eyebrow mt-8">Reserve</p>
      <h1 className="mt-3 font-display text-4xl text-forest-800 sm:text-5xl">{kindTitle}</h1>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-mud-600">
        <span>{animal.breed}</span>
        <span>·</span>
        <span>
          Est. {SHARE_PRICE_RANGE[share.kind] ?? priceRange(share.est_total_low_cents, share.est_total_high_cents)}
        </span>
        <span>·</span>
        <span>Deposit {formatCents(share.deposit_cents)}</span>
      </div>

      <div className="card mt-6 grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
        <img
          src={heroImage}
          alt="Pasture-raised Gloucestershire Old Spots"
          className="h-28 w-full rounded-lg border border-sage-700/25 object-cover shadow-sketch sm:h-32"
        />
        <div>
          {blurb && (
            <p className="font-display text-xl">{blurb.meat}</p>
          )}
          {blurb && (
            <p className="text-sm text-mud-600">{blurb.freezer}</p>
          )}
          <p className="mt-2 text-sm">
            <Link to="/about" className="font-semibold text-blush-500 hover:underline">
              How it works <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </div>

      <form id="reserve-form" onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="card">
          <h2 className="font-display text-2xl">Your details</h2>
          <p className="mt-1 text-sm text-mud-600">
            We'll use this for the bill of sale and to reach you about pickup.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="customer_name" required defaultValue={prefill?.customer_name} />
            <Field label="Email" name="customer_email" type="email" required defaultValue={prefill?.customer_email} />
            <Field label="Phone (optional)" name="customer_phone" type="tel" defaultValue={prefill?.customer_phone} />
            <Field label="Mailing address (optional)" name="customer_address" placeholder="123 Main St, Town, NY 12345" />
          </div>
        </section>

        <section className="card">
          <h2 className="font-display text-2xl">Pickup</h2>
          <p className="mt-1 text-sm text-mud-600">
            You'll pick up your share from us at the farm in Greenwich, NY once it's ready. The
            slaughter date isn't scheduled yet — we'll text you with the details when it is.
          </p>
        </section>

        <section className="card bg-cream-50">
          <h2 className="font-display text-2xl">What's included</h2>
          <p className="mt-1 text-sm text-mud-700">
            Every share is a thoughtfully curated assortment — bacon, ham, chops, tenderloin,
            roasts, ribs, bratwurst, breakfast sausage, and ground pork. These are the cuts we
            expect to include, but because these are real animals, the exact cuts and quantities
            vary slightly from share to share. Anything you definitely do or don't want? Let us
            know in the notes below.
          </p>
        </section>

        <section className="card">
          <h2 className="font-display text-2xl">Notes for us</h2>
          <textarea
            name="notes"
            rows={3}
            className="input mt-3"
            placeholder="Anything we should know? Pickup timing, dietary stuff, questions…"
            defaultValue={prefill?.notes}
          />
        </section>

        {error && (
          <p className="rounded-lg border border-blush-500 bg-blush-100 p-4 text-sm">{error}</p>
        )}

        <section className="card bg-cream-50">
          <h2 className="font-display text-2xl">What happens next</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mud-700">
            <li>We email you a one-page bill of sale to sign.</li>
            <li>You pay the deposit to hold the share — it's credited toward your final price.</li>
            <li>We raise and process your pig, then confirm your flat final price once the processing weights are known.</li>
            <li>When it's ready, you pick it up from the farm or the processor — whichever you chose — and pay the balance in one bill to us.</li>
          </ol>
        </section>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mud-600">
            Submitting holds the share — we'll be in touch within a day with the bill of sale and
            deposit details.
          </p>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? 'Reserving your share…' : 'Reserve this share'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}{required && <span className="text-blush-500"> *</span>}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="input"
      />
    </div>
  )
}
