import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { WhimsyDivider } from '../components/site/Whimsy'
import QuestionsLine from '../components/site/QuestionsLine'
import { WORK_STEPS, FAQS } from '../content/homeCopy'
import { SHARE_TIERS } from '../content/sharesCopy'
import { BIRDS, BIRD_PHOTO } from '../content/poultryCopy'

const [GOOSE, DUCK] = BIRDS

/** Everything we sell, at a glance, right under the hero. */
const OPTIONS = [
  {
    href: '/shares#share-options',
    title: 'Pig shares',
    body: `Quarter, half, or whole — from ${SHARE_TIERS[0].price.split('–')[0]}`,
  },
  { href: '/shares#cuts', title: 'Individual cuts', body: 'Bacon, chops, sausage, and more by the pack' },
  {
    href: '/geese-and-ducks',
    title: 'Geese & ducks',
    body: `Whole birds — geese $${GOOSE.pricePerLb}, ducks $${DUCK.pricePerLb} per pound`,
  },
] as const

export default function Home() {
  useEffect(() => {
    document.title = 'Creekside Fields — pasture-raised pork, Greenwich NY'
  }, [])

  return (
    <div>
      <Hero />

      {/* Shares teaser */}
      <section id="shares" style={CONTAINER}>
        <StoryHeader
          align="center"
          eyebrow="Pig shares & pricing"
          title="Choose your share size."
          lead="Quarter, half, and whole shares of our pasture-raised Gloucestershire Old Spot pigs — a curated assortment of cuts with no added nitrates, ready now. Every share is $10 per pound of take-home pork."
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
        <p
          className="mx-auto text-center text-[1.0625rem] leading-[1.7] text-earth-600"
          style={{ marginTop: 22, maxWidth: '36rem' }}
        >
          Just want a few favorites? We also sell individual cuts — bacon, chops, sausage, and more.{' '}
          <a href="/shares#cuts" className="whitespace-nowrap font-semibold text-copper-500 hover:text-copper-600">
            Order individual cuts →
          </a>
        </p>
      </section>

      <WhimsyDivider />

      {/* Geese & ducks */}
      <section id="geese-and-ducks" style={CONTAINER}>
        <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
          <figure className="plate float-slow m-0 mx-auto w-full" style={{ maxWidth: 400 }}>
            <img
              className="plate-img"
              src={BIRD_PHOTO.src}
              srcSet={`${BIRD_PHOTO.small} 600w, ${BIRD_PHOTO.src} 1200w`}
              sizes="(max-width: 448px) calc(100vw - 70px), 380px"
              alt={BIRD_PHOTO.alt}
              loading="lazy"
              style={{ aspectRatio: '4 / 5', objectPosition: '50% 70%', borderRadius: '10px 10px 3px 3px' }}
            />
            <figcaption className="plate-cap">{BIRD_PHOTO.caption}</figcaption>
          </figure>

          <div>
            <StoryHeader
              eyebrow="Geese & ducks"
              title="Whole birds from our pasture."
              lead="We raise geese and ducks on the same pastures as our pigs. Order a whole bird for your table — priced by the pound."
            />
            <dl className="flex flex-wrap gap-x-12 gap-y-5" style={{ marginTop: 28 }}>
              {BIRDS.map((b) => (
                <div key={b.kind}>
                  <dt className="eyebrow">{b.title}</dt>
                  <dd className="mt-2 flex items-baseline gap-2">
                    <span className="font-display leading-none text-forest-800" style={{ fontSize: '2.4rem' }}>
                      ${b.pricePerLb}
                    </span>
                    <span className="text-earth-500" style={{ fontSize: 'var(--text-lead)' }}>
                      per pound
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <div style={{ marginTop: 32 }}>
              <Link to="/geese-and-ducks" className="btn-primary">
                Order geese &amp; ducks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={tint('--sage-100', 60)}>
        <div style={CONTAINER}>
          <StoryHeader
            align="center"
            maxWidth="36rem"
            eyebrow="How it works"
            title="From our farm to your freezer."
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

      {/* FAQ */}
      <section id="faq" style={{ ...CONTAINER, maxWidth: '46rem' }}>
        <StoryHeader align="center" maxWidth="34rem" eyebrow="Questions" />
        <div style={{ marginTop: 44, borderTop: '1px solid var(--border)' }}>
          {FAQS.map(([q, a]) => (
            <Faq key={q} q={q} a={a} />
          ))}
        </div>
        <div style={{ marginTop: 56 }}>
          <QuestionsLine lead="Still have a question? We’d love to hear from you." />
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
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '56px 24px 56px' }}>
      <h1 className="sr-only">Creekside Fields — pasture-raised heritage pork in Greenwich, NY</h1>

      {/* The picture */}
      <figure className="plate float-slow mx-auto" style={{ maxWidth: 880, margin: '0 auto' }}>
        <img
          className="plate-img"
          src="/farm-media/pig-grazing.jpg"
          srcSet="/farm-media/pig-grazing-800.jpg 800w, /farm-media/pig-grazing.jpg 1600w"
          sizes="(max-width: 928px) calc(100vw - 70px), 860px"
          fetchPriority="high"
          alt="A large spotted Gloucestershire Old Spot pig grazing on open pasture under a blue sky"
          style={{ aspectRatio: '16 / 9', borderRadius: '10px 10px 3px 3px' }}
        />
        <figcaption className="plate-cap">A Gloucestershire Old Spot foraging on open pasture</figcaption>
      </figure>

      {/* The offer */}
      <div className="mx-auto text-center" style={{ maxWidth: '40rem', marginTop: 44 }}>
        <p className="story-eyebrow">Pasture-raised heritage pork</p>
        <h2
          className="fairy-sparkle mt-4 inline-block font-display leading-[1.1] text-forest-800"
          style={{ fontSize: 'clamp(2.1rem, 1.4rem + 3vw, 2.9rem)' }}
        >
          Stock your freezer with heritage pork.
        </h2>
        <p
          className="mx-auto font-accent italic text-earth-600"
          style={{ marginTop: 16, maxWidth: '34rem', fontSize: 'var(--text-lead)', lineHeight: 1.6 }}
        >
          Heritage Gloucestershire Old Spot pigs, raised slowly on pasture for pork that’s tender and
          deeply flavorful.
        </p>

        <div className="mt-7 flex items-baseline justify-center gap-2.5">
          <span className="font-display leading-none text-forest-800" style={{ fontSize: '2.6rem' }}>
            $10
          </span>
          <span className="text-earth-500" style={{ fontSize: 'var(--text-lead)' }}>
            per pound
          </span>
        </div>
        <p className="mt-1.5 text-[0.9375rem] text-earth-500">Whole, half, and quarter pig shares — ready now.</p>
      </div>

      {/* Everything we sell, at a glance */}
      <ul className="mx-auto grid list-none gap-4 p-0 md:grid-cols-3" style={{ maxWidth: '58rem', marginTop: 40 }}>
        {OPTIONS.map((o) => (
          <li key={o.title}>
            <a
              href={o.href}
              className="group flex h-full items-center justify-between gap-4 rounded-lg border border-linen-200 bg-surface px-5 py-4 shadow-card transition hover:border-sage-400 hover:shadow-soft"
            >
              <span>
                <span className="block font-display text-[1.3rem] leading-tight text-forest-800">{o.title}</span>
                <span className="mt-1 block text-[0.9375rem] leading-[1.5] text-earth-600">{o.body}</span>
              </span>
              <span aria-hidden className="font-display text-xl text-copper-500 group-hover:text-copper-600">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-[1.0625rem] text-earth-600">
        Questions?{' '}
        <a href="/contact" className="font-semibold text-copper-500 hover:text-copper-600">
          Get in touch →
        </a>
      </p>
    </section>
  )
}

/* ---------- faq ---------- */

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const answerId = useId()
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={answerId}
        className="flex w-full items-center justify-between gap-4 border-0 bg-transparent text-left"
        style={{ padding: '20px 0' }}
      >
        <span className="font-display text-[1.3rem] text-forest-800">{q}</span>
        <span
          aria-hidden
          className="font-display text-2xl text-copper-500"
          style={{ transition: 'transform 200ms', transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          id={answerId}
          className="text-[1.0625rem] leading-[1.7] text-earth-600"
          style={{ margin: '0 0 22px' }}
        >
          {a}
        </p>
      )}
    </div>
  )
}
