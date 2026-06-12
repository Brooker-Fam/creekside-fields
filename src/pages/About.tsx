import { Link } from 'react-router-dom'
import SectionHeader from '../components/site/SectionHeader'

const SECTIONS = [
  {
    title: 'The animals',
    body: 'Heritage Gloucestershire Old Spots, born February 2025. They came to us at eight weeks and have lived on pasture in Greenwich, NY ever since — slow-growing, with room to root, wander, and rest.',
  },
  {
    title: "What you're buying",
    body: 'A whole, half, or quarter share of one animal. Sign a bill of sale, place a deposit, and pick up your pork when it is ready — one bundled bill at the end, base processing included.',
  },
  {
    title: 'Share sizes',
    body: 'Roughly 195 lb cut and wrapped (whole), 95–100 lb (half), or 45–50 lb (quarter) at our current planning weight. Actual weight depends on hanging weight and cut choices.',
  },
  {
    title: 'Processing',
    body: 'Eagle Bridge Custom Meat & Smokehouse, about twelve miles from the farm. We will text reservation holders as soon as the slaughter date is set.',
  },
  {
    title: 'Pricing',
    body: 'Hanging weight × per-pound rate: $7.75/lb (whole), $8.50/lb (half), $9.25/lb (quarter). Base processing included. Specialty smoking, curing, links, or sausage may add pass-through costs.',
  },
  {
    title: 'Cut sheet',
    body: 'Reserve before processing and you choose your cuts. Reserve after and you receive our standard packages. Bacon, hams, chops, roasts, sausage, bones, lard, and optional offal.',
  },
  {
    title: 'Pickup',
    body: 'From the processor or the farm — whichever works for you. We will text when your share is ready.',
  },
] as const

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <SectionHeader
        eyebrow="Details"
        title="From pasture to freezer."
        lead="Everything you need to know about buying a pig share from Creekside Fields."
      />
      <div className="mt-14 space-y-10">
        {SECTIONS.map((section) => (
          <article key={section.title} className="border-t border-linen-200 pt-10 first:border-0 first:pt-0">
            <h2 className="font-display text-2xl text-forest-800">{section.title}</h2>
            <p className="mt-3 leading-relaxed text-earth-600">{section.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-14 flex flex-wrap gap-3">
        <Link to="/#pig-shares" className="btn-primary">
          See shares
        </Link>
        <Link to="/#reserve" className="btn-secondary">
          Reserve
        </Link>
      </div>
    </div>
  )
}
