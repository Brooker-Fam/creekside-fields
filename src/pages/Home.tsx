import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge, priceRange, getShareRateCents } from '../lib/insforge'
import type { Animal, ShareKind, ShareOption } from '../lib/types'

type PigShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter' | 'eighth'>

const SHARE_COPY: Record<PigShareKind, { title: string; freezer: string; meat: string; note: string }> = {
  whole: {
    title: 'Whole pig',
    freezer: 'Best for a full chest freezer',
    meat: 'About 195 lb cut and wrapped at our planning weight',
    note: 'Most flexible cut sheet and the best value per pound.',
  },
  half: {
    title: 'Half pig',
    freezer: 'Fits many upright freezers',
    meat: 'About 95-100 lb cut and wrapped',
    note: 'A roomy family share with plenty of chops, roasts, bacon, sausage, and ground pork.',
  },
  quarter: {
    title: 'Quarter pig',
    freezer: 'Fits a freezer drawer or small chest freezer',
    meat: 'About 45-50 lb cut and wrapped',
    note: 'A friendly first share if you are new to buying meat this way.',
  },
  eighth: {
    title: 'Eighth pig',
    freezer: 'Fits a freezer shelf',
    meat: 'About 18-20 lb cut and wrapped',
    note: 'A small sampler share when available.',
  },
}

const WORK_STEPS = [
  ['1', 'Reserve your share', 'Choose whole, half, or quarter and place a deposit so we can hold your spot.'],
  ['2', 'Choose cut preferences', 'Tell the butcher how you like your pork: chops, roasts, bacon, sausage, bones, lard, and extras.'],
  ['3', 'We raise them on pasture', 'The pigs root, wander, rest in shade, and help us turn care for animals into care for land.'],
  ['4', 'The processor prepares it', 'Eagle Bridge Custom Meat & Smokehouse handles slaughter, cut, wrap, smoking, and sausage options.'],
  ['5', 'Fill your freezer', 'Pick up from the processor or the farm, then come home with pork that has a place and a story.'],
]

const VALUES = [
  ['Rotational care', 'Pasture and wooded edges are part of the work: movement, rest, manure, roots, and regrowth.'],
  ['Animal dignity', 'Clean water, shade, room to root, daily attention, and a slower heritage breed life.'],
  ['Soil health', 'Regenerative farming starts underground, where living soil turns care into future abundance.'],
  ['Family scale', 'Small batches, real names, muddy boots, kids underfoot, and no pretending we are a factory.'],
]

const FAQS = [
  ['How much freezer space do I need?', 'Plan on a chest freezer for a whole share, an upright freezer for a half, and a roomy freezer drawer or small chest freezer for a quarter.'],
  ['What cuts are included?', 'Expect a mix of chops, roasts, bacon or belly, hams, sausage or ground pork, ribs, bones, lard, and optional offal depending on your cut sheet.'],
  ['How much meat will I get?', 'A whole pig is roughly 195 lb cut and wrapped at our current planning weight. A half is about 95-100 lb and a quarter about 45-50 lb.'],
  ['Do I pay the processor separately?', 'Our current share pricing is designed to include base processing. Specialty smoking, no-nitrate curing, links, hot dogs, and specialty sausage may add pass-through costs.'],
  ['Is the pork USDA processed?', 'The processor details will be confirmed before pickup. We will clearly explain whether a share is custom processed or USDA processed before final payment.'],
  ['Can I split a share with a friend?', 'Yes. A half or whole share is often lovely to split. Choose one person to reserve and pay, then divide the boxes together.'],
  ['When will it be ready?', 'We are planning for summer pickup. We will text reservation holders as soon as the processing date is locked in.'],
]

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
      <FolkDivider />
      <PigShares animals={animals} shares={shares} loading={loading} />
      <HowItWorks />
      <WhyCreekside />
      <MeetTheFarm />
      <Faq />
      <ReserveContact />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative bg-cream-50 px-4 py-16 sm:py-20">
      <span className="firefly left-[8%] top-28" />
      <span className="firefly right-[18%] top-24 opacity-70" />
      <span className="firefly bottom-20 right-[9%] opacity-80" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
        <div className="relative z-10 min-w-0">
          <p className="field-tag text-blush-500">Greenwich, New York</p>
          <h1 className="mt-5 max-w-[21.5rem] break-words font-display text-3xl leading-[1.08] text-sage-700 sm:max-w-4xl sm:text-6xl lg:text-7xl">
            Pasture-raised pork from a small farm with creekwater in its bones.
          </h1>
          <p className="mt-6 max-w-[21.5rem] text-base leading-7 text-mud-600 sm:max-w-2xl sm:text-lg sm:leading-8">
            Creekside Fields is a regenerative family farm where Old Spot pigs root through
            pasture, kids run barefoot, fireflies blink at dusk, and good food begins with care.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pig-shares" className="btn-primary">Reserve a Pig Share <span aria-hidden>→</span></a>
            <a href="#how-it-works" className="btn-secondary">How It Works</a>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {['Whole, half, quarter', 'Raised on pasture', 'Cut sheet guidance'].map((item) => (
              <div key={item} className="rounded-full border border-sage-300/50 bg-cream-100/70 px-4 py-2 text-center text-sm font-semibold text-sage-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="storybook-panel relative mx-auto w-full max-w-[520px] p-5">
          <div className="world-logo aspect-square rounded-[2rem] border-2 border-cream-50/80 shadow-glow" />
          <div className="absolute -bottom-5 left-8 right-8 rounded-full border-2 border-mud-800/10 bg-cream-50 px-5 py-3 text-center shadow-soft">
            <p className="font-hand text-2xl italic text-blush-500">a storybook farm, with real freezer pork</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function PigShares({ animals, shares, loading }: { animals: Animal[]; shares: ShareOption[]; loading: boolean }) {
  return (
    <section id="pig-shares" className="mx-auto max-w-6xl px-4 py-20">
      <SectionIntro
        kicker="Pig shares"
        title="A clear, cozy way to buy pork for your freezer."
        body="A pig share means you reserve a portion of one animal before processing. You choose a share size, tell us your cut preferences, and receive a freezer full of pasture-raised pork once it is ready."
      />
      {loading ? <SharesSkeleton /> : <SharesSummary animals={animals} shares={shares} />}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ['Price', 'Whole $7.75/lb HW, half $8.50/lb HW, quarter $9.25/lb HW.'],
          ['Deposit', 'Deposit holds your share; final balance is based on actual hanging weight.'],
          ['Processing', 'Base processing is included; specialty curing or links may add pass-through costs.'],
          ['Pickup', 'Summer pickup from the processor or farm once everything is cut and wrapped.'],
        ].map(([title, body]) => (
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

function ShareTile({ kind, count, rate, price }: { kind: PigShareKind; count: number; rate: string; price: string }) {
  const posthog = usePostHog()
  const soldOut = count === 0
  const copy = SHARE_COPY[kind]

  return (
    <Link
      to={soldOut ? '#pig-shares' : `/reserve/${kind}`}
      onClick={() => posthog?.capture('share_size_selected', { share_kind: kind, available_count: count, source: 'home_storybook' })}
      className={`group relative min-h-[17rem] rounded-[1.5rem] border-2 p-5 shadow-soft transition ${
        soldOut
          ? 'cursor-not-allowed border-mud-800/10 bg-cream-200/60 opacity-70'
          : 'border-sage-300/45 bg-cream-50/90 hover:-translate-y-1 hover:border-marigold-300/70'
      }`}
    >
      <span className="absolute right-5 top-5 text-3xl" aria-hidden>{kind === 'whole' ? '✦' : kind === 'half' ? '✧' : '•'}</span>
      <p className="font-hand text-2xl italic text-blush-500">{copy.title}</p>
      <p className="mt-3 font-display text-3xl text-sage-700">{soldOut ? 'Sold out' : `${count} available`}</p>
      <p className="mt-3 text-sm font-semibold text-indigo-700">{rate}</p>
      <p className="mt-1 text-sm text-mud-600">Est. {price || 'final total TBD'}</p>
      <p className="mt-4 text-sm leading-6 text-mud-600">{copy.meat}. {copy.freezer}.</p>
      <p className="mt-3 text-sm leading-6 text-mud-600">{copy.note}</p>
      {!soldOut && <p className="mt-5 text-sm font-bold text-clay-500 group-hover:text-marigold-500">Reserve this share →</p>}
    </Link>
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
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionIntro
            kicker="Why Creekside Fields"
            title="Regenerative pork should feel like nourishment, not a transaction."
            body="Our work is small and practical: care for the animals, move them with attention, feed the soil, waste less, and send families home with food they can feel good about."
          />
          <div className="mt-8 rounded-[2rem] border-2 border-indigo-100 bg-indigo-100/55 p-6">
            <p className="font-hand text-3xl italic text-indigo-700">barefoot mornings, dirty hands, creek sounds, animals, kids, fireflies, good food</p>
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
    <section className="bg-cream-100/65 px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="storybook-panel p-4">
          <div className="hero-photo min-h-[420px] rounded-[1.6rem] border-2 border-cream-50/80" />
        </div>
        <div>
          <SectionIntro
            kicker="Meet the farm"
            title="Sushi, Nori, and Carrot are the heart of this season."
            body="The pigs are central here: expressive, curious, deeply food-motivated, and very good at reminding us that farming is daily relationship. Around them orbit dogs, cats, chickens, ducks, geese, guinea hens, garden plans, future stories, and a lot of mud."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Future photos', 'Animal stories', 'Farm notes'].map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-sage-300/45 bg-cream-50/80 p-4 text-center font-semibold text-sage-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
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
              <span className="float-right text-marigold-500 group-open:rotate-45">+</span>
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
        <span className="firefly right-12 top-10" />
        <span className="firefly bottom-14 left-16 opacity-70" />
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="field-tag text-blush-500">Ready to reserve?</p>
            <h2 className="mt-4 font-display text-5xl leading-tight text-sage-700">Tell us which share feels right.</h2>
            <p className="mt-4 leading-7 text-mud-600">
              Use the share cards above to enter the reservation form, or email us with questions.
              We will answer like real people, because we are.
            </p>
          </div>
          <div className="rounded-[1.5rem] border-2 border-sage-300/40 bg-cream-50/80 p-5">
            <div className="grid gap-3">
              <Link to="/reserve/quarter" className="btn-primary justify-center">Reserve a Quarter</Link>
              <Link to="/reserve/half" className="btn-secondary justify-center">Reserve a Half</Link>
              <Link to="/reserve/whole" className="btn-secondary justify-center">Reserve a Whole</Link>
              <a href="mailto:brookerhousehold@gmail.com" className="btn-secondary justify-center">Ask a Question</a>
            </div>
            <p className="mt-4 text-center text-sm leading-6 text-mud-600">
              Confirmation copy: Thank you. We will tuck your name onto the list and follow up with timing, cut sheet details, and next steps.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionIntro({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div>
      <p className="field-tag text-blush-500">{kicker}</p>
      <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-sage-700 sm:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-mud-600">{body}</p>
    </div>
  )
}

function FolkDivider() {
  return (
    <div className="bg-cream-50 px-4">
      <div className="folk-border mx-auto max-w-6xl" />
    </div>
  )
}
