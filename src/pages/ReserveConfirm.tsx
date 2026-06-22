import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import OrderSummary, { type OrderSummaryData } from '../components/OrderSummary'

const FARM_EMAIL = 'brookerhousehold@gmail.com'

type LocationState = (OrderSummaryData & { reservation_id?: string }) | null

export default function ReserveConfirm() {
  const location = useLocation()
  const posthog = usePostHog()
  const state = location.state as LocationState
  const data = state
  const reservationId = state?.reservation_id
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const sentRef = useRef(false)

  useEffect(() => {
    if (!data || !reservationId) return
    // Email the confirmation exactly once per reservation. The sessionStorage
    // guard survives React StrictMode's double-mount and an accidental refresh.
    const guardKey = `confirmation-emailed:${reservationId}`
    if (sentRef.current || sessionStorage.getItem(guardKey)) return
    sentRef.current = true
    sessionStorage.setItem(guardKey, '1')

    const payload: OrderSummaryData = {
      customer: data.customer,
      share: data.share,
      animal: data.animal,
      pickup_preference: data.pickup_preference,
      share_percentage: data.share_percentage,
      date: data.date,
    }

    setEmailStatus('sending')
    fetch('/api/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-POSTHOG-DISTINCT-ID': posthog?.get_distinct_id() ?? '',
        'X-POSTHOG-SESSION-ID': posthog?.get_session_id() ?? '',
      },
      body: JSON.stringify({ data: payload }),
    })
      .then(async (resp) => {
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}))
          const msg =
            (body as { error?: string; detail?: { message?: string } }).detail?.message ??
            (body as { error?: string }).error ??
            `HTTP ${resp.status}`
          sessionStorage.removeItem(guardKey)
          sentRef.current = false
          posthog?.capture('confirmation_email_failed', {
            reservation_id: reservationId,
            status: resp.status,
            reason: msg,
          })
          setError(`We couldn't email your confirmation: ${msg}`)
          setEmailStatus('error')
          return
        }
        posthog?.capture('confirmation_email_sent', {
          reservation_id: reservationId,
          share_kind: data.share.kind,
        })
        setEmailStatus('sent')
      })
      .catch((err) => {
        sessionStorage.removeItem(guardKey)
        sentRef.current = false
        posthog?.captureException(err, { context: 'confirmation_email', reservation_id: reservationId })
        setError("We couldn't email your confirmation. Don't worry — your share is still reserved.")
        setEmailStatus('error')
      })
  }, [data, reservationId, posthog])

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="hand text-4xl text-blush-500">High five.</p>
        <h1 className="mt-2 font-display text-5xl">Your share is on hold.</h1>
        <p className="mt-6 text-lg text-mud-600">
          We'll email you within a day to confirm and arrange the deposit.
        </p>
        <p className="mt-2 text-mud-600">
          Got a question?{' '}
          <a className="font-semibold text-blush-500 underline" href={`mailto:${FARM_EMAIL}`}>
            Email us →
          </a>
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/" className="btn-secondary">Back to the farm</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center print:hidden">
        <p className="hand text-4xl text-blush-500">High five.</p>
        <h1 className="mt-2 font-display text-5xl">Your share is reserved.</h1>
        <p className="mx-auto mt-4 max-w-xl text-mud-600">
          Here's your reservation confirmation. We're emailing a copy to{' '}
          <strong>{data.customer.email}</strong> (with us on CC), and we'll follow up with deposit
          instructions and pickup details.
        </p>
      </div>

      <div className="mt-10">
        <OrderSummary data={data} />
      </div>

      <div className="mt-6 print:hidden">
        {emailStatus === 'sent' && (
          <p className="rounded-2xl border-2 border-sage-700 bg-sage-200 p-3 text-sm text-sage-700">
            A copy is on its way to {data.customer.email}. Check your inbox (and spam, just in case).
          </p>
        )}
        {emailStatus === 'sending' && (
          <p className="rounded-2xl border-2 border-mud-800/30 bg-cream-50 p-3 text-sm text-mud-600">
            Emailing your copy…
          </p>
        )}
        {error && (
          <p className="rounded-2xl border-2 border-blush-500 bg-blush-100 p-3 text-sm">{error}</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
        <button onClick={() => window.print()} className="btn-secondary">
          🖨 Print
        </button>
        <Link to="/" className="btn-secondary">Back to the farm</Link>
      </div>

      <p className="mt-8 text-center text-sm text-mud-600 print:hidden">
        Questions?{' '}
        <a className="underline" href={`mailto:${FARM_EMAIL}`}>
          {FARM_EMAIL}
        </a>
      </p>
    </div>
  )
}
