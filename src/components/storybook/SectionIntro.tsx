type Props = {
  kicker: string
  title: string
  body: string
  className?: string
}

export default function SectionIntro({ kicker, title, body, className = '' }: Props) {
  return (
    <div className={className}>
      <p className="field-tag text-blush-500">{kicker}</p>
      <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-sage-700 sm:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-mud-600">{body}</p>
    </div>
  )
}
