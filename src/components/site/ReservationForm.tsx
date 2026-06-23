import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge } from '../../lib/insforge'
import type { Animal, ShareOption } from '../../lib/types'
import type { InquiryPrefill } from '../storybook/ContactInquiryForm'

const SHARE_PCT: Record<string, number> = { whole: 100, half: 50, quarter: 25, eighth: 12.5 }

interface ReservationFormProps {
  /** Fetch an available share of this kind (used by the /shares accordion). */
  kind?: string
  /** Or supply an already-resolved share + animal (used by the /reserve page,
   *  which has already loaded them to render the header/image). When `share` is
   *  passed the form skips its own fetch. */
  share?: ShareOption | null
  animal?: Animal | null
  /** Optional prefill carried over from the contact-inquiry flow. */
  prefill?: InquiryPrefill | null
}

/**
 * The single reservation form. Collects the customer's details, creates the
 * reservation, then continues to the confirmation step. Used both inline on the
 * /shares accordion (pass `kind`) and on the standalone /reserve page (pass a
 * resolved `share` + `animal`).
 */
export default function ReservationForm({ kind, share: shareProp, animal: animalProp, prefill }: ReservationFormProps) {
  const navigate = useNavigate()
  const posthog = usePostHog()
  // "Controlled" = the parent resolved the share for us; otherwise we fetch by kind.
  const controlled = shareProp !== undefined
  const [fetchedShare, setFetchedShare] = useState<ShareOption | null>(null)
  const [fetchedAnimal, setFetchedAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(!controlled)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // In controlled mode use the props directly; otherwise use what we fetched.
  const share = controlled ? shareProp ?? null : fetchedShare
  const animal = controlled ? animalProp ?? null : fetchedAnimal

  useEffect(() => {
    if (controlled || !kind) return
    let active = true
    insforge.database
      .from('share_options')
      .select('*')
      .eq('kind', kind)
      .eq('status', 'available')
      .limit(1)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!active) return
        if (!data) {
          setLoading(false)
          return
        }
        const s = data as ShareOption
        setFetchedShare(s)
        const { data: animalData } = await insforge.database
          .from('animals')
          .select('*')
          .eq('id', s.animal_id)
          .single()
        if (active && animalData) setFetchedAnimal(animalData as Animal)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [kind, controlled])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!share) return
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    // Curated shares — customers don't pick cuts. Pickup is always the farm.
    const prefs: Record<string, unknown> = { pickup_preference: 'farm' }
    const sharePct = SHARE_PCT[share.kind] ?? null
    const customer_name = String(fd.get('customer_name') ?? '').trim()
    const customer_email = String(fd.get('customer_email') ?? '').trim()
    const customer_phone = String(fd.get('customer_phone') ?? '').trim() || null
    const customer_address = String(fd.get('customer_address') ?? '').trim() || null
    const reservationNotes = String(fd.get('notes') ?? '').trim() || null

    const reservationId = crypto.randomUUID()
    let insertError: { message?: string } | null = null
    try {
      const { error: dbError } = await insforge.database.from('reservations').insert([
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
      pickup_preference: 'farm',
      has_phone: Boolean(customer_phone),
      has_address: Boolean(customer_address),
      has_notes: Boolean(reservationNotes),
      source: controlled ? 'reserve_page' : 'shares_inline',
    })
    navigate(`/reserve/${share.id}/confirmed`, {
      state: {
        reservation_id: reservationId,
        customer: { name: customer_name, email: customer_email, phone: customer_phone, address: customer_address },
        share,
        animal,
        pickup_preference: 'farm',
        cut_preferences: prefs,
        notes: reservationNotes,
        share_percentage: sharePct,
        date: new Date().toISOString(),
      },
    })
  }

  if (loading) {
    return <p className="text-[0.9375rem] text-earth-500">Loading reservation details…</p>
  }
  if (!share) {
    return (
      <p className="text-[0.9375rem] leading-[1.7] text-earth-600">
        This share isn’t available to reserve online right now. Email us at{' '}
        <a className="font-medium text-copper-500 underline hover:text-copper-600" href="mailto:brookerhousehold@gmail.com">
          brookerhousehold@gmail.com
        </a>{' '}
        and we’ll help you reserve it.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="font-display text-[1.3rem] text-forest-800">Your details</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="customer_name" required defaultValue={prefill?.customer_name} />
          <Field label="Email" name="customer_email" type="email" required defaultValue={prefill?.customer_email} />
          <Field label="Phone" name="customer_phone" type="tel" required defaultValue={prefill?.customer_phone} />
          <Field label="Mailing address (optional)" name="customer_address" placeholder="123 Main St, Town, NY 12345" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="reservation-notes">
          Notes for us (optional)
        </label>
        <textarea
          id="reservation-notes"
          name="notes"
          rows={3}
          className="input"
          placeholder="Anything we should know? Dietary needs, questions…"
          defaultValue={prefill?.notes}
        />
      </div>

      <p className="text-[0.9375rem] leading-[1.7] text-earth-600">
        Shares will be available for pickup from our farm in Greenwich, NY — we’ll text you with the
        details once it’s ready.
      </p>

      {error && (
        <p className="rounded-md border border-copper-500 px-4 py-3 text-[0.9375rem] text-earth-700">{error}</p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? 'Reserving your share…' : 'Reserve this share'}
      </button>

      <p className="text-[0.8125rem] leading-[1.6] text-earth-500">
        Reserve your share now — we’ll email your confirmation right away and follow up with deposit
        details.
      </p>
    </form>
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
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-copper-500"> *</span>}
      </label>
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
