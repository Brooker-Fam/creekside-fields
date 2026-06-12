type Props = {
  eyebrow: string
  title: string
  lead?: string
  className?: string
}

export default function SectionHeader({ eyebrow, title, lead, className = '' }: Props) {
  return (
    <header className={`max-w-prose ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight text-forest-800 sm:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-earth-600">{lead}</p>}
    </header>
  )
}
