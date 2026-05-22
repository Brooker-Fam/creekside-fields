import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import BillOfSale, { type BillOfSaleData } from '../components/BillOfSale'
import SignaturePad, { type SignaturePadHandle } from '../components/SignaturePad'
import { insforge } from '../lib/insforge'

const FARM_EMAIL = 'brookerhousehold@gmail.com'

type LocationState = (BillOfSaleData & { reservation_id?: string }) | null

export default function ReserveConfirm() {
  const location = useLocation()
  const posthog = usePostHog()
  const state = location.state as LocationState
  const [data, setData] = useState<BillOfSaleData | null>(state)
  const reservationId = state?.reservation_id
  const padRef = useRef<SignaturePadHandle>(null)
  const [signing, setSigning] = useState(false)
  const [emailing, setEmailing] = useState(false)
  const [signed, setSigned] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInk, setHasInk] = useState(false)

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

  async function signAndSend() {
    if (!data || !reservationId) {
      setError("Reservation reference missing — we can't save the signature. Try reserving again.")
      return
    }
    const pad = padRef.current
    if (!pad || pad.isEmpty()) {
      setError('Please sign in the box first.')
      return
    }
    setError(null)
    setSigning(true)

    const blob = await pad.toBlob()
    if (!blob) {
      setError("Couldn't read the signature. Try again.")
      setSigning(false)
      return
    }
    const file = new File([blob], `signature-${reservationId}.png`, { type: 'image/png' })
    const path = `reservations/${reservationId}/${Date.now()}.png`
    const { data: uploaded, error: uploadError } = await insforge.storage
      .from('signatures')
      .upload(path, file)

    if (uploadError || !uploaded) {
      posthog?.captureException(uploadError ?? new Error('signature upload returned no data'), {
        context: 'signature_upload',
        reservation_id: reservationId,
      })
      setError(uploadError?.message ?? 'Could not upload signature.')
      setSigning(false)
      return
    }

    // Use the sign_reservation RPC — anon can't UPDATE reservations directly
    // (admin-only by RLS), so we go through a SECURITY DEFINER function that
    // only allows writing the three signature columns and only on an unsigned row.
    const signedAt = new Date().toISOString()
    const { error: updateError } = await insforge.database.rpc('sign_reservation', {
      p_reservation_id: reservationId,
      p_signature_url: uploaded.url,
      p_signature_key: uploaded.key,
    })

    if (updateError) {
      posthog?.captureException(updateError, {
        context: 'sign_reservation_rpc',
        reservation_id: reservationId,
      })
      setError(updateError.message ?? 'Could not save signature to reservation.')
      setSigning(false)
      return
    }

    const nextData: BillOfSaleData = {
      ...data,
      signature_url: uploaded.url,
      signed_at: signedAt,
    }
    setData(nextData)
    setSigned(true)
    setSigning(false)
    posthog?.capture('bill_of_sale_signed', {
      reservation_id: reservationId,
      share_kind: data.share.kind,
      share_id: data.share.id,
    })

    setEmailing(true)
    const resp = await fetch('/api/send-bill-of-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-POSTHOG-DISTINCT-ID': posthog?.get_distinct_id() ?? '',
        'X-POSTHOG-SESSION-ID': posthog?.get_session_id() ?? '',
      },
      body: JSON.stringify({ data: nextData }),
    })
    setEmailing(false)
    if (!resp.ok) {
      const body = await resp.json().catch(() => ({}))
      const msg = (body as { error?: string; detail?: { message?: string } }).detail?.message ?? (body as { error?: string }).error ?? `HTTP ${resp.status}`
      posthog?.capture('bill_of_sale_email_failed', {
        reservation_id: reservationId,
        status: resp.status,
        reason: msg,
      })
      setError(`Signature saved, but email failed: ${msg}`)
      return
    }
    posthog?.capture('bill_of_sale_email_sent', {
      reservation_id: reservationId,
      share_kind: data.share.kind,
    })
    setEmailSent(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center print:hidden">
        <p className="hand text-4xl text-blush-500">High five.</p>
        <h1 className="mt-2 font-display text-5xl">Your share is on hold.</h1>
        <p className="mx-auto mt-4 max-w-xl text-mud-600">
          Read the bill of sale below, then sign at the bottom — we'll email you a signed copy and
          send deposit instructions separately.
        </p>
      </div>

      <div className="mt-10">
        <BillOfSale data={data} />
      </div>

      <section className="card mt-8 print:hidden">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Sign the bill of sale</h2>
          {signed && (
            <span className="rounded-full border-2 border-sage-700 bg-sage-200 px-3 py-1 text-xs font-bold uppercase text-sage-700">
              Signed
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-mud-600">
          Use your finger on a phone, or your mouse on a laptop. The signed BoS will be emailed to{' '}
          <strong>{data.customer.email}</strong> with us on CC.
        </p>
        <div className="mt-4">
          <SignaturePad ref={padRef} onChange={setHasInk} />
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border-2 border-blush-500 bg-blush-100 p-3 text-sm">{error}</p>
        )}
        {emailSent && (
          <p className="mt-4 rounded-2xl border-2 border-sage-700 bg-sage-200 p-3 text-sm text-sage-700">
            Signed copy sent to {data.customer.email}. Check your inbox (and spam, just in case).
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={signAndSend}
            disabled={signing || emailing || !hasInk || emailSent}
            className="btn-primary disabled:opacity-60"
          >
            {signing
              ? 'Saving signature…'
              : emailing
                ? 'Sending email…'
                : emailSent
                  ? 'Sent ✓'
                  : 'Sign & email me a copy'}
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            🖨 Print
          </button>
          <Link to="/" className="btn-secondary">Back to the farm</Link>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-mud-600 print:hidden">
        Questions?{' '}
        <a className="underline" href={`mailto:${FARM_EMAIL}`}>
          {FARM_EMAIL}
        </a>
      </p>
    </div>
  )
}
