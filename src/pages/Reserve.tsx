import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { insforge, formatCents, priceRange } from '../lib/insforge'
import type { Animal, ShareOption } from '../lib/types'
import { SHARE_PRICE_RANGE } from '../content/sharesCopy'
import { INQUIRY_PREFILL_KEY, type InquiryPrefill } from '../components/storybook/ContactInquiryForm'
import ReservationForm from '../components/site/ReservationForm'

const SHARE_PCT: Record<string, number> = {
  whole: 100,
  half: 50,
  quarter: 25,
  eighth: 12.5,
}

const SHARE_KIND_TITLE: Record<string, string> = {
  whole: 'Whole pig share',
  half: 'Half pig share',
  quarter: 'Quarter pig share',
  eighth: 'Eighth pig share',
}

const SHARE_KIND_BLURB: Record<string, { meat: string; freezer: string }> = {
  whole:   { meat: 'about 273–308 lb of cut & wrapped pork', freezer: 'fills a chest freezer' },
  half:    { meat: 'about 137–154 lb of cut & wrapped pork', freezer: 'fits an upright freezer' },
  quarter: { meat: 'about 68–77 lb of cut & wrapped pork',   freezer: 'fits in a freezer drawer' },
  eighth:  { meat: 'about 34–39 lb of cut & wrapped pork',   freezer: 'fits a freezer shelf' },
}

function readInquiryPrefill(): InquiryPrefill | null {
  try {
    const raw = sessionStorage.getItem(INQUIRY_PREFILL_KEY)
    if (!raw) return null
    sessionStorage.removeItem(INQUIRY_PREFILL_KEY)
    return JSON.parse(raw) as InquiryPrefill
  } catch {
    sessionStorage.removeItem(INQUIRY_PREFILL_KEY)
    return null
  }
}

export default function Reserve() {
  const { shareId } = useParams()
  const [share, setShare] = useState<ShareOption | null>(null)
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)
  const [prefill] = useState(readInquiryPrefill)

  useEffect(() => {
    if (!shareId) return
    // The param is either a specific share_option UUID (Animal page / admin link)
    // or a kind name (whole|half|quarter|eighth) — the contact-inquiry flow uses
    // kind. If it's a kind, pick any available share of that kind.
    const isKind = shareId in SHARE_PCT
    const query = isKind
      ? insforge.database
          .from('share_options')
          .select('*')
          .eq('kind', shareId)
          .eq('status', 'available')
          .limit(1)
          .maybeSingle()
      : insforge.database.from('share_options').select('*').eq('id', shareId).maybeSingle()
    query.then(async ({ data }) => {
      if (!data) {
        setLoading(false)
        return
      }
      const s = data as ShareOption
      setShare(s)
      const { data: animalData } = await insforge.database
        .from('animals').select('*').eq('id', s.animal_id).single()
      if (animalData) setAnimal(animalData as Animal)
      setLoading(false)
    })
  }, [shareId])

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="eyebrow">Loading</p>
        <p className="mt-4 text-earth-600">Gathering share details…</p>
      </div>
    )
  }
  if (!share || !animal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="eyebrow">Unavailable</p>
        <h1 className="mt-2 font-display text-4xl text-forest-800">That share isn't available.</h1>
        <p className="mt-4 text-earth-600">It may have just been claimed. Head back and pick another size.</p>
        <Link to="/shares" className="btn-secondary mt-6 inline-flex">Back to shares</Link>
      </div>
    )
  }

  const kindTitle = SHARE_KIND_TITLE[share.kind] ?? share.label ?? share.kind
  const blurb = SHARE_KIND_BLURB[share.kind]
  const heroImage = animal.hero_image_url ?? '/farm-media/pig-grazing.jpg'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/shares" className="text-sm font-medium text-copper-500 hover:underline">
        ← Back to shares
      </Link>
      <p className="eyebrow mt-8">Reserve</p>
      <h1 className="mt-3 font-display text-4xl text-forest-800 sm:text-5xl">{kindTitle}</h1>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-mud-600">
        <span>{animal.breed}</span>
        <span>·</span>
        <span>
          {SHARE_PRICE_RANGE[share.kind] ?? priceRange(share.est_total_low_cents, share.est_total_high_cents)}
        </span>
        <span>·</span>
        <span>Deposit {formatCents(share.deposit_cents)}</span>
      </div>

      <div className="card mt-6 grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
        <img
          src={heroImage}
          alt="Pasture-raised Gloucestershire Old Spots"
          className="h-28 w-full rounded-lg border border-sage-700/25 object-cover shadow-sketch sm:h-32"
        />
        <div>
          {blurb && (
            <p className="font-display text-xl">{blurb.meat}</p>
          )}
          {blurb && (
            <p className="text-sm text-mud-600">{blurb.freezer}</p>
          )}
          <p className="mt-2 text-sm">
            <Link to="/about" className="font-semibold text-blush-500 hover:underline">
              How it works <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </div>

      <section className="card mt-8 bg-cream-50">
        <h2 className="font-display text-2xl">What's included</h2>
        <p className="mt-1 text-sm text-mud-700">
          Every share is a thoughtfully curated assortment — bacon, ham, chops, tenderloin,
          roasts, ribs, bratwurst, breakfast sausage, and ground pork. These are the cuts we
          expect to include, but because these are real animals, the exact cuts and quantities
          vary slightly from share to share. Anything you definitely do or don't want? Let us
          know in the notes below.
        </p>
      </section>

      <section className="card mt-8 bg-cream-50">
        <h2 className="font-display text-2xl">What happens next</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mud-700">
          <li>We email you a reservation confirmation right away — nothing to sign.</li>
          <li>You pay the deposit to hold the share — it's credited toward your final price.</li>
          <li>We raise and process your pig at a USDA-inspected facility, then confirm your flat final price once the processing weights are known.</li>
          <li>When it's ready, you pick it up from the farm and pay the balance in one bill to us.</li>
        </ol>
      </section>

      <section className="card mt-8">
        <ReservationForm share={share} animal={animal} prefill={prefill} />
      </section>
    </div>
  )
}
