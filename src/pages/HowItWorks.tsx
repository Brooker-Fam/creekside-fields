import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WhimsyDivider } from '../components/site/Whimsy'

/**
 * The full "How it works" page — the same numbered-step treatment as the
 * home page's overview, expanded into a readable column with fuller
 * explanations of each step.
 */
const STEPS: ReadonlyArray<readonly [string, string, readonly string[]]> = [
  [
    '1',
    'Reserve your share',
    [
      'Pick the share size that fits your household — a quarter, half, or whole pig.',
      'Place a deposit to reserve your share of the pig.',
      'The deposit is credited toward your final total price.',
    ],
  ],
  [
    '2',
    'We raise and process',
    [
      'Your pork comes from our Gloucestershire Old Spot pigs, pasture-raised slowly with fresh air, daily care, and room to root and roam.',
      'When they finish, we bring them to our USDA-certified processor, where your share is cut, wrapped, and prepared with no added nitrates.',
    ],
  ],
  [
    '3',
    'We confirm your price',
    [
      'Because every pig finishes at a slightly different weight, your final price will be set once processing is complete.',
      'We estimate the best we can up front, then reach out with your confirmed price once we hear from the processor.',
      'The final price is based on the actual weight of the meat and the cuts included.',
      'Your deposit is credited toward it, and the balance is due at pickup.',
    ],
  ],
  [
    '4',
    'Pick up your pork',
    [
      'When your share is ready, you’ll pick it up from our farm in Greenwich, NY. We’ll text you to set up a time.',
      'Bring a cooler or a few boxes, take your pork home, and fill your freezer.',
    ],
  ],
]

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
          From pasture to pickup
        </h1>
      </section>

      <div style={{ marginTop: 40 }}>
        <WhimsyDivider />
      </div>

      {/* ---------- steps ---------- */}
      <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '48px 24px 88px' }}>
        <ol className="mx-auto grid list-none gap-14 p-0" style={{ maxWidth: '42rem' }}>
          {STEPS.map(([n, title, lines]) => (
            <li key={n} className="flex flex-col items-center text-center">
              <div className="numeral">{n}</div>
              <h2 className="mt-5 font-display text-[1.5rem] text-forest-800">{title}</h2>
              <div className="mt-3 space-y-2.5">
                {lines.map((line) => (
                  <p key={line} className="text-[1.0625rem] leading-[1.72] text-earth-600">
                    {line}
                  </p>
                ))}
              </div>
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
