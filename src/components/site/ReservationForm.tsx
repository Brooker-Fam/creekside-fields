import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge } from '../../lib/insforge'
import type { Animal, ShareOption } from '../../lib/types'

const SHARE_PCT: Record<string, number> = { whole: 100, half: 50, quarter: 25, eighth: 12.5 }

/**
 * The reservation form, embeddable inline (e.g. inside the shares-page
 * accordion). Fetches an available share of the given kind, collects the
 * customer's details, creates the reservation, then continues to the
 * confirmation + bill-of-sale signature step. Mirrors the standalone
 * /reserve page's submit logic.
 */
export default function ReservationForm({ kind }: { kind: string }) {
  const navigate = useNavigate()
  const posthog = usePostHog()
  const [share, setShare] = useState<ShareOption | null>(null)
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
        setShare(s)
        const { data: animalData } = await insforge.database
          .from('animals')
          .select('*')
          .eq('id', s.animal_id)
          .single()
        if (active && animalData) setAnimal(animalData as Animal)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [kind])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!share) return
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    // Curated shares — customers don't pick cuts. pickup is always the farm.
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
      pickup_preference: 'farm',
      source: 'shares_inline',
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
        <p className="mt-1 text-[0.9375rem] text-earth-500">
          We’ll use this for the bill of sale and to reach you about pickup.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="customer_name" required />
          <Field label="Email" name="customer_email" type="email" required />
          <Field label="Phone (optional)" name="customer_phone" type="tel" />
          <Field label="Mailing address (optional)" name="customer_address" placeholder="123 Main St, Town, NY 12345" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor={`notes-${kind}`}>
          Notes for us (optional)
        </label>
        <textarea
          id={`notes-${kind}`}
          name="notes"
          rows={3}
          className="input"
          placeholder="Anything we should know? Dietary needs, questions…"
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
        Reserve your share now, then we’ll follow up within a day with the bill of sale and deposit
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
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-copper-500"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className="input" />
    </div>
  )
}
