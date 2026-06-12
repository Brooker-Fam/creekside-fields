import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { insforge, priceRange, getShareRateCents } from '../lib/insforge'
import type { Animal, ShareOption } from '../lib/types'
import SectionHeader from '../components/site/SectionHeader'
import ShareCard from '../components/site/ShareCard'
import ContactInquiryForm from '../components/storybook/ContactInquiryForm'
import {
  WORK_STEPS,
  VALUES,
  FAQS,
  FARM_PIGS,
  PRICING_PLACEHOLDERS,
  type PigShareKind,
} from '../content/homeCopy'

export default function Home() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [shares, setShares] = useState<ShareOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      insforge.database.from('animals').select('*').order('display_order', { ascending: true }),
      insforge.database.from('share_options').select('*'),
    ]).then(([a, s]) => {
      if (a.data) setAnimals(a.data as Animal[])
      if (s.data) setShares(s.data as ShareOption[])
      setLoading(false)
    })
  }, [])

  return (
    <>
      <Hero />
      <PigShares animals={animals} shares={shares} loading={loading} />
      <div className="section-rule" />
      <HowItWorks />
      <div className="section-rule" />
      <WhyCreekside />
      <div className="section-rule" />
      <MeetTheFarm />
      <div className="section-rule" />
      <Faq />
      <ReserveContact />
    </>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <div className="hero-photo absolute inset-0 scale-105" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-linen-50/95 via-linen-50/88 to-linen-50/40"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 py-20 lg:flex-row lg:items-center lg:gap-16">
        <div className="max-w-xl lg:flex-1">
          <p className="eyebrow">Greenwich, New York</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] text-forest-800 sm:text-5xl lg:text-6xl">
            Pasture-raised pork, raised with love.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-earth-600">
            Creekside Fields is a small regenerative family farm. Heritage Gloucestershire Old Spots
            on grass and woods, creek water, daily care — and shares for families who want to know
            where their food comes from.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pig-shares" className="btn-primary">
              Reserve a share
            </a>
            <a href="#how-it-works" className="btn-secondary">
              How it works
            </a>
          </div>
        </div>
        <div className="mt-12 flex shrink-0 flex-col items-center lg:mt-0">
          <div className="world-logo h-48 w-48 rounded-full border border-linen-200 shadow-soft sm:h-56 sm:w-56" />
          <p className="mt-4 font-accent text-xl italic text-earth-500">Creekside Fields</p>
        </div>
      </div>
    </section>
  )
}

function PigShares({
  animals,
  shares,
  loading,
}: {
  animals: Animal[]
  shares: ShareOption[]
  loading: boolean
}) {
  return (
    <section id="pig-shares" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <SectionHeader
        eyebrow="Pig shares"
        title="Good pork for your freezer."
        lead="Reserve a whole, half, or quarter share before processing. We will walk you through the cut sheet, keep you updated on timing, and deliver pasture-raised pork you can feel good about."
      />
      {loading ? <SharesSkeleton /> : <SharesSummary animals={animals} shares={shares} />}
      <dl className="mt-12 grid gap-6 border-t border-linen-200 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLACEHOLDERS.map(([title, body]) => (
          <div key={title}>
            <dt className="text-sm font-semibold text-forest-700">{title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-earth-600">{body}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function SharesSkeleton() {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-64 animate-pulse rounded-lg bg-linen-200" />
      ))}
    </div>
  )
}

function SharesSummary({ animals, shares }: { animals: Animal[]; shares: ShareOption[] }) {
  const available = shares.filter((s) => s.status === 'available')
  const kinds: PigShareKind[] = ['whole', 'half', 'quarter']
  const fallback = animals.find((a) => a.rate_per_lb_hw_cents != null) ?? null

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {kinds.map((kind) => {
        const rows = available.filter((s) => s.kind === kind)
        const low = rows.reduce(
          (m, s) => (s.est_total_low_cents && (!m || s.est_total_low_cents < m) ? s.est_total_low_cents : m),
          null as number | null,
        )
        const high = rows.reduce(
          (m, s) => (s.est_total_high_cents && (!m || s.est_total_high_cents > m) ? s.est_total_high_cents : m),
          null as number | null,
        )
        const cents = rows.length ? getShareRateCents(rows[0], fallback) : null
        return (
          <ShareCard
            key={kind}
            kind={kind}
            count={rows.length}
            rate={cents != null ? `$${(cents / 100).toFixed(2)} / lb hanging weight` : 'Pricing TBD'}
            price={priceRange(low ?? undefined, high ?? undefined)}
          />
        )
      })}
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-sage-100/50 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="How it works"
          title="From pasture to pickup."
          lead="Buying a hog share is simpler than it sounds. Here is the path, step by step."
        />
        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {WORK_STEPS.map(([n, title, body]) => (
            <li key={n} className="border-t border-sage-200 pt-6">
              <p className="font-display text-sm text-copper-500">{n}</p>
              <h3 className="mt-2 font-display text-xl text-forest-800">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-earth-600">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function WhyCreekside() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <SectionHeader
          eyebrow="Why Creekside Fields"
          title="Grounded food from a place that matters."
          lead="We farm on a human scale — for soil, for animals, and for the families who eat from this land."
        />
        <blockquote className="border-l-2 border-copper-500 pl-6">
          <p className="font-accent text-2xl italic leading-relaxed text-earth-600">
            Pasture raised with love — slow heritage pigs, daily care, and pork with a story worth
            telling at the dinner table.
          </p>
        </blockquote>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {VALUES.map(([title, body]) => (
          <div key={title} className="card">
            <h3 className="font-display text-xl text-forest-800">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-earth-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MeetTheFarm() {
  return (
    <section id="meet-the-farm" className="bg-linen-100/60 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-lg border border-linen-200 shadow-card">
            <div className="hero-photo aspect-[4/3] min-h-[280px]" />
          </div>
          <div>
            <SectionHeader
              eyebrow="Meet the farm"
              title="Sushi, Nori, and Carrot."
              lead="Three Gloucestershire Old Spot gilts, born February 2025 — the heart of this season's shares. Around them: dogs, chickens, creek water, kids, and the quiet work of a family farm."
            />
          </div>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {FARM_PIGS.map((pig) => (
            <li key={pig.name} className="rounded-lg border border-linen-200 bg-white p-5">
              <p className="font-display text-xl text-forest-800">{pig.name}</p>
              <p className="mt-2 text-sm text-earth-500">{pig.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:py-24">
      <SectionHeader
        eyebrow="FAQ"
        title="Questions we hear often."
        lead="Straight answers for first-time share buyers."
      />
      <div className="mt-12 divide-y divide-linen-200 border-y border-linen-200">
        {FAQS.map(([q, a]) => (
          <details key={q} className="group py-5">
            <summary className="cursor-pointer list-none pr-8 font-display text-lg text-forest-800">
              {q}
              <span className="float-right text-copper-500 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 pr-4 text-sm leading-relaxed text-earth-600">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function ReserveContact() {
  return (
    <section id="reserve" className="border-t border-linen-200 bg-sage-100/40 px-4 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeader
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
            <a href="mailto:brookerhousehold@gmail.com" className="text-copper-500 underline hover:text-copper-600">
              brookerhousehold@gmail.com
            </a>
          </p>
        </div>
        <ContactInquiryForm />
      </div>
    </section>
  )
}
