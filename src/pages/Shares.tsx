import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge } from '../lib/insforge'
import type { ShareOption } from '../lib/types'
import { WhimsyDivider } from '../components/site/Whimsy'
import { SHARE_TIERS, POSSIBLE_CUTS, type PorkShareKind } from '../content/sharesCopy'

type SoldOut = Record<PorkShareKind, boolean>

export default function Shares() {
  const posthog = usePostHog()
  const [soldOut, setSoldOut] = useState<SoldOut>({ whole: false, half: false, quarter: false })
  const [openKinds, setOpenKinds] = useState<Set<PorkShareKind>>(() => new Set())

  function toggle(kind: PorkShareKind) {
    setOpenKinds((prev) => {
      const next = new Set(prev)
      if (next.has(kind)) next.delete(kind)
      else next.add(kind)
      return next
    })
  }

  useEffect(() => {
    document.title = 'Pasture-raised pork shares · Creekside Fields'
    insforge.database
      .from('share_options')
      .select('*')
      .then(({ data }) => {
        const rows = (data ?? []) as ShareOption[]
        if (!rows.length) return
        const next: SoldOut = { whole: false, half: false, quarter: false }
        ;(['whole', 'half', 'quarter'] as PorkShareKind[]).forEach((kind) => {
          const forKind = rows.filter((s) => s.kind === kind)
          if (forKind.length) next[kind] = !forKind.some((s) => s.status === 'available')
        })
        setSoldOut(next)
      })
  }, [])

  return (
    <div>
      {/* ---------- header ---------- */}
      <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '76px 24px 0', textAlign: 'center' }}>
        <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
          Pork shares
        </p>
        <h1
          className="fairy-sparkle mt-4 inline-block font-display leading-[1.12] text-forest-800"
          style={{ fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
        >
          Choose your share.
        </h1>
        <p
          className="mx-auto text-earth-600"
          style={{ marginTop: 18, maxWidth: '40rem', fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
        >
          Quarter, half, or whole — each a curated assortment of cuts from our pasture-raised
          Gloucestershire Old Spot pigs, at one flat price.
        </p>
      </section>

      <div style={{ marginTop: 40 }}>
        <WhimsyDivider />
      </div>

      {/* ---------- the three options ---------- */}
      <section id="share-options" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '48px 24px 88px' }}>
        <div className="mx-auto grid gap-4" style={{ maxWidth: '46rem' }}>
          {SHARE_TIERS.map((s) => {
            const out = soldOut[s.kind]
            const open = openKinds.has(s.kind)
            return (
              <div
                key={s.kind}
                className="overflow-hidden rounded-lg bg-surface shadow-card"
                style={{
                  border: '1px solid var(--border)',
                  ...(s.featured ? { borderColor: 'var(--sage-400)' } : null),
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(s.kind)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-sage-100"
                >
                  <div>
                    <p className="eyebrow">{s.title}</p>
                    <p className="mt-2 font-display text-[1.7rem] leading-none text-forest-800">
                      {out ? 'Reserved for the season' : s.takeHome}
                    </p>
                    {!out && (
                      <p className="mt-1 text-[0.9375rem] text-earth-500">
                        estimated take-home pork · est. {s.price}
                      </p>
                    )}
                  </div>
                  <span
                    className="shrink-0 font-display text-3xl text-copper-500"
                    style={{ transition: 'transform 200ms', transform: open ? 'rotate(45deg)' : 'none' }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                {open && (
                  <div className="border-t border-linen-200 px-6 pb-6 pt-5">
                    <p className="text-[0.9375rem] leading-[1.72] text-earth-600">
                      A flat price of <strong className="text-forest-800">{s.price}</strong>.{' '}
                      {s.freezer} Every share is a curated assortment of cuts (see the full list
                      below).
                    </p>
                    {out ? (
                      <span
                        className="btn-secondary mt-5 inline-flex cursor-not-allowed opacity-60"
                        aria-disabled="true"
                      >
                        Reserved for the season
                      </span>
                    ) : (
                      <Link
                        to={`/reserve/${s.kind}`}
                        className="btn-primary mt-5 inline-flex"
                        onClick={() =>
                          posthog?.capture('share_size_selected', {
                            share_kind: s.kind,
                            sold_out: false,
                            source: 'shares',
                          })
                        }
                      >
                        {s.cta}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p
          className="mx-auto text-center font-accent text-[1.0625rem] italic leading-[1.7] text-earth-600"
          style={{ marginTop: 32, maxWidth: '46rem' }}
        >
          Our pigs are still growing, so weights and prices are estimates. We confirm your final
          price once processing weights are in — then you pick up from us at the farm when it’s ready.
        </p>
      </section>

      {/* ---------- what's included ---------- */}
      <section style={tint('--sage-100', 60)}>
        <div style={CONTAINER}>
          <StoryHeader
            align="center"
            maxWidth="40rem"
            eyebrow="What’s included"
            title="Cuts we curate for you."
            lead="Every share is a balanced selection of cuts chosen by us — no decisions to make on your end."
          />

          <p
            className="text-center text-[0.9375rem] uppercase tracking-[0.16em] text-earth-500"
            style={{ marginTop: 44 }}
          >
            Possible cuts include
          </p>
          <ul
            className="mx-auto grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3"
            style={{ marginTop: 18, maxWidth: '46rem' }}
          >
            {POSSIBLE_CUTS.map((cut) => (
              <li
                key={cut}
                className="flex items-center gap-2.5 rounded-md border border-linen-200 bg-surface px-4 py-3 text-[0.9375rem] text-earth-700"
              >
                <LeafMark />
                {cut}
              </li>
            ))}
          </ul>

          <p
            className="text-center text-[0.9375rem] uppercase tracking-[0.16em] text-earth-500"
            style={{ marginTop: 48 }}
          >
            Freezer space
          </p>
          <ul
            className="mx-auto grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3"
            style={{ marginTop: 18, maxWidth: '46rem' }}
          >
            {SHARE_TIERS.map((s) => (
              <li
                key={s.kind}
                className="rounded-md border border-linen-200 bg-surface px-4 py-4 text-center"
              >
                <p className="eyebrow">{s.title.replace(' pork share', '')}</p>
                <p className="mt-2 text-[0.9375rem] leading-[1.6] text-earth-600">{s.freezer}</p>
              </li>
            ))}
          </ul>
          <p
            className="mx-auto text-center text-[0.9375rem] text-earth-500"
            style={{ marginTop: 16, maxWidth: '46rem' }}
          >
            We’re happy to help you plan the right freezer space before you reserve.
          </p>

          <div
            className="card"
            style={{
              background: 'var(--surface)',
              borderLeft: '3px solid var(--copper-500)',
              maxWidth: '46rem',
              margin: '32px auto 0',
              display: 'flex',
              gap: 18,
              alignItems: 'flex-start',
            }}
          >
            <img src="/brand/ornament-sprig.svg" alt="" aria-hidden style={{ width: 28, flexShrink: 0, marginTop: 2 }} />
            <p className="text-[0.9375rem] leading-[1.72] text-earth-600">
              <strong className="text-forest-800">All pork shares are processed with no added nitrates.</strong>{' '}
              Because these are real animals, exact weights and cut quantities vary slightly from
              share to share — we divide every share fairly and thoughtfully.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- closing cta ---------- */}
      <section style={{ ...CONTAINER, paddingTop: 72, paddingBottom: 96 }}>
        <div className="text-center">
          <p className="story-eyebrow justify-center">Reserve your share</p>
          <h2
            className="mt-4 font-display leading-[1.16] text-forest-800"
            style={{ fontSize: 'clamp(1.8rem, 1.3rem + 2vw, 2.4rem)' }}
          >
            Ready to fill your freezer?
          </h2>
          <p
            className="mx-auto text-earth-600"
            style={{ marginTop: 16, maxWidth: '38rem', fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
          >
            Choose the share that fits your family — a deposit holds it for the season.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SHARE_TIERS.map((s) =>
              soldOut[s.kind] ? null : (
                <Link key={s.kind} to={`/reserve/${s.kind}`} className="btn-secondary">
                  {s.cta}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- layout helpers (design-system kit metrics) ---------- */

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container)',
  margin: '0 auto',
  padding: '88px 24px',
}

function tint(token: string, pct: number): CSSProperties {
  return {
    background: `color-mix(in srgb, var(${token}) ${pct}%, transparent)`,
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  }
}

function StoryHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
  maxWidth = '42rem',
}: {
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  maxWidth?: string
}) {
  return (
    <header style={{ maxWidth, ...(align === 'center' ? { marginInline: 'auto', textAlign: 'center' } : null) }}>
      <p
        className={`story-eyebrow${align === 'center' ? '' : ' solo'}`}
        style={align === 'center' ? { display: 'flex', justifyContent: 'center' } : undefined}
      >
        {eyebrow}
      </p>
      <h2
        className="fairy-sparkle mt-4 inline-block font-display leading-[1.14] text-forest-800"
        style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.5rem)' }}
      >
        {title}
      </h2>
      {lead && (
        <p className="text-earth-600" style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}>
          {lead}
        </p>
      )}
    </header>
  )
}

/* Small farm-inspired leaf marker used as a list bullet. */
function LeafMark() {
  return (
    <svg width="16" height="15" viewBox="0 0 26 22" fill="none" aria-hidden className="flex-shrink-0">
      <path d="M2 20 C 2 9 11 2 24 2 C 24 13 15 20 2 20 Z" fill="#8fa07a" opacity="0.55" />
      <path
        d="M2 20 C 9 13 16 7 24 2"
        stroke="#6b8058"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
        fill="none"
      />
    </svg>
  )
}
