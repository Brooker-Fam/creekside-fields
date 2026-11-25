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
