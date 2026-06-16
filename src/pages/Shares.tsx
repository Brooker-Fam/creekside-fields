import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge } from '../lib/insforge'
import type { ShareOption } from '../lib/types'
import { WhimsyDivider } from '../components/site/Whimsy'
import {
  SHARE_TIERS,
  POSSIBLE_CUTS,
  SHARE_STEPS,
  SHARE_FAQS,
  type FaqAnswer,
  type PorkShareKind,
} from '../content/sharesCopy'

type SoldOut = Record<PorkShareKind, boolean>

export default function Shares() {
  const posthog = usePostHog()
  const [soldOut, setSoldOut] = useState<SoldOut>({ whole: false, half: false, quarter: false })

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
      {/* ---------- intro ---------- */}
      <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '72px 24px 56px' }}>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="story-eyebrow">Greenwich, New York</p>
            <h1
              className="fairy-sparkle mt-4 inline-block font-display leading-[1.12] text-forest-800"
              style={{ fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
            >
              Pasture-raised pork shares
            </h1>
            <p
              className="text-earth-600"
              style={{ marginTop: 20, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
            >
              Every share comes from our Gloucestershire Old Spot pigs — a heritage breed prized for
              its exceptional flavor, beautiful marbling, and excellent foraging instincts. The
              result is pork with real depth of flavor that you simply cannot find at the grocery
              store.
            </p>
          </div>
          <figure className="plate float-slow m-0">
            <img
              className="plate-img"
              src="/farm-media/pig-grazing.jpg"
              alt="Gloucestershire Old Spot pigs foraging at pasture"
              style={{ aspectRatio: '4 / 3', borderRadius: '10px 10px 3px 3px' }}
            />
            <figcaption className="plate-cap">Heritage Old Spots, raised slowly on pasture</figcaption>
          </figure>
        </div>

        {/* nitrate note — prominent, near the top */}
        <div
          className="card"
          style={{
            background: 'var(--sage-100)',
            borderLeft: '3px solid var(--copper-500)',
            display: 'flex',
            gap: 18,
            alignItems: 'flex-start',
            maxWidth: '52rem',
            margin: '44px auto 0',
          }}
        >
          <img
            src="/brand/ornament-sprig.svg"
            alt=""
            aria-hidden
            style={{ width: 30, flexShrink: 0, marginTop: 2 }}
          />
          <p className="text-[1.0625rem] leading-[1.72] text-forest-800">
            <strong>All pork shares are processed with no added nitrates.</strong> We believe great
            pork doesn’t need unnecessary additives, so every cured and smoked product in our shares
            is prepared without added nitrates.
          </p>
        </div>
      </section>

      <WhimsyDivider />

      {/* ---------- share options ---------- */}
      <section id="share-options" style={CONTAINER}>
        <StoryHeader
          align="center"
          maxWidth="40rem"
          eyebrow="Choose your share"
          title="Three ways to bring the farm home."
          lead="Pick the share that fits your household and your freezer. Each one is a curated selection of cuts from our pasture-raised pigs."
        />

        <div className="grid gap-6 md:grid-cols-3" style={{ marginTop: 44 }}>
          {SHARE_TIERS.map((s) => {
            const out = soldOut[s.kind]
            return (
              <div
                key={s.kind}
                className="flex flex-col rounded-lg bg-surface p-7 shadow-card"
                style={{
                  border: '1px solid var(--border)',
                  ...(s.featured ? { borderColor: 'var(--sage-400)', boxShadow: 'var(--shadow-soft)' } : null),
                }}
              >
                {s.featured && (
                  <p className="story-eyebrow solo" style={{ fontSize: 'var(--text-sm)', marginBottom: 10 }}>
                    Best value
                  </p>
                )}
                <h2 className="font-display text-[1.65rem] leading-tight text-forest-800">{s.title}</h2>

                <dl
                  className="mt-5 space-y-3 border-t border-linen-200 pt-5 text-[0.9375rem]"
                  style={{ margin: '20px 0 0' }}
                >
                  <Row label="Est. take-home pork" value={s.takeHome} />
                  <div className="flex items-baseline justify-between gap-4 pt-1">
                    <dt className="text-earth-500">Est. price range</dt>
                    <dd className="font-display text-[1.2rem] text-forest-700">{s.price}</dd>
                  </div>
                </dl>

                <p className="mt-5 flex-1 text-[0.9375rem] leading-[1.7] text-earth-600">{s.bestFor}</p>

                {out ? (
                  <span
                    className="btn-secondary mt-6 cursor-not-allowed opacity-60"
                    aria-disabled="true"
                  >
                    Reserved for the season
                  </span>
                ) : (
                  <Link
                    to={`/reserve/${s.kind}`}
                    className="btn-primary mt-6"
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
            )
          })}
        </div>

        <p
          className="text-center font-accent text-[1.0625rem] italic leading-[1.7] text-earth-600"
          style={{ marginTop: 32, maxWidth: '48rem', marginInline: 'auto' }}
        >
          Because our pigs are still growing, all weights and prices are estimates. Final pricing
          will be announced once processing weights are confirmed.
        </p>
      </section>

      {/* ---------- what's included ---------- */}
      <section id="included" style={tint('--sage-100', 60)}>
        <div style={CONTAINER}>
          <StoryHeader
            align="center"
            maxWidth="40rem"
            eyebrow="What’s included"
            title="A thoughtfully curated assortment."
            lead="Every share is a balanced selection of cuts chosen by Creekside Fields — no decisions to make on your end. We take care of all of it, so you can simply enjoy the pork."
          />

          <p
            className="text-center text-[0.9375rem] uppercase tracking-[0.16em] text-earth-500"
            style={{ marginTop: 48 }}
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
            className="mx-auto text-center text-[1.0625rem] leading-[1.72] text-earth-600"
            style={{ marginTop: 36, maxWidth: '46rem' }}
          >
            Quarter shares receive a proportional assortment of these cuts, half shares receive a
            larger assortment, and whole shares receive the fullest selection available from the
            animal.
          </p>

          <div
            className="card"
            style={{
              background: 'var(--white)',
              maxWidth: '48rem',
              margin: '36px auto 0',
              display: 'flex',
              gap: 18,
              alignItems: 'flex-start',
            }}
          >
            <img
              src="/brand/ornament-sprig.svg"
              alt=""
              aria-hidden
              style={{ width: 28, flexShrink: 0, marginTop: 2 }}
            />
            <p className="text-[0.9375rem] leading-[1.72] text-earth-600">
              <strong className="text-forest-800">
                Because these are real animals, not pre-packaged grocery boxes,
              </strong>{' '}
              exact weights, package counts, and cut quantities will vary slightly from share to
              share. We do our best to divide shares fairly and thoughtfully.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section id="how" style={CONTAINER}>
        <StoryHeader
          align="center"
          maxWidth="36rem"
          eyebrow="How it works"
          title="From our pasture to your freezer."
          lead="Reserving a share is simpler than you might think. Here is the whole path, step by step."
        />
        <ol
          className="grid list-none grid-cols-1 gap-7 p-0 sm:grid-cols-3 lg:grid-cols-5"
          style={{ marginTop: 52 }}
        >
          {SHARE_STEPS.map(([n, title, body]) => (
            <li key={n} className="flex flex-col items-center text-center">
              <div className="numeral">{n}</div>
              <h3 className="mt-4 font-display text-[1.2rem] leading-snug text-forest-800">{title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-earth-600">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- faq ---------- */}
      <section id="faq" style={{ ...tint('--linen-100', 70) }}>
        <div style={{ ...CONTAINER, maxWidth: '46rem' }}>
          <StoryHeader
            align="center"
            maxWidth="34rem"
            eyebrow="Questions"
            title="Questions we hear often."
            lead="Straight, friendly answers for anyone buying a pork share for the first time."
          />
          <div style={{ marginTop: 44, borderTop: '1px solid var(--border)' }}>
            {SHARE_FAQS.map(([q, a]) => (
              <Faq key={q} q={q} a={a} />
            ))}
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
            Ready to fill your freezer with pork raised right?
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

/* ---------- layout helpers (match the design-system kit metrics) ---------- */

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-earth-500">{label}</dt>
      <dd className="text-forest-800">{value}</dd>
    </div>
  )
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
    <header
      style={{
        maxWidth,
        ...(align === 'center' ? { marginInline: 'auto', textAlign: 'center' } : null),
      }}
    >
      <p className={`story-eyebrow${align === 'center' ? '' : ' solo'}`}>{eyebrow}</p>
      <h2
        className="fairy-sparkle mt-4 inline-block font-display leading-[1.14] text-forest-800"
        style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.5rem)' }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className="text-earth-600"
          style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
        >
          {lead}
        </p>
      )}
    </header>
  )
}

/* Small farm-inspired leaf marker used as a list bullet. */
function LeafMark() {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 26 22"
      fill="none"
      aria-hidden
      className="flex-shrink-0"
    >
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

/* ---------- faq accordion ---------- */

function Faq({ q, a }: { q: string; a: FaqAnswer }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 border-0 bg-transparent text-left"
        style={{ padding: '20px 0' }}
      >
        <span className="font-display text-[1.3rem] text-forest-800">{q}</span>
        <span
          className="font-display text-2xl text-copper-500"
          style={{ transition: 'transform 200ms', transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      {open &&
        (typeof a === 'string' ? (
          <p className="text-[1.0625rem] leading-[1.7] text-earth-600" style={{ margin: '0 0 22px' }}>
            {a}
          </p>
        ) : (
          <div style={{ margin: '0 0 22px' }}>
            {a.intro && (
              <p className="text-[1.0625rem] leading-[1.7] text-earth-600">{a.intro}</p>
            )}
            <ul className="mt-3 list-none space-y-3 p-0">
              {a.items.map((it) => (
                <li key={it.label} className="text-[1.0625rem] leading-[1.7] text-earth-600">
                  <strong className="text-forest-800">{it.label}:</strong> {it.body}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  )
}
