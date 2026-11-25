import { useRef, useState } from 'react'

/** A labelled text input in the site's form style. */
export default function Field({
  id,
  label,
  name,
  type = 'text',
  required = true,
  autoComplete,
  maxLength,
  className = '',
}: {
  id: string
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  maxLength?: number
  className?: string
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        {label}
        {required ? <span className="text-copper-500"> *</span> : <span> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="input"
      />
    </div>
  )
}

// Common slips in the part after the @.
const DOMAIN_FIXES: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'icloud.con': 'icloud.com',
  'aol.con': 'aol.com',
}

/** Email input that asks the browser to check the address and offers a fix for common typos. */
export function EmailField({ id, name, className = '' }: { id: string; name: string; className?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [suggestion, setSuggestion] = useState<string | null>(null)

  function check() {
    const value = input.current?.value.trim() ?? ''
    const at = value.lastIndexOf('@')
    const fix = at > 0 ? DOMAIN_FIXES[value.slice(at + 1).toLowerCase()] : undefined
    setSuggestion(fix ? `${value.slice(0, at + 1)}${fix}` : null)
  }

  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        Email<span className="text-copper-500"> *</span>
      </label>
      <input
        ref={input}
        id={id}
        name={name}
        type="email"
        required
        autoComplete="email"
        maxLength={254}
        pattern={String.raw`[^@\s]+@[^@\s]+\.[^@\s]+`}
        title="An email like name@example.com"
        onBlur={check}
        className="input"
      />
      {suggestion && (
        <p className="mt-1.5 text-[0.95rem] text-earth-600">
          Did you mean{' '}
          <button
            type="button"
            className="font-semibold text-copper-500 underline underline-offset-2 hover:text-copper-600"
            onClick={() => {
              if (input.current) input.current.value = suggestion
              setSuggestion(null)
            }}
          >
            {suggestion}
          </button>
          ?
        </p>
      )}
    </div>
  )
}
