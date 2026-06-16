import { useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { WhimsyDivider } from '../components/site/Whimsy'
import { WORK_STEPS, VALUES, FAQS } from '../content/homeCopy'
import { SHARE_TIERS } from '../content/sharesCopy'

export default function Home() {
  return (
    <div>
      <Hero />
      <WhimsyDivider />

      {/* Shares teaser */}
      <section id="shares" style={CONTAINER}>
        <StoryHeader
          align="center"
          eyebrow="Pig shares & pricing"
          title="Stock your freezer with heritage pork."
          lead="Quarter, half, and whole pig shares of our pasture-raised Gloucestershire Old Spot pigs — a thoughtfully curated assortment of cuts, processed with no added nitrates, on our small family farm in Washington County."
        />

        <div className="grid gap-6 md:grid-cols-3" style={{ marginTop: 40 }}>
          {SHARE_TIERS.map((s) => (
            <Link
              key={s.kind}
              to="/shares"
              className="group flex flex-col rounded-lg border border-linen-200 bg-surface p-6 shadow-card transition hover:border-sage-400 hover:shadow-soft"
            >
              <p className="eyebrow">{s.title}</p>
              <p className="mt-4 font-display text-[1.9rem] leading-none text-forest-800">
                {s.takeHome}
              </p>
              <p className="mt-1 text-[0.9375rem] text-earth-500">estimated take-home pork</p>
              <p className="mt-4 border-t border-linen-200 pt-4 font-display text-[1.3rem] text-forest-700">
                {s.price}
              </p>
              <div className="flex-1" />
              <p className="mt-5 text-[0.9375rem] font-semibold text-copper-500 group-hover:text-copper-600">
                See details →
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: 32 }}>
          <Link to="/shares" className="btn-primary">
            View pig shares
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={tint('--sage-100', 60)}>
        <div style={CONTAINER}>
          <StoryHeader
            align="center"
            maxWidth="36rem"
            eyebrow="How it works"
            title="From pasture to pickup."
          />
          <ol
            className="grid list-none grid-cols-1 gap-7 p-0 sm:grid-cols-2 lg:grid-cols-4"
            style={{ marginTop: 52 }}
          >
            {WORK_STEPS.map(([n, title, body]) => (
              <li key={n} className="flex flex-col items-center text-center">
                <div className="numeral">{n}</div>
                <h3 className="mt-4 font-display text-[1.3rem] text-forest-800">{title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-earth-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why */}
      <section id="why" style={CONTAINER}>
        <StoryHeader
          eyebrow="Our farm"
          title={
            <>
              Pasture raised, family loved —<br />
              pork with a story worth telling.
            </>
          }
        />
        <div className="grid gap-[22px] sm:grid-cols-2" style={{ marginTop: 52 }}>
          {VALUES.map(([title, body]) => (
            <div key={title} className="card">
              <h3 className="font-display text-[1.3rem] text-forest-800">{title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-earth-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...CONTAINER, maxWidth: '46rem' }}>
        <StoryHeader align="center" maxWidth="34rem" eyebrow="Questions" />
        <div style={{ marginTop: 44, borderTop: '1px solid var(--border)' }}>
          {FAQS.map(([q, a]) => (
            <Faq key={q} q={q} a={a} />
          ))}
        </div>
      </section>
    </div>
  )
}

/* ---------- layout helpers (exact kit metrics) ---------- */

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
  title?: ReactNode
  lead?: string
  align?: 'left' | 'center'
  maxWidth?: string
}) {
  return (
    <header
      style={{ maxWidth, ...(align === 'center' ? { marginInline: 'auto', textAlign: 'center' } : null) }}
    >
      <p className={`story-eyebrow${align === 'center' ? '' : ' solo'}`}>{eyebrow}</p>
      {title && (
        <h2
          className="fairy-sparkle mt-4 inline-block font-display leading-[1.14] text-forest-800"
          style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.5rem)' }}
        >
          {title}
        </h2>
      )}
      {lead && (
        <p className="text-earth-600" style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}>
          {lead}
        </p>
      )}
    </header>
  )
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '72px 24px 64px' }}>
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="story-eyebrow">Greenwich, New York</p>
          <h1
            className="fairy-sparkle inline-block font-display leading-[1.12] text-forest-800"
            style={{ marginTop: 18, fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
          >
            Pasture Raised,
            <br />
            Family Loved
          </h1>
          <p
            className="font-accent italic text-earth-600"
            style={{ marginTop: 20, fontSize: 'var(--text-lead)', lineHeight: 1.6 }}
          >
            Heritage Gloucestershire Old Spot pigs, raised slowly on pasture for pork that’s tender
            and deeply flavorful.
          </p>
          <div className="flex flex-wrap gap-3" style={{ marginTop: 30 }}>
            <a href="#shares" className="btn-primary">
              Reserve a share
            </a>
            <a href="#how" className="btn-secondary">
              How it works
            </a>
          </div>
        </div>
        <figure className="plate float-slow m-0 hidden lg:block">
          <img
            className="plate-img"
            src="/farm-media/pig-grazing.jpg"
            alt="Old Spot pigs grazing at pasture"
            style={{ borderRadius: '10px 10px 3px 3px' }}
          />
        </figure>
      </div>
    </section>
  )
}

/* ---------- faq ---------- */

function Faq({ q, a }: { q: string; a: string }) {
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
      {open && (
        <p
          className="text-[1.0625rem] leading-[1.7] text-earth-600"
          style={{ margin: '0 0 22px' }}
        >
          {a}
        </p>
      )}
    </div>
  )
}
