import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { insforge } from '../lib/insforge'
import type { ShareOption } from '../lib/types'
import ShareCard from '../components/site/ShareCard'
import ContactInquiryForm from '../components/storybook/ContactInquiryForm'
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
      <div className="py-6">
        <WhimsyDivider />
      </div>

      <Shares soldOut={soldOut} />
      <HowItWorks />
      <WhyCreekside />
      <OurPigs />
      <MeetTheFarm />
      <Faqs />
      <ReserveContact />
    </div>
  )
}

/* ---------- shared bits ---------- */

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
      {lead && <p className="mt-4 text-lg leading-relaxed text-earth-600">{lead}</p>}
    </header>
  )
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-20">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="story-eyebrow">Greenwich, New York</p>
          <h1
            className="fairy-sparkle mt-4 inline-block font-display leading-[1.12] text-forest-800"
            style={{ fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
          >
            Pasture Raised, Family Loved
          </h1>
          <p className="mt-5 font-accent text-xl italic leading-relaxed text-earth-600">
            Heritage breed Gloucestershire Old Spot pigs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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

/* ---------- shares ---------- */

function Shares({ soldOut }: { soldOut: SoldOut }) {
  return (
    <section id="shares" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <StoryHeader
        align="center"
        eyebrow="Pork shares & pricing"
        title="High quality pork from our family to yours."
        lead="Shares are sold by hanging weight at $7.00 per pound. You also pay our USDA processor directly for cutting, wrapping, curing, smoking, and any sausage or specialty options you choose."
      />

      <div className="card mx-auto mt-7 flex max-w-2xl items-start gap-4 bg-sage-100">
        <img src="/brand/ornament-sprig.svg" alt="" aria-hidden className="mt-0.5 w-7 shrink-0" />
        <p className="text-sm leading-relaxed text-earth-600">
          <strong className="text-forest-800">What is hanging weight?</strong> It's what your pig
          weighs after slaughter — once the head, blood, and organs are removed — but before it's
          cut, trimmed, and packaged. It's the honest, whole-animal way to price a share, and the
          number your $7.00 / lb is based on. You take home a bit less once everything is boned out
          and trimmed.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <ShareCard kind="quarter" soldOut={soldOut.quarter} />
        <ShareCard kind="half" soldOut={soldOut.half} />
        <ShareCard kind="whole" soldOut={soldOut.whole} />
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-earth-500">
        Weights are estimates and vary by animal — every pig finishes a little differently, and each
        family chooses different processing. Your final share cost is settled on the actual hanging
        weight of your pig.
      </p>
    </section>
  )
}

/* ---------- how it works ---------- */

function HowItWorks() {
  return (
    <section id="how" className="border-y border-linen-200 bg-sage-100/60">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <StoryHeader
          align="center"
          maxWidth="36rem"
          eyebrow="How it works"
          title="From pasture to pickup."
          lead="Buying a hog share is simpler than it sounds. Here is the path, step by step."
        />
        <ol className="mt-12 grid list-none grid-cols-1 gap-7 p-0 sm:grid-cols-3 lg:grid-cols-5">
          {WORK_STEPS.map(([n, title, body]) => (
            <li key={n} className="flex flex-col items-center text-center">
              <div className="numeral">{n}</div>
              <h3 className="mt-4 font-display text-xl text-forest-800">{title}</h3>
              <p className="mt-2.5 text-sm leading-[1.65] text-earth-600">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- why ---------- */

function WhyCreekside() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <StoryHeader
          eyebrow="Why Creekside Fields"
          title="Grounded food from a place that matters."
          lead="We farm on a human scale — for the soil, for the animals, and for the families who eat from this land."
        />
        <blockquote className="border-l-2 border-copper-500 pl-6">
          <p className="font-accent text-2xl italic leading-[1.5] text-earth-600">
            Pasture raised with love — slow heritage pigs, daily care, and pork with a story worth
            telling at the dinner table.
          </p>
        </blockquote>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {VALUES.map(([title, body]) => (
          <div key={title} className="card">
            <h3 className="font-display text-xl text-forest-800">{title}</h3>
            <p className="mt-2.5 text-sm leading-[1.65] text-earth-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- our pigs ---------- */

function OurPigs() {
  return (
    <section id="pigs" className="border-y border-linen-200 bg-linen-100/70">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <StoryHeader
              eyebrow="Our pigs"
              title="The orchard pig of England."
              lead="At Creekside Fields, our Gloucestershire Old Spot pigs are raised slowly and thoughtfully over the course of more than a year."
            />
            <p className="mt-4 max-w-prose text-base leading-[1.72] text-earth-600">
              As a heritage breed, Old Spots are known for their gentle temperament, excellent
              foraging instincts, and richly flavored pork. Often called the orchard pig of England,
              they thrive when given the room to root, graze, and explore — fresh air, sunshine, and
              a slower, natural pace of growth.
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {SEASONS.map(([title, body]) => (
            <div key={title} className="card bg-white">
              <p className="story-eyebrow solo" style={{ fontSize: 'var(--text-sm)' }}>
                {title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-earth-600">{body}</p>
            </div>
          ))}
        </div>

        <blockquote className="mx-auto mt-12 max-w-2xl text-center">
          <p
            className="font-accent italic leading-[1.5] text-forest-800"
            style={{ fontSize: 'clamp(1.4rem, 1rem + 1.4vw, 1.9rem)' }}
          >
            The active life of a pasture-raised pig builds strong muscle and beautiful marbling,
            while a diverse diet and slow, heritage growth make pork that is tender, succulent, and
            deeply flavorful.
          </p>
          <p className="story-eyebrow solo mt-5 justify-center">
            Exceptional pork starts with exceptional care
          </p>
        </blockquote>
      </div>
    </section>
  )
}

/* ---------- meet the farm ---------- */

function MeetTheFarm() {
  return (
    <section id="farm" className="border-y border-linen-200 bg-sage-100/50">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
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
        <ul className="mt-11 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
          {FARM_PIGS.map((pig) => (
            <li
              key={pig.name}
              className="rounded-md border border-linen-200 bg-white p-5 text-center"
            >
              <p className="font-display text-xl text-forest-800">{pig.name}</p>
              <p className="mt-2 font-accent text-sm italic text-earth-500">{pig.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- faq ---------- */

function Faqs() {
  return (
    <section id="faq" className="mx-auto max-w-2xl px-6 py-20 sm:py-24">
      <StoryHeader
        align="center"
        maxWidth="34rem"
        eyebrow="Questions"
        title="Questions we hear often."
        lead="Straight answers for first-time share buyers."
      />
      <div className="mt-11 border-t border-linen-200">
        {FAQS.map(([q, a]) => (
          <Faq key={q} q={q} a={a} />
        ))}
      </div>
    </section>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-linen-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 border-0 bg-transparent py-5 text-left"
      >
        <span className="font-display text-xl text-forest-800">{q}</span>
        <span
          className="font-display text-2xl text-copper-500 transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      {open && <p className="mb-5 text-base leading-relaxed text-earth-600">{a}</p>}
    </div>
  )
}

/* ---------- reserve / contact ---------- */

function ReserveContact() {
  return (
    <section id="reserve" className="border-t border-linen-200 bg-sage-100/40">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:items-start">
        <div>
          <StoryHeader
            eyebrow="Reserve"
            title="Ready when you are."
            lead="Choose a share above, or send us a note. We will follow up with timing, cut sheet details, and next steps."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/reserve/quarter" className="btn-primary">
              Quarter
            </Link>
            <Link to="/reserve/half" className="btn-secondary">
              Half
            </Link>
            <Link to="/reserve/whole" className="btn-secondary">
              Whole
            </Link>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-earth-500">
            Questions?{' '}
            <a
              href="mailto:brookerhousehold@gmail.com"
              className="text-copper-500 underline hover:text-copper-600"
            >
              brookerhousehold@gmail.com
            </a>
          </p>
        </div>
        <ContactInquiryForm />
      </div>
    </section>
  )
}
