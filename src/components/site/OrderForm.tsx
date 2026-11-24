import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { usePostHog } from '@posthog/react'
import { MAX_PER_ITEM, type OrderCounts, type OrderFormCopy, type OrderItem } from '../../content/orders'

const FARM_EMAIL = 'brookerhousehold@gmail.com'

interface SentOrder {
  firstName: string
  email: string
  summary: string
}

/**
 * Order form shared by the geese & ducks page and the individual pork cuts
 * section. Customers pick quantities and leave their details; the order goes to
 * /api/send-order, which emails them a confirmation with the farm CC'd. If that
 * fails, the form offers a pre-filled email to the farm so the order isn't lost.
 */
export default function OrderForm({ items, copy }: { items: OrderItem[]; copy: OrderFormCopy }) {
  const posthog = usePostHog()
  const [counts, setCounts] = useState<OrderCounts>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackHref, setFallbackHref] = useState<string | null>(null)
  const [sent, setSent] = useState<SentOrder | null>(null)
  const [nothingChosen, setNothingChosen] = useState(false)
  const pickerRef = useRef<HTMLFieldSetElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  const chosen = items.filter((item) => (counts[item.id] ?? 0) > 0)
  const total = chosen.reduce((sum, item) => sum + counts[item.id], 0)

  // The thank-you note is much shorter than the form it replaces — bring it
  // into view and give it focus so nobody is left staring at empty space.
  useEffect(() => {
    if (!sent) return
    thanksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    thanksRef.current?.focus({ preventScroll: true })
  }, [sent])

  function adjust(id: string, delta: number) {
    setCounts((c) => ({ ...c, [id]: Math.min(MAX_PER_ITEM, Math.max(0, (c[id] ?? 0) + delta)) }))
    setNothingChosen(false)
    setError(null)
    setFallbackHref(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (total === 0) {
      // Flag it at the picker (top of the form), not down by the button.
      setNothingChosen(true)
      setError(null)
      setFallbackHref(null)
      pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('customer_name') ?? '').trim()
    const email = String(fd.get('customer_email') ?? '').trim()
    const phone = String(fd.get('customer_phone') ?? '').trim()
    const notes = String(fd.get('notes') ?? '').trim()
    const summary = copy.describe(counts)
    const lines = chosen.map((item) => ({ ...item, quantity: counts[item.id] }))
    const analytics = {
      kind: copy.kind,
      items: lines.map(({ id, quantity }) => ({ id, quantity })),
      total_quantity: total,
    }

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
        body: JSON.stringify({
          order: { kind: copy.kind, customer: { name, email, phone }, items: lines, notes: notes || null },
        }),
      })
      const body = (await resp.json().catch(() => ({}))) as { error?: string; ref?: string }

      if (resp.status === 400 && body.error) {
        // Something the customer can fix (e.g. a mistyped email address).
        posthog?.capture('order_failed', { ...analytics, status: 400, reason: body.error })
        setError(body.error)
        return
      }
      if (!resp.ok) throw new Error(body.error ?? `HTTP ${resp.status}`)

      posthog?.identify(email, { email, name })
      posthog?.capture('order_submitted', { ...analytics, order_ref: body.ref, has_notes: Boolean(notes) })
      setSent({ firstName: name.split(' ')[0], email, summary })
    } catch (err) {
      posthog?.captureException(err, { context: 'order', ...analytics })
      posthog?.capture('order_failed', { ...analytics, reason: err instanceof Error ? err.message : String(err) })
      setError('We couldn’t send your order just now.')
      setFallbackHref(
        orderMailto(copy.mailSubject, {
          name,
          email,
          phone,
          notes,
          lines: lines.map((l) => `${l.quantity} × ${l.title}`),
        }),
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center" role="status">
        <img src="/brand/ornament-sprig.svg" alt="" aria-hidden className="mx-auto" style={{ width: 30 }} />
        <h3
          ref={thanksRef}
          tabIndex={-1}
          className="mt-4 font-display text-[1.7rem] text-forest-800 focus:outline-none"
        >
          Thank you, {sent.firstName}.
        </h3>
        <p className="mx-auto mt-3 text-[1.0625rem] leading-[1.7] text-earth-600" style={{ maxWidth: '34rem' }}>
          Your order for <strong className="text-forest-800">{sent.summary}</strong> is in. We’ve emailed
          a confirmation to {sent.email}, and {copy.thanksTail}
        </p>
        <p className="mt-4 text-[0.9375rem] text-earth-500">
          Questions?{' '}
          <a className="font-medium text-copper-500 underline hover:text-copper-600" href={`mailto:${FARM_EMAIL}`}>
            {FARM_EMAIL}
          </a>
        </p>
      </div>
    )
  }

  const idPrefix = copy.kind
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset ref={pickerRef}>
        <legend className="font-display text-[1.3rem] text-forest-800">{copy.legend}</legend>
        <ul className="mt-4 list-none divide-y divide-linen-200 overflow-hidden rounded-md border border-linen-200 bg-linen-50 p-0">
          {items.map((item) => (
            <ItemLine
              key={item.id}
              item={item}
              count={counts[item.id] ?? 0}
              onAdjust={(delta) => adjust(item.id, delta)}
            />
          ))}
        </ul>
        <p
          className={`mt-3 text-[0.9375rem] leading-[1.6] ${nothingChosen ? 'font-semibold text-copper-600' : 'text-earth-500'}`}
          aria-live="polite"
        >
          {nothingChosen
            ? copy.emptyError
            : total > 0
              ? `${copy.describe(counts)} — ${copy.selectedHint}`
              : copy.idleHint}
        </p>
      </fieldset>

      <div>
        <h3 className="font-display text-[1.3rem] text-forest-800">Your details</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            id={`${idPrefix}-customer_name`}
            label="Full name"
            name="customer_name"
            autoComplete="name"
            maxLength={120}
            className="sm:col-span-2"
          />
          <Field
            id={`${idPrefix}-customer_email`}
            label="Email"
            name="customer_email"
            type="email"
            autoComplete="email"
            maxLength={254}
          />
          <Field
            id={`${idPrefix}-customer_phone`}
            label="Phone"
            name="customer_phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor={`${idPrefix}-notes`}>
          Notes for us (optional)
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          rows={3}
          maxLength={2000}
          className="input"
          placeholder="Anything we should know? Timing, questions…"
        />
      </div>

      <p className="text-[0.9375rem] leading-[1.7] text-earth-600">{copy.pickup}</p>

      {error && (
        <div role="alert" className="rounded-md border border-copper-500 px-4 py-3 text-[0.9375rem] leading-[1.6] text-earth-700">
          <p>{error}</p>
          {fallbackHref && (
            <p className="mt-1.5">
              <a className="font-semibold text-copper-500 underline hover:text-copper-600" href={fallbackHref}>
                Email your order to us instead
              </a>{' '}
              — we’ve filled it in for you.
            </p>
          )}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? 'Sending your order…' : copy.submit}
      </button>

      <p className="text-[0.8125rem] leading-[1.6] text-earth-500">{copy.finePrint}</p>
    </form>
  )
}

function ItemLine({ item, count, onAdjust }: { item: OrderItem; count: number; onAdjust: (delta: number) => void }) {
  const atMax = count >= MAX_PER_ITEM
  return (
    <li className="px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-[1.2rem] leading-tight text-forest-800">{item.title}</p>
          <p className="mt-0.5 text-[0.9375rem] text-earth-500">{item.detail}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2" role="group" aria-label={`${item.title} quantity`}>
          <StepButton label={`One fewer: ${item.title}`} disabled={count === 0} onClick={() => onAdjust(-1)}>
            −
          </StepButton>
          <output className="w-8 text-center font-body text-[1.35rem] font-semibold tabular-nums leading-none text-forest-800">
            {count}
          </output>
          <StepButton label={`One more: ${item.title}`} disabled={atMax} onClick={() => onAdjust(1)}>
            +
          </StepButton>
        </div>
      </div>
      {atMax && (
        <p className="mt-2 text-right text-[0.8125rem] text-earth-500">Need more? Tell us in the notes.</p>
      )}
    </li>
  )
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-400 bg-surface font-display text-[1.4rem] leading-none text-copper-500 transition hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface"
    >
      <span aria-hidden>{children}</span>
    </button>
  )
}

function Field({
  id,
  label,
  name,
  type = 'text',
  autoComplete,
  maxLength,
  className = '',
}: {
  id: string
  label: string
  name: string
  type?: string
  autoComplete?: string
  maxLength?: number
  className?: string
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        {label}
        <span className="text-copper-500"> *</span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="input"
      />
    </div>
  )
}

function orderMailto(
  subject: string,
  o: { name: string; email: string; phone: string; notes: string; lines: string[] },
): string {
  const body = [
    'Hi,',
    '',
    'I’d like to order:',
    ...o.lines.map((line) => `- ${line}`),
    '',
    `Name: ${o.name}`,
    `Email: ${o.email}`,
    `Phone: ${o.phone}`,
    ...(o.notes ? ['', `Notes: ${o.notes}`] : []),
    '',
  ].join('\n')
  return `mailto:${FARM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
