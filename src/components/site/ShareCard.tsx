import { Link } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { SHARE_COPY, RATE, type PigShareKind } from '../../content/homeCopy'

type Props = {
  kind: PigShareKind
  soldOut?: boolean
}

export default function ShareCard({ kind, soldOut = false }: Props) {
  const posthog = usePostHog()
  const c = SHARE_COPY[kind]

  return (
    <Link
      to={soldOut ? '#shares' : `/reserve/${kind}`}
      onClick={() =>
        posthog?.capture('share_size_selected', {
          share_kind: kind,
          sold_out: soldOut,
          source: 'home',
        })
      }
      className={`group flex flex-col rounded-lg border border-linen-200 bg-white p-6 transition ${
        soldOut
          ? 'cursor-not-allowed opacity-60'
          : 'shadow-card hover:border-sage-400 hover:shadow-soft'
      }`}
    >
      <p className="eyebrow">{c.title}</p>

      <p className="mt-4 font-display text-4xl leading-none text-forest-800">
        {soldOut ? 'Sold out' : c.weight}
      </p>
      <p className="mt-1 text-[0.9375rem] text-earth-500">hanging weight</p>

      <div className="mt-4 border-t border-linen-200 pt-4">
        <p className="font-display text-[1.3rem] text-forest-700">
          Est. {c.price}
          <span className="text-[0.9375rem] text-earth-500"> + processing</span>
        </p>
        <p className="mt-1 text-[0.9375rem] text-copper-600">{RATE}</p>
      </div>

      <p className="mt-4 flex-1 text-[0.9375rem] leading-[1.7] text-earth-600">
        {c.meat}. {c.freezer}. {c.note}
      </p>

      {!soldOut && (
        <p className="mt-5 text-[0.9375rem] font-semibold text-copper-500 group-hover:text-copper-600">
          Reserve →
        </p>
      )}
    </Link>
  )
}
