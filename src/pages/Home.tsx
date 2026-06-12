import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { insforge, priceRange, getShareRateCents } from '../lib/insforge'
import type { Animal, ShareOption } from '../lib/types'
import SectionIntro from '../components/storybook/SectionIntro'
import SectionDivider from '../components/storybook/SectionDivider'
import Fireflies from '../components/storybook/Fireflies'
import FarmLandscape from '../components/storybook/FarmLandscape'
import PigProfileCard from '../components/storybook/PigProfileCard'
import ContactInquiryForm from '../components/storybook/ContactInquiryForm'
import ShareTile from '../components/storybook/ShareTile'
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
    <div className="overflow-hidden">
      <Hero />
      <SectionDivider variant="creek" />
      <PigShares animals={animals} shares={shares} loading={loading} />
      <SectionDivider variant="vines" className="bg-sage-100/40" />
      <HowItWorks />
      <SectionDivider variant="mushrooms" />
      <WhyCreekside />
      <SectionDivider variant="sunflowers" className="bg-cream-100/50" />
      <MeetTheFarm />
      <SectionDivider variant="stars" />
      <Faq />
      <ReserveContact />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-50 px-4 py-16 sm:py-24">
      <FarmLandscape />
      <Fireflies count={5} />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
        <div className="min-w-0">
          <p className="field-tag text-blush-500">Greenwich, New York</p>
          <h1 className="mt-5 max-w-[21.5rem] break-words font-display text-3xl leading-[1.08] text-sage-700 sm:max-w-4xl sm:text-6xl lg:text-7xl">
            Pasture-raised pork from a regenerative family farm you can feel good about.
          </h1>
          <p className="mt-6 max-w-[21.5rem] text-base leading-7 text-mud-600 sm:max-w-2xl sm:text-lg sm:leading-8">
            Creekside Fields is a cozy storybook corner of the world — Old Spot pigs, creek sounds,
            barefoot mornings, fireflies at dusk, and pork raised with care for land, animals, and neighbors.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pig-shares" className="btn-primary">
              Reserve a Pig Share <span aria-hidden>→</span>
            </a>
            <a href="#how-it-works" className="btn-secondary">
              How It Works
            </a>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {['Whole, half, quarter', 'Raised on pasture', 'Cut sheet guidance'].map((item) => (
              <div
                key={item}
                className="rounded-full border border-sage-300/50 bg-cream-100/80 px-4 py-2 text-center text-sm font-semibold text-sage-700 backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="storybook-panel relative mx-auto w-full max-w-[520px] p-5">
          <div className="world-logo aspect-square animate-gentle-sway rounded-[2rem] border-2 border-cream-50/80 shadow-glow" />
          <div className="absolute -bottom-5 left-8 right-8 rounded-full border-2 border-mud-800/10 bg-cream-50/95 px-5 py-3 text-center shadow-soft backdrop-blur-sm">
            <p className="font-hand text-xl italic text-blush-500 sm:text-2xl">
              a storybook farm, with real freezer pork
            </p>
          </div>
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
    <section id="pig-shares" className="mx-auto max-w-6xl px-4 py-20">
      <SectionIntro
        kicker="Pig shares"
        title="A clear, cozy way to buy pork for your freezer."
        body="A pig share means you reserve a portion of one animal before processing. You choose a share size, tell us your cut preferences, and receive pasture-raised pork once it is ready — transparent, neighborly, and reassuring for first-time buyers."
      />
      {loading ? <SharesSkeleton /> : <SharesSummary animals={animals} shares={shares} />}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLACEHOLDERS.map(([title, body]) => (
          <div key={title} className="rounded-[1.25rem] border border-clay-300/35 bg-cream-100/70 p-4">
            <h3 className="font-display text-xl text-clay-500">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-mud-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SharesSkeleton() {
  return (
    <div className="storybook-panel mt-10 animate-pulse p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="h-44 rounded-[1.4rem] bg-cream-200" />
        <div className="h-44 rounded-[1.4rem] bg-cream-200" />
        <div className="h-44 rounded-[1.4rem] bg-cream-200" />
      </div>
    </div>
  )
}

function SharesSummary({ animals, shares }: { animals: Animal[]; shares: ShareOption[] }) {
  const available = shares.filter((s) => s.status === 'available')
  const kinds: PigShareKind[] = ['whole', 'half', 'quarter']
  const fallback = animals.find((a) => a.rate_per_lb_hw_cents != null) ?? null

  return (
    <div className="storybook-panel mt-10 p-6">
      <div className="grid gap-6 md:grid-cols-3">
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
            <ShareTile
              key={kind}
              kind={kind}
              count={rows.length}
              rate={cents != null ? `$${(cents / 100).toFixed(2)} / lb hanging weight` : 'Price placeholder'}
              price={priceRange(low ?? undefined, high ?? undefined)}
            />
          )
        })}
      </div>
      <p className="mt-5 text-sm leading-6 text-mud-600">
        We will walk you through the cut sheet so you do not have to know all the butcher language
        on day one. The goal is simple: pork you understand, raised by people you can text.
      </p>
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-sage-100/80 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          kicker="How it works"
          title="From muddy pasture to tidy freezer packages."
          body="Buying a share can feel mysterious the first time. Here is the whole path, kindly and plainly."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          {WORK_STEPS.map(([n, title, body]) => (
            <div key={n} className="card relative pt-10">
              <div className="absolute -top-4 left-5 grid h-12 w-12 place-items-center rounded-full border-2 border-cream-50 bg-marigold-300 font-display text-2xl text-mud-800 shadow-soft">
                {n}
              </div>
              <h3 className="font-display text-2xl text-sage-700">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mud-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyCreekside() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionIntro
            kicker="Why Creekside Fields"
            title="Regenerative pork should feel like nourishment, not a transaction."
            body="Our work is small and practical: care for the animals, move them with attention, feed the soil, waste less, and send families home with food they can feel good about."
          />
          <div className="mt-8 rounded-[2rem] border-2 border-indigo-100 bg-indigo-100/55 p-6">
            <p className="font-hand text-2xl italic text-indigo-700 sm:text-3xl">
              barefoot mornings, dirty hands, creek sounds, animals, kids, fireflies, good food
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map(([title, body]) => (
            <div key={title} className="card">
              <h3 className="font-display text-2xl text-clay-500">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mud-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MeetTheFarm() {
  return (
    <section id="meet-the-farm" className="bg-cream-100/65 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="storybook-panel p-4">
            <div className="hero-photo min-h-[360px] rounded-[1.6rem] border-2 border-cream-50/80 sm:min-h-[420px]" />
            <p className="mt-4 text-center font-hand text-lg italic text-sage-500">
              Room for future photos, barn notes, and seasonal stories
            </p>
          </div>
          <div>
            <SectionIntro
              kicker="Meet the farm"
              title="Sushi, Nori, and Carrot are the heart of this season."
              body="The pigs are central here: expressive, curious, deeply food-motivated, and very good at reminding us that farming is daily relationship. Around them orbit dogs, cats, chickens, ducks, geese, guinea hens, garden plans, and a lot of mud."
            />
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {FARM_PIGS.map((pig) => (
            <PigProfileCard key={pig.name} {...pig} />
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {['Future photos', 'Animal stories', 'Farm notes'].map((item) => (
            <div
              key={item}
              className="rounded-[1.25rem] border border-sage-300/45 bg-cream-50/80 p-4 text-center font-semibold text-sage-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 py-20">
      <SectionIntro
        kicker="Questions neighbors ask"
        title="Pig share FAQ"
        body="Straight answers for first-time buyers and seasoned freezer-fillers."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {FAQS.map(([q, a]) => (
          <details key={q} className="card group">
            <summary className="cursor-pointer list-none font-display text-2xl text-sage-700">
              {q}
              <span className="float-right text-marigold-500 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-7 text-mud-600">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function ReserveContact() {
  return (
    <section id="reserve" className="px-4 pb-24">
      <div className="storybook-panel relative mx-auto max-w-5xl overflow-hidden p-8 sm:p-10">
        <Fireflies count={2} />
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <p className="field-tag text-blush-500">Ready to reserve?</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-sage-700 sm:text-5xl">
              Tell us which share feels right.
            </h2>
            <p className="mt-4 leading-7 text-mud-600">
              Use the share cards above to jump straight into a reservation, or send us a note below.
              We answer like real people, because we are.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/reserve/quarter" className="btn-primary">
                Reserve a Quarter
              </Link>
              <Link to="/reserve/half" className="btn-secondary">
                Reserve a Half
              </Link>
              <Link to="/reserve/whole" className="btn-secondary">
                Reserve a Whole
              </Link>
            </div>
            <p className="mt-6 rounded-[1rem] border border-marigold-300/40 bg-marigold-100/40 p-4 text-sm leading-6 text-mud-600">
              <strong className="text-sage-700">Confirmation copy:</strong> Thank you. We will tuck your
              name onto the list and follow up with timing, cut sheet details, and next steps.
            </p>
          </div>
          <ContactInquiryForm />
        </div>
      </div>
    </section>
  )
}
