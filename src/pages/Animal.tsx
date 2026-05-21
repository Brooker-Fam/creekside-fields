import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { insforge, priceRange, formatCents } from '../lib/insforge'
import type { Animal, ShareOption } from '../lib/types'

export default function AnimalPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [shares, setShares] = useState<ShareOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      insforge.database.from('animals').select('*').eq('id', id).single(),
      insforge.database.from('share_options').select('*').eq('animal_id', id).order('kind'),
    ]).then(([a, s]) => {
      if (a.data) setAnimal(a.data as Animal)
      if (s.data) setShares(s.data as ShareOption[])
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-20">Loading…</div>
  if (!animal) return <div className="mx-auto max-w-4xl px-4 py-20">Pig not found.</div>

  const grouped = groupBy(shares, (s) => s.kind)

  return (
    <article>
      <section className="bg-cream-100 border-b-2 border-mud-800">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-12 w-12 rotate-12 rounded-full bg-blush-200" />
            <img
              src={animal.hero_image_url ?? ''}
              alt={animal.headline ?? 'pig'}
              className="relative aspect-[4/3] w-full rounded-3xl border-2 border-mud-800 object-cover shadow-sketch"
            />
          </div>
          <div>
            <Link to="/" className="hand text-2xl text-blush-500 hover:underline">← back to the hogs</Link>
            <h1 className="mt-2 font-display text-5xl leading-tight">{animal.breed}</h1>
            {animal.headline && <p className="mt-1 hand text-2xl text-mud-600">{animal.headline}</p>}
            <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <Fact label="Born" value={fmt(animal.dob)} />
              <Fact label="Ready by" value={fmt(animal.ready_by)} />
              <Fact label="Diet" value="Pasture + scraps" />
              <Fact label="Sex" value={animal.sex ?? 'unknown'} />
              <Fact label="Breed" value="Old Spots" />
              <Fact label="Status" value={animal.status} />
            </dl>
            {animal.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {animal.tags.map((t) => (
                  <span key={t} className="rounded-full border-2 border-mud-800 bg-cream-50 px-3 py-1 text-xs font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {animal.story && (
        <section className="mx-auto max-w-3xl px-4 py-12">
          <p className="hand text-3xl text-blush-500">The story</p>
          <p className="mt-2 text-lg leading-relaxed text-mud-800">{animal.story}</p>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 pb-20">
        <p className="hand text-3xl text-blush-500">Reserve a share</p>
        <h2 className="font-display text-4xl">Pick your portion</h2>
        {animal.rate_per_lb_hw_cents != null && (
          <div className="mt-4 inline-flex items-baseline gap-2 rounded-full border-2 border-mud-800 bg-cream-100 px-4 py-1.5 shadow-sketch">
            <span className="text-xs font-semibold uppercase tracking-wide text-mud-600">Rate</span>
            <span className="font-display text-xl">
              ${(animal.rate_per_lb_hw_cents / 100).toFixed(2)} / lb hanging weight
            </span>
          </div>
        )}
        <p className="mt-3 max-w-prose text-mud-600">
          Final price is hanging weight × per-pound rate × your share, paid in one bill to us. The
          deposit holds your share and counts toward your total.
        </p>
        <div className="mt-8 space-y-6">
          {(['whole', 'half', 'quarter'] as const).map((kind) =>
            grouped[kind]?.length ? (
              <ShareGroup key={kind} kind={kind} shares={grouped[kind]} />
            ) : null,
          )}
        </div>
      </section>
    </article>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-mud-600">{label}</dt>
      <dd className="font-semibold first-letter:uppercase">{value}</dd>
    </div>
  )
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

const SHARE_DESC: Record<string, { title: string; blurb: string; freezer: string }> = {
  whole:   { title: 'Whole hog',    blurb: 'The whole animal, every cut. The best per-pound value.',         freezer: '~140–150 lb of pork · large chest freezer' },
  half:    { title: 'Half hog',     blurb: 'Half the animal, half the freezer. Same cuts, halved.',         freezer: '~70–75 lb · upright freezer' },
  quarter: { title: 'Quarter hog',  blurb: 'A quarter share. Great if it\'s your first time.',               freezer: '~35–40 lb · regular freezer drawer' },
  eighth:  { title: 'Eighth hog',   blurb: 'A sampler share.',                                                freezer: '~18–20 lb' },
  dozen:   { title: 'Dozen',        blurb: '',                                                                freezer: '' },
  custom:  { title: 'Custom',       blurb: '',                                                                freezer: '' },
}

function ShareGroup({ kind, shares }: { kind: string; shares: ShareOption[] }) {
  const info = SHARE_DESC[kind]
  const available = shares.filter((s) => s.status === 'available')
  const ref = available[0] ?? shares[0]
  return (
    <div className="card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-display text-2xl">{info.title}</h3>
          <p className="text-sm text-mud-600">{info.blurb}</p>
        </div>
        <p className="text-sm text-mud-600">{info.freezer}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-mud-800/20 pt-4">
        <div>
          <p className="text-sm text-mud-600">
            Est. {priceRange(ref.est_total_low_cents, ref.est_total_high_cents)} · deposit {formatCents(ref.deposit_cents)}
          </p>
          <p className="mt-1 text-sm font-semibold">
            {available.length > 0 ? `${available.length} available` : 'All sold'}
          </p>
        </div>
        {available[0] ? (
          <Link to={`/reserve/${available[0].id}`} className="btn-primary">
            Reserve →
          </Link>
        ) : (
          <span className="rounded-full border-2 border-mud-800 bg-sage-200 px-4 py-2 text-sm font-semibold uppercase text-sage-700">
            Sold out
          </span>
        )}
      </div>
    </div>
  )
}

function groupBy<T, K extends string>(arr: T[], fn: (x: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>
  for (const item of arr) {
    const k = fn(item)
    ;(out[k] ||= []).push(item)
  }
  return out
}
