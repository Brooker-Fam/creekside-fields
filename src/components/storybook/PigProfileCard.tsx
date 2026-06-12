type Props = {
  name: string
  trait: string
  blurb: string
  emoji: string
}

export default function PigProfileCard({ name, trait, blurb, emoji }: Props) {
  return (
    <article className="card group relative overflow-hidden transition-transform hover:-translate-y-1">
      <span className="absolute -right-2 -top-2 text-4xl opacity-20 transition-opacity group-hover:opacity-40" aria-hidden>
        {emoji}
      </span>
      <p className="font-hand text-2xl italic text-blush-500">{name}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-sage-500">{trait}</p>
      <p className="mt-3 text-sm leading-6 text-mud-600">{blurb}</p>
      <div className="mt-4 flex h-24 items-center justify-center rounded-[1rem] border border-dashed border-sage-300/50 bg-cream-100/60 text-xs font-semibold text-mud-400">
        Photo coming soon
      </div>
    </article>
  )
}
