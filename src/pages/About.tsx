import { Link } from 'react-router-dom'
import SectionIntro from '../components/storybook/SectionIntro'
import SectionDivider from '../components/storybook/SectionDivider'

const SECTIONS = [
  {
    title: 'The animals',
    body: 'Heritage Gloucestershire Old Spots, born February 2025. They came to us at about eight weeks old and have lived on our farm in Greenwich, NY ever since — a slow-growing pasture breed with room to root, wander, rest, and settle into the rhythms of the land.',
  },
  {
    title: "What you're actually buying",
    body: 'A whole (100%), half (50%), or quarter (25%) share. You sign a quick bill of sale and put down a deposit to hold the share. When the meat is ready, you pick it up and pay one bill to us — base processing fees already included.',
  },
  {
    title: 'The share size',
    body: 'A whole hog is roughly 195 lb of cut and wrapped meat at our current 300 lb hanging-weight planning assumption. A half is around 95–100 lb, and a quarter is around 45–50 lb. Actual take-home weight depends on hanging weight and cut choices.',
  },
  {
    title: 'Processing',
    body: "Slaughter and cut-and-wrap happen at Eagle Bridge Custom Meat & Smokehouse, about twelve miles from the farm. Slaughter date isn't locked in yet — we'll text reservation holders as soon as it is.",
  },
  {
    title: 'The price',
    body: 'Hanging weight of your share × per-pound rate. Whole hogs are priced at $7.75/lb hanging weight, halves at $8.50/lb, and quarters at $9.25/lb. The rate includes base processing using Eagle Bridge Custom Meat\'s current price sheet. Smoking, no-nitrate curing, links, hot dogs, and specialty sausage may add pass-through butcher costs.',
  },
  {
    title: 'The cut sheet',
    body: 'Bacon or fresh belly, smoked or fresh hams, bone-in chops or roasts, sausage flavors, soup bones, leaf lard, hocks, and optional offal. If you reserve before we send the pigs to the processor, you fill out a cut sheet and we pass it along. Reserve after that and your share comes as our standard pre-cut packages.',
  },
  {
    title: 'The pickup',
    body: "We'll text you when it's ready. You can grab it directly from the processor or pick it up from us at the farm — whichever's easier for you.",
  },
] as const

export default function About() {
  return (
    <div className="overflow-hidden">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <SectionIntro
          kicker="The full story"
          title="From our pasture to your freezer"
          body="Everything you might want to know about buying a pig share from Creekside Fields — written like a neighbor explaining it over the fence."
        />
        <div className="mt-12 space-y-8">
          {SECTIONS.map((section) => (
            <article key={section.title} className="card">
              <h2 className="font-display text-3xl text-sage-700">{section.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-mud-600">{section.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/#pig-shares" className="btn-primary">
            See the shares →
          </Link>
          <Link to="/#reserve" className="btn-secondary">
            Reserve a share
          </Link>
        </div>
      </section>
      <SectionDivider variant="creek" />
    </div>
  )
}
