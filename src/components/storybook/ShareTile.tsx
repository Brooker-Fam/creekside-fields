import { Link } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { SHARE_COPY, type PigShareKind } from '../../content/homeCopy'

type Props = {
  kind: PigShareKind
  count: number
  rate: string
  price: string
}

export default function ShareTile({ kind, count, rate, price }: Props) {
  const posthog = usePostHog()
  const soldOut = count === 0
  const copy = SHARE_COPY[kind]

  return (
    <Link
      to={soldOut ? '#pig-shares' : `/reserve/${kind}`}
      onClick={() =>
        posthog?.capture('share_size_selected', {
          share_kind: kind,
          available_count: count,
          source: 'home_storybook',
        })
      }
      className={`group relative min-h-[17rem] rounded-[1.5rem] border-2 p-5 shadow-soft transition ${
        soldOut
          ? 'cursor-not-allowed border-mud-800/10 bg-cream-200/60 opacity-70'
          : 'border-sage-300/45 bg-cream-50/90 hover:-translate-y-1 hover:border-marigold-300/70'
      }`}
    >
      <span className="absolute right-5 top-5 font-hand text-3xl text-marigold-500/70" aria-hidden>
        {kind === 'whole' ? '✦' : kind === 'half' ? '✧' : '•'}
      </span>
      <p className="font-hand text-2xl italic text-blush-500">{copy.title}</p>
      <p className="mt-3 font-display text-3xl text-sage-700">{soldOut ? 'Sold out' : `${count} available`}</p>
      <p className="mt-3 text-sm font-semibold text-indigo-700">{rate}</p>
      <p className="mt-1 text-sm text-mud-600">Est. {price || 'final total TBD'}</p>
      <p className="mt-4 text-sm leading-6 text-mud-600">
        {copy.meat}. {copy.freezer}.
      </p>
      <p className="mt-3 text-sm leading-6 text-mud-600">{copy.note}</p>
      {!soldOut && (
        <p className="mt-5 text-sm font-bold text-clay-500 group-hover:text-marigold-500">
          Reserve this share →
        </p>
      )}
    </Link>
  )
}
