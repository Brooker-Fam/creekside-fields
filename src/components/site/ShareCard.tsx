import { Link } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { SHARE_COPY, type PigShareKind } from '../../content/homeCopy'

type Props = {
  kind: PigShareKind
  count: number
  rate: string
  price: string
}

export default function ShareCard({ kind, count, rate, price }: Props) {
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
          source: 'home',
        })
      }
      className={`group flex flex-col rounded-lg border bg-white p-6 transition ${
        soldOut
          ? 'cursor-not-allowed border-linen-200 opacity-60'
          : 'border-linen-200 shadow-card hover:border-sage-400 hover:shadow-soft'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-copper-500">{copy.title}</p>
      <p className="mt-3 font-display text-2xl text-forest-800">
        {soldOut ? 'Sold out' : `${count} available`}
      </p>
      <p className="mt-2 text-sm font-medium text-forest-600">{rate}</p>
      <p className="text-sm text-earth-500">Est. {price || 'TBD'}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-earth-600">
        {copy.meat}. {copy.freezer}.
      </p>
      <p className="mt-2 text-sm text-earth-500">{copy.note}</p>
      {!soldOut && (
        <p className="mt-5 text-sm font-semibold text-copper-500 group-hover:text-copper-600">
          Reserve →
        </p>
      )}
    </Link>
  )
}
