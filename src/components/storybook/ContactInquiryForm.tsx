import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SHARE_OPTIONS = [
  { value: '', label: 'Not sure yet' },
  { value: 'quarter', label: 'Quarter pig' },
  { value: 'half', label: 'Half pig' },
  { value: 'whole', label: 'Whole pig' },
] as const

export const INQUIRY_PREFILL_KEY = 'creekside_inquiry_prefill'

export type InquiryPrefill = {
  customer_name: string
  customer_email: string
  customer_phone: string
  notes: string
}

export default function ContactInquiryForm() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [shareSize, setShareSize] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const phone = String(fd.get('phone') ?? '').trim()
    const size = String(fd.get('share_size') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()

    const prefill: InquiryPrefill = {
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      notes: message,
    }

    if (size && size !== '') {
      sessionStorage.setItem(INQUIRY_PREFILL_KEY, JSON.stringify(prefill))
      navigate(`/reserve/${size}`)
      return
    }

    const subject = encodeURIComponent('Creekside Fields pig share question')
    const body = encodeURIComponent(
      `Hi Creekside Fields,\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '(not provided)'}\n\n${message || '(No message)'}\n`,
    )
    window.location.href = `mailto:brookerhousehold@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border-2 border-sage-300/40 bg-cream-50/90 p-6 text-center">
        <p className="text-3xl" aria-hidden>✨</p>
        <h3 className="mt-3 font-display text-2xl text-sage-700">Thank you, neighbor.</h3>
        <p className="mt-3 text-sm leading-6 text-mud-600">
          Your email app should have opened with your message ready to send. We will get back to you
          soon — usually within a day.
        </p>
        <Link to="/" className="btn-secondary mt-5 inline-flex justify-center">
          Back to the farm
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] border-2 border-sage-300/40 bg-cream-50/90 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <div>
          <label className="label" htmlFor="share_size">Preferred share size</label>
          <select
            id="share_size"
            name="share_size"
            className="input"
            value={shareSize}
            onChange={(e) => setShareSize(e.target.value)}
          >
            {SHARE_OPTIONS.map((opt) => (
              <option key={opt.value || 'unsure'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="label" htmlFor="message">Questions or comments</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="input"
          placeholder="First time buying a share? Wondering about freezer space? Ask us anything."
        />
      </div>
      <button type="submit" className="btn-primary mt-5 w-full justify-center sm:w-auto">
        {shareSize ? 'Continue to reservation →' : 'Send us a note →'}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-mud-600 sm:text-left">
        Pick a share size and we will carry your info into the full reservation form. Otherwise we
        will open your email with everything filled in.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-blush-500"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} className="input" />
    </div>
  )
}
