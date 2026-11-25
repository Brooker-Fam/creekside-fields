import { useEffect } from 'react'
import { WhimsyDivider } from '../components/site/Whimsy'
import OrderForm from '../components/site/OrderForm'
import { BIRDS, BIRD_ITEMS, BIRD_ORDER, BIRD_PHOTO } from '../content/poultryCopy'
import { scrollToSection } from '../lib/scroll'

export default function GeeseAndDucks() {
  useEffect(() => {
    document.title = 'Geese & ducks · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- the birds ---------- */}
      <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '64px 24px 72px' }}>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="story-eyebrow solo">Geese &amp; ducks · Greenwich, New York</p>
            <h1
              className="fairy-sparkle mt-4 inline-block text-balance font-display leading-[1.14] text-forest-800"
              style={{ fontSize: 'clamp(2.2rem, 1.4rem + 2.6vw, 3rem)' }}
            >
              Pasture-raised geese and ducks.
            </h1>
            <p className="text-earth-600" style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}>
              Whole birds from our family farm, priced by the pound.
            </p>
            <p
              className="text-[1.0625rem] leading-[1.72] text-earth-600"
              style={{ marginTop: 16, maxWidth: '42rem' }}
            >
              Our geese and ducks spend their days out on pasture alongside our pigs, watched over by
              our livestock guardian dogs, Bristol and Blanca.
            </p>

            <div className="grid gap-4 sm:grid-cols-2" style={{ marginTop: 32 }}>
              {BIRDS.map((b) => (
                <div key={b.kind} className="card" style={{ background: 'var(--surface)' }}>
                  <p className="eyebrow">{b.title}</p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-display leading-none text-forest-800" style={{ fontSize: '2.4rem' }}>
                      ${b.pricePerLb}
                    </span>
                    <span className="text-earth-500" style={{ fontSize: 'var(--text-lead)' }}>
                      per pound
                    </span>
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-[1.65] text-earth-600">{b.blurb}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <a href="#order" className="btn-primary" onClick={scrollToSection}>
                Order your birds
              </a>
            </div>
          </div>

          <figure className="plate float-slow m-0 mx-auto w-full" style={{ maxWidth: 460 }}>
            <img
              className="plate-img"
              src={BIRD_PHOTO.src}
              alt={BIRD_PHOTO.alt}
              style={{ aspectRatio: '3 / 4', borderRadius: '10px 10px 3px 3px' }}
            />
            <figcaption className="plate-cap">{BIRD_PHOTO.caption}</figcaption>
          </figure>
        </div>
      </section>

      <WhimsyDivider />

      {/* ---------- order ---------- */}
      <section id="order" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '64px 24px 96px' }}>
        <header className="mx-auto text-center" style={{ maxWidth: '40rem' }}>
          <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
            Order
          </p>
          <h2
            className="fairy-sparkle mt-4 inline-block font-display leading-[1.14] text-forest-800"
            style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.5rem)' }}
          >
            Reserve your birds.
          </h2>
          <p className="text-earth-600" style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}>
            Choose how many geese and ducks you’d like. Each bird is priced by its weight, so we’ll
            confirm your total before you pick up at the farm.
          </p>
        </header>

        <div className="card mx-auto p-4 sm:p-6" style={{ marginTop: 40, maxWidth: '46rem', background: 'var(--surface)' }}>
          <OrderForm items={BIRD_ITEMS} copy={BIRD_ORDER} />
        </div>
      </section>
    </div>
  )
}
