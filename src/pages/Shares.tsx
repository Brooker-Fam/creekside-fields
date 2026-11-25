import { useEffect } from 'react'
import OrderForm from '../components/site/OrderForm'
import QuestionsLine from '../components/site/QuestionsLine'
import { PORK_GROUPS, PORK_ORDER } from '../content/sharesCopy'
import { scrollToSection } from '../lib/scroll'

export default function Shares() {
  useEffect(() => {
    document.title = 'Pasture-raised pork · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- intro ---------- */}
      <section style={{ maxWidth: '68rem', margin: '0 auto', padding: '56px 24px 16px' }}>
        <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="story-eyebrow solo">Pork</p>
            <h1
              className="mt-4 text-balance font-display text-forest-800"
              style={{ fontSize: 'clamp(2.5rem, 1.6rem + 3.4vw, 3.8rem)', lineHeight: 1.06 }}
            >
              By the share or by the cut
            </h1>
            <p className="mt-5 text-[1.15rem] leading-[1.7] text-earth-700">
              Our pork is ready now, cut, wrapped and in the freezer. It was processed at a USDA-inspected
              facility, and the bacon and ham have no added nitrates.
            </p>
            <p className="mt-3 text-[1.15rem] leading-[1.7] text-earth-700">
              Pick a share, a few cuts, or both. It’s all one order.
            </p>
            <p className="mt-5 flex flex-wrap gap-x-6">
              <a href="#share-options" className="btn-secondary" onClick={scrollToSection}>
                Pig shares
              </a>
              <a href="#cuts" className="btn-secondary" onClick={scrollToSection}>
                Individual cuts
              </a>
            </p>
          </div>

          <figure className="plate plate--tilt-right m-0 mx-auto w-full" style={{ maxWidth: 440 }}>
            <img
              className="plate-img"
              src="/farm-media/pigs/05-pasture.jpg"
              srcSet="/farm-media/pigs/05-pasture-750.jpg 750w, /farm-media/pigs/05-pasture.jpg 2000w"
              sizes="(max-width: 768px) calc(100vw - 74px), 414px"
              alt="Three spotted pigs eating at a feeder on pasture while a black dog sits and watches"
              style={{ aspectRatio: '4 / 3' }}
            />
            <figcaption className="plate-cap">Three of ours at the feeder, with a dog keeping watch</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- the order: shares and cuts together ---------- */}
      <section style={{ maxWidth: '50rem', margin: '0 auto', padding: '40px 24px 88px' }}>
        <div className="card p-4 sm:p-8" style={{ background: 'var(--surface)' }}>
          <OrderForm groups={PORK_GROUPS} copy={PORK_ORDER} />
        </div>
        <div style={{ marginTop: 48 }}>
          <QuestionsLine />
        </div>
      </section>
    </div>
  )
}
