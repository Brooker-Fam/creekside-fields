import { type FormEvent, useEffect, useRef, useState } from 'react'
import { usePostHog } from '@posthog/react'
import Field, { EmailField } from './Field'
import { Sprig } from './Whimsy'

const FARM_EMAIL = 'brookerhousehold@gmail.com'

/**
 * "Get in touch" form. Sends the message through /api/send-order (kind
 * "message"): the farm gets it with Reply-To set to the sender, and the sender
 * gets a copy. If sending fails, offers a pre-filled email instead.
 */
export default function ContactForm() {
  const posthog = usePostHog()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackHref, setFallbackHref] = useState<string | null>(null)
  const [sent, setSent] = useState<{ firstName: string; email: string; emailed: boolean } | null>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!sent) return
    thanksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    thanksRef.current?.focus({ preventScroll: true })
  }, [sent])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('customer_name') ?? '').trim()
    const email = String(fd.get('customer_email') ?? '').trim()
    const phone = String(fd.get('customer_phone') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()

    setSubmitting(true)
    setError(null)
    setFallbackHref(null)
    try {
      const resp = await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-POSTHOG-DISTINCT-ID': posthog?.get_distinct_id() ?? '',
          'X-POSTHOG-SESSION-ID': posthog?.get_session_id() ?? '',
        },
        body: JSON.stringify({ order: { kind: 'message', customer: { name, email, phone }, notes: message } }),
      })
      const body = (await resp.json().catch(() => ({}))) as { error?: string; customerEmailed?: boolean }
      if (resp.status === 400 && body.error) {
        setError(body.error)
        return
      }
      if (!resp.ok) throw new Error(body.error ?? `HTTP ${resp.status}`)
      posthog?.identify(email, { email, name })
      posthog?.capture('contact_message_sent', { has_phone: Boolean(phone) })
      setSent({ firstName: name.split(' ')[0], email, emailed: body.customerEmailed !== false })
    } catch (err) {
      posthog?.captureException(err, { context: 'contact_message' })
      setError('We couldn’t send your message just now.')
      const mailBody = `${message}\n\n${name}${phone ? `\n${phone}` : ''}\n`
      setFallbackHref(
        `mailto:${FARM_EMAIL}?subject=${encodeURIComponent('Question for Creekside Fields')}&body=${encodeURIComponent(mailBody)}`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center" role="status">
        <Sprig className="mx-auto" />
        <h2
          ref={thanksRef}
          tabIndex={-1}
          className="mt-4 font-display text-[1.7rem] text-forest-800 focus:outline-none"
        >
          Thanks, {sent.firstName}!
        </h2>
        <p className="mx-auto mt-3 text-[1.0625rem] leading-[1.7] text-earth-600" style={{ maxWidth: '32rem' }}>
          Your note is on its way to us
          {sent.emailed ? `, and we’ve emailed you a copy at ${sent.email}.` : '.'} We’ll write back
          soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label="Name" name="customer_name" autoComplete="name" maxLength={120} className="sm:col-span-2" />
        <EmailField id="contact-email" name="customer_email" />
        <Field
          id="contact-phone"
          label="Phone"
          name="customer_phone"
          type="tel"
          autoComplete="tel"
          maxLength={40}
          required={false}
        />
      </div>
      <div>
        <label className="label" htmlFor="contact-message">
          Message<span className="text-copper-500"> *</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          className="input"
          placeholder="Hi! I was wondering…"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-copper-500 px-4 py-3 text-[0.9375rem] leading-[1.6] text-earth-700">
          <p>{error}</p>
          {fallbackHref && (
            <p className="mt-1.5">
              <a className="font-semibold text-copper-500 underline hover:text-copper-600" href={fallbackHref}>
                Email it to us instead
              </a>{' '}
              (it’s filled in for you), or write to {FARM_EMAIL}.
            </p>
          )}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
