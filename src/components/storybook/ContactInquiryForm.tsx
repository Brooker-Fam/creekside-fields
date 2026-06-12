import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SHARE_OPTIONS = [
  { value: '', label: 'Not sure yet' },
  { value: 'quarter', label: 'Quarter share' },
  { value: 'half', label: 'Half share' },
  { value: 'whole', label: 'Whole share' },
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

    if (size) {
      sessionStorage.setItem(INQUIRY_PREFILL_KEY, JSON.stringify(prefill))
      navigate(`/reserve/${size}`)
      return
    }

    const subject = encodeURIComponent('Creekside Fields — pig share inquiry')
    const body = encodeURIComponent(
      `Hi,\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '(not provided)'}\n\n${message || ''}\n`,
    )
    window.location.href = `mailto:brookerhousehold@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="card text-center">
        <h3 className="font-display text-2xl text-forest-800">Thank you.</h3>
        <p className="mt-3 text-sm leading-relaxed text-earth-600">
          Your email app should have opened with your message. We will get back to you soon.
        </p>
        <Link to="/" className="btn-secondary mt-6 inline-flex">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="font-display text-xl text-forest-800">Get in touch</h3>
      <p className="mt-1 text-sm text-earth-500">We read every message ourselves.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <div>
          <label className="label" htmlFor="share_size">
            Share size
          </label>
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
        <label className="label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="input"
          placeholder="Questions about freezer space, cuts, timing — ask us anything."
        />
      </div>
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
        {shareSize ? 'Continue to reservation' : 'Send message'}
      </button>
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
        {required && <span className="text-copper-500"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} className="input" />
    </div>
  )
}
