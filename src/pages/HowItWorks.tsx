import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WhimsyDivider } from '../components/site/Whimsy'

/**
 * The full "How it works" page — the same numbered-step treatment as the
 * home page's overview, expanded into a readable column with fuller
 * explanations of each step.
 */
const STEPS = [
  [
    '1',
    'Reserve your share',
    'Pick the share size that fits your household — a quarter, half, or whole — and place a deposit to hold it for the season. The deposit secures your spot and is credited toward your final total. Once you’ve reserved, you’re on the list, and we’ll keep you posted from here all the way to pickup.',
  ],
  [
    '2',
    'We raise and process',
    'Your pork comes from our Gloucestershire Old Spot pigs, raised slowly over the course of more than a year — pasture, fresh air, daily care, and room to root and roam. When they finish, we bring them to Eagle Bridge Custom Meat, our USDA-certified processor, where your share is cut, wrapped, and prepared with no added nitrates on any cured or smoked product.',
  ],
  [
    '3',
    'We confirm your price',
    'Because every pig finishes at a slightly different weight, your final price is set once processing is complete. We share an estimated range up front, then reach out with your confirmed flat price — based on the actual weight of the meat and the cuts included. Your deposit is credited toward it, and the balance is due at pickup.',
  ],
  [
    '4',
    'Pick up your pork',
    'When your share is ready, you’ll pick it up from us right here at the farm in Greenwich, NY — we’ll text you to set up a time. Bring a cooler or a few boxes, take your pork home, and fill your freezer. A quarter fits a freezer drawer or small chest, a half fills an upright, and a whole pig share fills a chest freezer.',
  ],
] as const

export default function HowItWorks() {
  useEffect(() => {
    document.title = 'How it works · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- header ---------- */}
      <section
        style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '76px 24px 0', textAlign: 'center' }}
      >
        <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
          How it works
        </p>
        <h1
          className="fairy-sparkle mt-4 inline-block font-display leading-[1.12] text-forest-800"
          style={{ fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
        >
          From pasture to pickup.
        </h1>
        <p
          className="mx-auto text-earth-600"
          style={{ marginTop: 18, maxWidth: '40rem', fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
        >
          Buying a pig share is simpler than it sounds. Here is the whole path, step by step.
        </p>
      </section>

      <div style={{ marginTop: 40 }}>
        <WhimsyDivider />
      </div>

      {/* ---------- steps ---------- */}
      <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '48px 24px 88px' }}>
        <ol className="mx-auto grid list-none gap-14 p-0" style={{ maxWidth: '42rem' }}>
          {STEPS.map(([n, title, body]) => (
            <li key={n} className="flex flex-col items-center text-center">
              <div className="numeral">{n}</div>
              <h2 className="mt-5 font-display text-[1.5rem] text-forest-800">{title}</h2>
              <p className="mt-3 text-[1.0625rem] leading-[1.72] text-earth-600">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- closing cta ---------- */}
      <section
        style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 24px 96px', textAlign: 'center' }}
      >
        <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
          Reserve your share
        </p>
        <h2
          className="mt-4 font-display leading-[1.16] text-forest-800"
          style={{ fontSize: 'clamp(1.8rem, 1.3rem + 2vw, 2.4rem)' }}
        >
          Ready to choose your share?
        </h2>
        <div className="mt-8 flex justify-center">
          <Link to="/shares" className="btn-primary">
            View pig shares
          </Link>
        </div>
      </section>
    </div>
  )
}
