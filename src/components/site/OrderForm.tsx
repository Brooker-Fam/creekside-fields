import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { usePostHog } from '@posthog/react'
import {
  MAX_PER_ITEM,
  ORDER_WORDING,
  formatEstimate,
  itemDetail,
  type OrderCounts,
  type OrderFormCopy,
  type OrderGroup,
  type OrderItem,
} from '../../content/orders'
import Field, { EmailField } from './Field'
import { Sprig } from './Whimsy'

const FARM_EMAIL = 'brookerhousehold@gmail.com'

const SELECTED_ROW: CSSProperties = {
  background: 'color-mix(in srgb, var(--sage-200) 50%, transparent)',
}

interface SentOrder {
  firstName: string
  email: string
  summary: string
  /** Whether the customer's confirmation email went out. */
  emailed: boolean
}

/**
 * The order form: every group of items (e.g. pig shares and individual cuts)
 * in one form with one set of details, so nothing picked gets left behind.
 * Sends to /api/send-order, which emails the farm (a reply goes straight to
 * the customer) and sends the customer a copy. If that fails, the form offers
 * a pre-filled email to the farm so the order isn't lost.
 */
export default function OrderForm({ groups, copy }: { groups: OrderGroup[]; copy: OrderFormCopy }) {
  const posthog = usePostHog()
  const [counts, setCounts] = useState<OrderCounts>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackHref, setFallbackHref] = useState<string | null>(null)
  const [sent, setSent] = useState<SentOrder | null>(null)
  const [nothingChosen, setNothingChosen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  const allItems = groups.flatMap((g) => g.items)
  const chosen = allItems.filter((item) => !item.soldOut && (counts[item.id] ?? 0) > 0)
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

  function summaryLine(): string {
    const priced = chosen.filter((item) => item.estimate)
    const [low, high] = priced.reduce(
      ([lo, hi], item) => [lo + item.estimate![0] * counts[item.id], hi + item.estimate![1] * counts[item.id]],
      [0, 0],
    )
    const unpriced = chosen.length > priced.length
    const estimate = priced.length
      ? `, ${formatEstimate([low, high])}${unpriced ? ' plus the rest by weight' : ''}`
      : ''
    return `${copy.describe(counts)}${estimate}. ${ORDER_WORDING.selectedHint}`
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (total === 0) {
      // Flag it at the picker (top of the form), not down by the button.
      setNothingChosen(true)
      setError(null)
      setFallbackHref(null)
      pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('customer_name') ?? '').trim()
    const email = String(fd.get('customer_email') ?? '').trim()
    const phone = String(fd.get('customer_phone') ?? '').trim()
    const notes = String(fd.get('notes') ?? '').trim()
    const summary = copy.describe(counts)
    const lines = chosen.map((item) => ({
      id: item.id,
      title: item.title,
      detail: itemDetail(item),
      quantity: counts[item.id],
    }))
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
      const body = (await resp.json().catch(() => ({}))) as {
        error?: string
        ref?: string
        customerEmailed?: boolean
      }

      if (resp.status === 400 && body.error) {
        // Something the customer can fix (e.g. a mistyped email address).
        posthog?.capture('order_failed', { ...analytics, status: 400, reason: body.error })
        setError(body.error)
        return
      }
      if (!resp.ok) throw new Error(body.error ?? `HTTP ${resp.status}`)

      posthog?.identify(email, { email, name })
      posthog?.capture('order_submitted', { ...analytics, order_ref: body.ref, has_notes: Boolean(notes) })
      setSent({ firstName: name.split(' ')[0], email, summary, emailed: body.customerEmailed !== false })
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
        <Sprig className="mx-auto" />
        <h3
          ref={thanksRef}
          tabIndex={-1}
          className="mt-4 font-display text-[1.8rem] text-forest-800 focus:outline-none"
        >
          Thanks, {sent.firstName}!
        </h3>
        <p className="mx-auto mt-3 text-[1.0625rem] leading-[1.7] text-earth-600" style={{ maxWidth: '34rem' }}>
          Your order for <strong className="text-forest-800">{sent.summary}</strong> is in
          {sent.emailed ? `. We’ve emailed a copy to ${sent.email}, and ` : ', and '}
          {ORDER_WORDING.thanksTail}
        </p>
        <p className="mx-auto mt-4 text-[0.95rem] leading-[1.6] text-earth-500" style={{ maxWidth: '30rem' }}>
          Wrong email, or need to change something? Write to{' '}
          <a className="font-medium text-copper-500 underline hover:text-copper-600" href={`mailto:${FARM_EMAIL}`}>
            {FARM_EMAIL}
          </a>
          .
        </p>
      </div>
    )
  }

  const idPrefix = copy.kind
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div ref={pickerRef} className="space-y-9" style={{ scrollMarginTop: '5.5rem' }}>
        {groups.map((group) => {
          const forSale = group.items.filter((item) => !item.soldOut)
          const soldOut = group.items.filter((item) => item.soldOut)
          return (
            <fieldset key={group.id} id={group.id} style={{ scrollMarginTop: '5.5rem' }}>
              <legend className={group.title ? 'font-display text-[1.5rem] leading-tight text-forest-800' : 'sr-only'}>
                {group.title ?? 'What you’d like'}
              </legend>
              {group.note && (
                <p className="mt-2 text-[1rem] leading-[1.65] text-earth-600">{group.note}</p>
              )}
              <ul className="mt-3 list-none p-0">
                {forSale.map((item, i) => (
                  <ItemLine
                    key={item.id}
                    item={item}
                    first={i === 0}
                    count={counts[item.id] ?? 0}
                    onAdjust={(delta) => adjust(item.id, delta)}
                  />
                ))}
              </ul>
              {soldOut.length > 0 && (
                <p className="mt-2 px-3 font-accent text-[0.95rem] italic text-earth-500">
                  Sold out for now: {soldOut.map((item) => item.title).join(', ')}.
                </p>
              )}
            </fieldset>
          )
        })}
      </div>

      <p
        className={`rounded-md px-3 py-2.5 text-[1rem] leading-[1.6] ${nothingChosen ? 'font-semibold text-copper-600' : 'text-earth-600'}`}
        style={{ background: 'color-mix(in srgb, var(--linen-100) 70%, transparent)' }}
        aria-live="polite"
      >
        {nothingChosen ? copy.emptyError : total > 0 ? summaryLine() : copy.idleHint}
      </p>

      <div>
        <h3 className="font-display text-[1.5rem] text-forest-800">Your details</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            id={`${idPrefix}-customer_name`}
            label="Name"
            name="customer_name"
            autoComplete="name"
            maxLength={120}
            className="sm:col-span-2"
          />
          <EmailField id={`${idPrefix}-customer_email`} name="customer_email" />
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
          placeholder="A pickup day that works, a question, anything else…"
        />
      </div>

      <p className="text-[1rem] leading-[1.7] text-earth-600">{ORDER_WORDING.pickup}</p>

      {error && (
        <div role="alert" className="rounded-md border border-copper-500 px-4 py-3 text-[1rem] leading-[1.6] text-earth-700">
          <p>{error}</p>
          {fallbackHref && (
            <p className="mt-1.5">
              <a className="font-semibold text-copper-500 underline hover:text-copper-600" href={fallbackHref}>
                Email your order instead
              </a>{' '}
              (it’s filled in for you), or write to {FARM_EMAIL}.
            </p>
          )}
        </div>
      )}

      <div>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Sending your order…' : ORDER_WORDING.submit}
        </button>
        <p className="mt-3 text-[0.95rem] leading-[1.6] text-earth-500">{ORDER_WORDING.finePrint}</p>
      </div>
    </form>
  )
}

function ItemLine({
  item,
  first,
  count,
  onAdjust,
}: {
  item: OrderItem
  first: boolean
  count: number
  onAdjust: (delta: number) => void
}) {
  const atMax = count >= MAX_PER_ITEM
  return (
    <li
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md px-3 py-3 transition-colors ${first ? '' : 'border-t border-linen-200'}`}
      style={count > 0 ? SELECTED_ROW : undefined}
    >
      <div className="min-w-0 flex-1 basis-[9rem]">
        <p className="font-display text-[1.2rem] leading-tight text-forest-800">{item.title}</p>
        <p className="mt-0.5 text-[0.95rem] leading-snug text-earth-600">{itemDetail(item)}</p>
        {item.note && <p className="mt-0.5 font-accent text-[0.95rem] italic text-earth-500">{item.note}</p>}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5" role="group" aria-label={`${item.title} quantity`}>
        <StepButton label={`One fewer: ${item.title}`} disabled={count === 0} onClick={() => onAdjust(-1)}>
          −
        </StepButton>
        <output className="w-8 text-center font-body text-[1.3rem] font-semibold tabular-nums leading-none text-forest-800">
          {count}
        </output>
        <StepButton label={`One more: ${item.title}`} disabled={atMax} onClick={() => onAdjust(1)}>
          +
        </StepButton>
      </div>
      {atMax && <p className="w-full text-right text-[0.9rem] text-earth-500">Need more? Tell us in the notes.</p>}
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-500 bg-surface font-display text-[1.35rem] leading-none text-copper-500 transition hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-surface"
    >
      <span aria-hidden>{children}</span>
    </button>
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
