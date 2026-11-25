import { useEffect } from 'react'
import OrderForm from '../components/site/OrderForm'
import QuestionsLine from '../components/site/QuestionsLine'
import { BIRDS, BIRD_GROUPS, BIRD_ORDER, BIRD_PHOTO } from '../content/poultryCopy'
import { scrollToSection } from '../lib/scroll'

export default function GeeseAndDucks() {
  useEffect(() => {
    document.title = 'Geese & ducks · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- the birds ---------- */}
      <section style={{ maxWidth: '68rem', margin: '0 auto', padding: '56px 24px 40px' }}>
        <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="story-eyebrow solo">Geese &amp; ducks</p>
            <h1
              className="mt-4 text-balance font-display text-forest-800"
              style={{ fontSize: 'clamp(2.5rem, 1.6rem + 3.4vw, 3.8rem)', lineHeight: 1.06 }}
            >
              Pasture-raised geese and ducks
            </h1>
            <p className="mt-5 text-[1.15rem] leading-[1.7] text-earth-700">
              Whole birds, sold by the pound. Ours spend their days out on pasture alongside the pigs,
              watched over by our dogs, Bristol and Blanca.
            </p>

            <ul className="mt-8 list-none p-0" style={{ maxWidth: '30rem' }}>
              {BIRDS.map((b) => (
                <li key={b.kind} className="py-2">
                  <div className="catalog-row" style={{ padding: 0 }}>
                    <span className="catalog-name">Whole {b.singular}</span>
                    <span className="catalog-leader" aria-hidden />
                    <span className="catalog-price">${b.pricePerLb} a pound</span>
                  </div>
                  <p className="mt-1 font-accent text-[1.05rem] italic text-earth-600">{b.blurb}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a href="#order" className="btn-primary" onClick={scrollToSection}>
                Order your birds
              </a>
            </div>
          </div>

          <figure className="plate plate--tilt-right m-0 mx-auto w-full" style={{ maxWidth: 420 }}>
            <img
              className="plate-img"
              src={BIRD_PHOTO.src}
              srcSet={`${BIRD_PHOTO.small} 600w, ${BIRD_PHOTO.src} 1200w`}
              sizes="(max-width: 768px) calc(100vw - 74px), 394px"
              alt={BIRD_PHOTO.alt}
              style={{ aspectRatio: '3 / 4' }}
            />
            <figcaption className="plate-cap">{BIRD_PHOTO.caption}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- order ---------- */}
      <section id="order" style={{ maxWidth: '50rem', margin: '0 auto', padding: '48px 24px 88px' }}>
        <header className="text-center">
          <h2
            className="font-display leading-[1.14] text-forest-800"
            style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.6rem)' }}
          >
            How many would you like?
          </h2>
          <p className="mt-3 text-[1.0625rem] leading-[1.7] text-earth-600">
            We’ll weigh your birds and email you the total.
          </p>
        </header>

        <div className="card mt-8 p-4 sm:p-8" style={{ background: 'var(--surface)' }}>
          <OrderForm groups={BIRD_GROUPS} copy={BIRD_ORDER} />
        </div>

        <div style={{ marginTop: 48 }}>
          <QuestionsLine />
        </div>
      </section>
    </div>
  )
}
