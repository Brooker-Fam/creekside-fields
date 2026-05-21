import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { insforge, priceRange } from '../lib/insforge'
import type { Animal, ShareOption, ShareKind } from '../lib/types'
import Spots from '../components/Spots'

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
    <div>
      <Hero />
      <section id="shares" className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10">
          <p className="hand text-3xl text-blush-500">Available now</p>
          <h2 className="font-display text-4xl">Shares for summer pickup</h2>
          <p className="mt-2 max-w-prose text-mud-600">
            Two heritage Gloucestershire Old Spots gilts, born February 2025, raised on pasture and
            cafeteria leftovers from the local elementary school. Ready by end of June.
          </p>
        </div>
        {loading ? (
          <SharesSkeleton />
        ) : (
          <SharesSummary animals={animals} shares={shares} />
        )}
        <BreedInfo />
      </section>

      <HowItWorks />

      <Story />
    </div>
  )
}

function SharesSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="h-24 rounded-2xl bg-cream-200" />
        <div className="h-24 rounded-2xl bg-cream-200" />
        <div className="h-24 rounded-2xl bg-cream-200" />
      </div>
    </div>
  )
}

function SharesSummary({ animals, shares }: { animals: Animal[]; shares: ShareOption[] }) {
  const available = shares.filter((s) => s.status === 'available')
  const byKind = (k: ShareKind) => available.filter((s) => s.kind === k)
  const wholes = byKind('whole')
  const halves = byKind('half')
  const quarters = byKind('quarter')

  const priceFor = (rows: ShareOption[]) => {
    if (!rows.length) return null
    const low = rows.reduce(
      (m, s) => (s.est_total_low_cents && (!m || s.est_total_low_cents < m) ? s.est_total_low_cents : m),
      null as number | null,
    )
    const high = rows.reduce(
      (m, s) => (s.est_total_high_cents && (!m || s.est_total_high_cents > m) ? s.est_total_high_cents : m),
      null as number | null,
    )
    return priceRange(low ?? undefined, high ?? undefined)
  }

  // Both gilts share the same rate, so any one with a rate set is fine.
  const rateCents = animals.find((a) => a.rate_per_lb_hw_cents != null)?.rate_per_lb_hw_cents ?? null

  return (
    <div className="card">
      {rateCents != null && (
        <div className="mb-6 flex flex-wrap items-baseline gap-2">
          <span className="rounded-full border-2 border-mud-800 bg-cream-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sketch">
            Rate
          </span>
          <span className="font-display text-2xl">
            ${(rateCents / 100).toFixed(2)} / lb hanging weight
          </span>
          <span className="text-sm text-mud-600">all-in, no separate processor invoice</span>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        <ShareTile kind="whole" name="Whole" count={wholes.length} freezer="chest freezer" price={priceFor(wholes)} />
        <ShareTile kind="half" name="Half" count={halves.length} freezer="upright freezer" price={priceFor(halves)} />
        <ShareTile kind="quarter" name="Quarter" count={quarters.length} freezer="freezer drawer" price={priceFor(quarters)} />
      </div>
      <p className="mt-4 text-xs text-mud-600">
        Final price = your share % × actual hanging weight × the rate above. Locked at slaughter;
        the dollar ranges in each tile are estimates. Pick a size and we'll match you to one of our
        two gilts at reserve time — they're sisters from the same litter.
      </p>
    </div>
  )
}

function ShareTile({
  kind,
  name,
  count,
  freezer,
  price,
}: {
  kind: ShareKind
  name: string
  count: number
  freezer: string
  price: string | null
}) {
  const soldOut = count === 0
  const inner = (
    <>
      <p className="text-xs uppercase tracking-wide text-mud-600">{name} shares</p>
      <p className="mt-1 font-display text-4xl">{count}</p>
      <p className="mt-1 text-sm text-mud-600">{soldOut ? 'sold out' : `available · ${freezer}`}</p>
      {price && <p className="mt-3 text-sm font-semibold">{price}</p>}
      {!soldOut && (
        <p className="mt-3 text-sm font-semibold text-blush-500">
          Reserve <span aria-hidden>→</span>
        </p>
      )}
    </>
  )
  const classes = `block rounded-2xl border-2 border-mud-800 p-5 shadow-sketch transition ${
    soldOut ? 'cursor-not-allowed bg-cream-200 opacity-60' : 'bg-cream-50 hover:-translate-y-0.5 hover:bg-blush-100'
  }`
  if (soldOut) return <div className={classes}>{inner}</div>
  return (
    <Link to={`/reserve/${kind}`} className={classes}>
      {inner}
    </Link>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-mud-800 bg-cream-100">
      <Spots className="absolute -left-12 top-4 h-56 w-56 opacity-20" />
      <Spots className="absolute -right-16 bottom-0 h-72 w-72 rotate-45 opacity-20" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div>
          <p className="hand text-4xl text-blush-500">Hi there, neighbor.</p>
          <h1 className="mt-2 font-display text-6xl leading-[0.95] sm:text-7xl">
            Heritage hogs,<br />
            <span className="italic text-sage-700">by the share.</span>
          </h1>
          <p className="mt-6 max-w-prose text-lg text-mud-600">
            Two Gloucestershire Old Spots gilts, born February 2025, raised on grass, woods, and the
            local school's cafeteria leftovers since they were eight weeks old. Reserve a whole,
            half, or quarter share. Pickup from the farm or the processor; ready by end of June.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shares" className="btn-primary">Pick a share <span aria-hidden>→</span></a>
            <Link to="/about" className="btn-secondary">How it works</Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-16 w-16 rotate-12 rounded-full bg-blush-200" />
          <div className="absolute -bottom-4 -right-4 h-20 w-20 -rotate-12 rounded-full bg-sage-200" />
          <img
            src="/farm-media/pig-grazing.jpg"
            alt="Spotted heritage pig in pasture"
            className="relative h-full w-full rounded-3xl border-2 border-mud-800 object-cover shadow-sketch"
          />
          <div className="absolute -bottom-6 left-6 -rotate-3 rounded-full border-2 border-mud-800 bg-cream-50 px-4 py-1.5 text-sm font-semibold shadow-sketch">
            <span className="hand text-xl text-blush-500">Greenwich, NY</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function BreedInfo() {
  return (
    <div className="card mt-10 grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
      <div>
        <p className="hand text-2xl text-blush-500">About the breed</p>
        <h3 className="font-display text-3xl">Gloucestershire Old Spots</h3>
        <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-mud-600">
          Heritage · slow-grow · pasture breed
        </p>
      </div>
      <div className="space-y-3 text-mud-700">
        <p>
          Old English breed from Gloucestershire, sometimes called the "orchard pig" — they were
          traditionally turned loose under fruit trees to clean up windfalls.
        </p>
        <p>
          Pink with the black spots, docile, hardy, made for outdoor life. The breed is on The
          Livestock Conservancy's watchlist; raising them is part of why they're still around.
        </p>
        <p>
          They grow slowly — twice as slow as a commercial pig — which is why the meat is so deeply
          marbled and flavorful. People who try heritage pork once tend to never go back.
        </p>
      </div>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Reserve a share',
      body: 'Pick whole, half, or quarter. Sign a quick bill of sale and put down a deposit to hold the share.',
    },
    {
      n: '2',
      title: 'Cut sheet (if you reserve early)',
      body: 'Reserve before we schedule the processing date and you get a custom cut sheet — bacon thickness, sausage flavors, chops vs. roasts. Reserve after and you get our standard pre-cut packages.',
    },
    {
      n: '3',
      title: 'Pick up from the farm or processor',
      body: 'We\'re going USDA-inspected, so you can grab your meat directly from the processor or come pick it up at our place — whichever\'s easier.',
    },
  ]
  return (
    <section className="bg-sage-100 border-y-2 border-mud-800 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="hand text-3xl text-blush-500">The flow</p>
        <h2 className="mb-10 font-display text-4xl">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card relative bg-cream-50">
              <div className="absolute -top-5 -left-5 grid h-12 w-12 place-items-center rounded-full border-2 border-mud-800 bg-blush-300 font-display text-2xl shadow-sketch">
                {s.n}
              </div>
              <h3 className="mt-2 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-mud-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center">
      <p className="hand text-4xl text-blush-500">What they eat</p>
      <h2 className="mt-2 font-display text-5xl">Pasture, woods, and a lot of mac and cheese</h2>
      <p className="mt-6 text-lg leading-relaxed text-mud-600">
        Most of our pigs' diet is the pasture and the woods they live in. The rest is leftover food
        from the local elementary school — turns out kids leave behind a serious amount of mac and
        cheese, mashed potatoes, and pizza crust. Pigs love it; nothing goes in the trash; we end
        up with very flavorful pork.
      </p>
    </section>
  )
}
