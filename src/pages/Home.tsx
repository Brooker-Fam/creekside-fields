import { useEffect, useState, type CSSProperties } from 'react'
import { insforge } from '../lib/insforge'
import type { ShareOption } from '../lib/types'
import ShareCard from '../components/site/ShareCard'
import { WhimsyDivider } from '../components/site/Whimsy'
import {
  WORK_STEPS,
  VALUES,
  SEASONS,
  FARM_PIGS,
  FAQS,
  type PigShareKind,
} from '../content/homeCopy'

type SoldOut = Record<PigShareKind, boolean>

export default function Home() {
  const [soldOut, setSoldOut] = useState<SoldOut>({
    whole: false,
    half: false,
    quarter: false,
    eighth: false,
  })

  useEffect(() => {
    insforge.database
      .from('share_options')
      .select('*')
      .then(({ data }) => {
        const rows = (data ?? []) as ShareOption[]
        if (!rows.length) return
        // A kind is sold out only when it has rows but none are available.
        const next: SoldOut = { whole: false, half: false, quarter: false, eighth: false }
        ;(['whole', 'half', 'quarter', 'eighth'] as PigShareKind[]).forEach((kind) => {
          const forKind = rows.filter((s) => s.kind === kind)
          if (forKind.length) next[kind] = !forKind.some((s) => s.status === 'available')
        })
        setSoldOut(next)
      })
  }, [])

  return (
    <div>
      <Hero />
      <WhimsyDivider />

      {/* Shares */}
      <section id="shares" style={CONTAINER}>
        <StoryHeader
          align="center"
          eyebrow="Pork shares & pricing"
          title="High quality pork from our family to yours."
          lead="Shares are sold by hanging weight at $7.00 per pound. You also pay our USDA processor directly for cutting, wrapping, curing, smoking, and any sausage or specialty options you choose."
        />

        <div
          className="card"
          style={{
            maxWidth: '46rem',
            margin: '28px auto 0',
            background: 'var(--sage-100)',
            display: 'flex',
            gap: 18,
            alignItems: 'flex-start',
          }}
        >
          <img
            src="/brand/ornament-sprig.svg"
            alt=""
            aria-hidden
            style={{ width: 28, marginTop: 2, flexShrink: 0 }}
          />
          <p className="text-[0.9375rem] leading-[1.7] text-earth-600">
            <strong className="text-forest-800">What is hanging weight?</strong> It's what your pig
            weighs after slaughter — once the head, blood, and organs are removed — but before it's
            cut, trimmed, and packaged. It's the honest, whole-animal way to price a share, and the
            number your $7.00 / lb is based on. You take home a bit less once everything is boned out
            and trimmed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3" style={{ marginTop: 40 }}>
          <ShareCard kind="quarter" soldOut={soldOut.quarter} />
          <ShareCard kind="half" soldOut={soldOut.half} />
          <ShareCard kind="whole" soldOut={soldOut.whole} />
        </div>

        <p
          className="text-center text-[0.9375rem] leading-[1.7] text-earth-500"
          style={{ marginTop: 24, maxWidth: '46rem', marginInline: 'auto' }}
        >
          Weights are estimates and vary by animal — every pig finishes a little differently, and
          each family chooses different processing. Your final share cost is settled on the actual
          hanging weight of your pig.
        </p>
      </section>

      {/* How it works */}
      <section id="how" style={tint('--sage-100', 60)}>
        <div style={CONTAINER}>
          <StoryHeader
            align="center"
            maxWidth="36rem"
            eyebrow="How it works"
            title="From pasture to pickup."
            lead="Buying a hog share is simpler than it sounds. Here is the path, step by step."
          />
          <ol
            className="grid list-none grid-cols-1 gap-7 p-0 sm:grid-cols-3 lg:grid-cols-5"
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
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <StoryHeader
            eyebrow="Why Creekside Fields"
            title="Grounded food from a place that matters."
            lead="We farm on a human scale — for the soil, for the animals, and for the families who eat from this land."
          />
          <blockquote style={{ borderLeft: '2px solid var(--copper-500)', paddingLeft: 26, margin: 0 }}>
            <p className="font-accent text-[27px] italic leading-[1.5] text-earth-600">
              Pasture raised with love — slow heritage pigs, daily care, and pork with a story worth
              telling at the dinner table.
            </p>
          </blockquote>
        </div>
        <div className="grid gap-[22px] sm:grid-cols-2" style={{ marginTop: 52 }}>
          {VALUES.map(([title, body]) => (
            <div key={title} className="card">
              <h3 className="font-display text-[1.3rem] text-forest-800">{title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-earth-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our pigs */}
      <section id="pigs" style={tint('--linen-100', 70)}>
        <div style={CONTAINER}>
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <StoryHeader
                eyebrow="Our pigs"
                title="The orchard pig of England."
                lead="At Creekside Fields, our Gloucestershire Old Spot pigs are raised slowly and thoughtfully over the course of more than a year."
              />
              <p
                className="text-[1.0625rem] leading-[1.72] text-earth-600"
                style={{ marginTop: 18, maxWidth: '42rem' }}
              >
                As a heritage breed, Old Spots are known for their gentle temperament, excellent
                foraging instincts, and richly flavored pork. Often called the orchard pig of
                England, they thrive when given the room to root, graze, and explore — fresh air,
                sunshine, and a slower, natural pace of growth.
              </p>
            </div>
            <figure className="plate float-slow m-0">
              <img
                className="plate-img"
                src="/farm-media/pig-grazing.jpg"
                alt="Old Spot pig foraging at pasture"
                style={{ aspectRatio: '4 / 3', borderRadius: '10px 10px 3px 3px' }}
              />
              <figcaption className="plate-cap">Foraging the pasture, spring through fall</figcaption>
            </figure>
          </div>

          <div className="grid gap-[22px] sm:grid-cols-2" style={{ marginTop: 48 }}>
            {SEASONS.map(([title, body]) => (
              <div key={title} className="card" style={{ background: 'var(--white)' }}>
                <p className="story-eyebrow solo" style={{ fontSize: 'var(--text-sm)' }}>
                  {title}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-[1.7] text-earth-600">{body}</p>
              </div>
            ))}
          </div>

          <blockquote
            className="text-center"
            style={{ margin: '52px auto 0', maxWidth: '44rem' }}
          >
            <p
              className="font-accent italic leading-[1.5] text-forest-800"
              style={{ fontSize: 'clamp(1.4rem, 1rem + 1.4vw, 1.9rem)' }}
            >
              The active life of a pasture-raised pig builds strong muscle and beautiful marbling,
              while a diverse diet and slow, heritage growth make pork that is tender, succulent, and
              deeply flavorful.
            </p>
            <p className="story-eyebrow solo mt-[22px] justify-center">
              Exceptional pork starts with exceptional care
            </p>
          </blockquote>
        </div>
      </section>

      {/* Meet the farm */}
      <section id="farm" style={tint('--sage-100', 55)}>
        <div style={CONTAINER}>
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <figure className="plate m-0">
              <img
                className="plate-img"
                src="/farm-media/pig-feast.jpg"
                alt="Pigs at the trough"
                style={{ aspectRatio: '4 / 3' }}
              />
              <figcaption className="plate-cap">Suppertime on the pasture</figcaption>
            </figure>
            <StoryHeader
              eyebrow="Meet the farm"
              title="Sushi, Nori, and Carrot."
              lead="Three Gloucestershire Old Spot gilts, born February 2025 — the heart of this season's shares. Around them: dogs, chickens, creek water, kids, and the quiet work of a family farm."
            />
          </div>
          <ul
            className="grid list-none grid-cols-1 gap-[18px] p-0 sm:grid-cols-3"
            style={{ marginTop: 44 }}
          >
            {FARM_PIGS.map((pig) => (
              <li
                key={pig.name}
                className="rounded-lg border border-linen-200 bg-white p-5 text-center"
              >
                <p className="font-display text-[1.3rem] text-forest-800">{pig.name}</p>
                <p className="mt-2 font-accent text-[0.9375rem] italic text-earth-500">{pig.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...CONTAINER, maxWidth: '46rem' }}>
        <StoryHeader
          align="center"
          maxWidth="34rem"
          eyebrow="Questions"
          title="Questions we hear often."
          lead="Straight answers for first-time share buyers."
        />
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
  title: string
  lead?: string
  align?: 'left' | 'center'
  maxWidth?: string
}) {
  return (
    <header
      style={{ maxWidth, ...(align === 'center' ? { marginInline: 'auto', textAlign: 'center' } : null) }}
    >
      <p className={`story-eyebrow${align === 'center' ? '' : ' solo'}`}>{eyebrow}</p>
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
            Heritage breed Gloucestershire Old Spot pigs.
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
