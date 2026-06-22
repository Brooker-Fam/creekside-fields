import { Link } from 'react-router-dom'
import SectionHeader from '../components/site/SectionHeader'

const SECTIONS = [
  {
    title: 'The animals',
    body: 'Heritage Gloucestershire Old Spots, born February 2025. They came to us at eight weeks and have lived on pasture in Greenwich, NY ever since — slow-growing, with room to root, wander, and rest.',
  },
  {
    title: "What you're buying",
    body: 'A whole, half, or quarter pig share — literally a whole pig, or a fraction of one — delivered as a curated assortment of cuts. Sign a bill of sale, place a deposit, and pick up your pork when it is ready — one flat price for the share, processing included.',
  },
  {
    title: 'Share sizes',
    body: 'Roughly 273–308 lb of take-home pork (whole), 137–154 lb (half), or 68–77 lb (quarter). Final weight depends on the animal; we list estimated ranges and confirm once your pig is processed.',
  },
  {
    title: 'Processing',
    body: 'Eagle Bridge Custom Meat & Smokehouse, about twelve miles from the farm. Every cured and smoked product is prepared with no added nitrates. We will text reservation holders as soon as the pickup date is set.',
  },
  {
    title: 'Pricing',
    body: 'Each share is a flat price of $10 per pound, listed up front as an estimated range — about $680–$770 (quarter), $1,370–$1,540 (half), or $2,730–$3,080 (whole). We confirm your final price once your pig is processed, based on the actual weight of the meat and the cuts included.',
  },
  {
    title: "What's included",
    body: 'A thoughtfully curated assortment — bacon, ham, pork chops, tenderloin, roasts, ribs, bratwurst, breakfast sausage, and ground pork. These are the cuts we expect to include, but exact cuts and quantities vary slightly from animal to animal. We choose the assortment for you.',
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
        <Link to="/shares" className="btn-primary">
          See shares
        </Link>
        <Link to="/shares" className="btn-secondary">
          Reserve
        </Link>
      </div>
    </div>
  )
}
