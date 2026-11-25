import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import QuestionsLine from '../components/site/QuestionsLine'
import { WORK_STEPS, FAQS } from '../content/homeCopy'
import { SHARE_TIERS, PORK_CUTS } from '../content/sharesCopy'
import { BIRDS } from '../content/poultryCopy'
import { scrollToSection } from '../lib/scroll'

export default function Home() {
  useEffect(() => {
    document.title = 'Creekside Fields — pasture-raised pork, Greenwich NY'
  }, [])

  return (
    <div>
      <Hero />
      <PriceList />
      <FamilyNote />

      {/* How it works */}
      <section id="how" style={tint('--sage-100', 55)}>
        <div style={{ ...CONTAINER, padding: '80px 24px' }}>
          <h2 className="text-center font-display leading-[1.14] text-forest-800" style={{ fontSize: H2_SIZE }}>
            How it works
          </h2>
          <ol className="mx-auto mt-12 grid list-none gap-x-10 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-4" style={{ maxWidth: '64rem' }}>
            {WORK_STEPS.map(([n, title, body]) => (
              <li key={n}>
                <span className="numeral" aria-hidden>
                  {n}.
                </span>
                <h3 className="mt-2 font-display text-[1.35rem] text-forest-800">{title}</h3>
                <p className="mt-2 text-[1.0625rem] leading-[1.65] text-earth-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...CONTAINER, maxWidth: '46rem' }}>
        <h2 className="font-display leading-[1.14] text-forest-800" style={{ fontSize: H2_SIZE }}>
          Questions
        </h2>
        <div style={{ marginTop: 28, borderTop: '1px solid var(--border)' }}>
          {FAQS.map(([q, a]) => (
            <Faq key={q} q={q} a={a} />
          ))}
        </div>
        <div style={{ marginTop: 44 }}>
          <QuestionsLine />
        </div>
      </section>
    </div>
  )
}

/* ---------- layout helpers ---------- */

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container)',
  margin: '0 auto',
  padding: '88px 24px',
}

const H2_SIZE = 'clamp(2rem, 1.4rem + 2.4vw, 2.6rem)'

function tint(token: string, pct: number): CSSProperties {
  return {
    background: `color-mix(in srgb, var(${token}) ${pct}%, transparent)`,
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  }
}

/* ---------- hero: a title page ---------- */

function Hero() {
  return (
    <section style={{ maxWidth: '68rem', margin: '0 auto', padding: '56px 24px 32px' }}>
      <div className="mx-auto text-center" style={{ maxWidth: '46rem' }}>
        <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
          Greenwich, New York
        </p>
        <h1
          className="mt-4 text-balance font-display text-forest-800"
          style={{ fontSize: 'clamp(2.6rem, 1.6rem + 4vw, 4.5rem)', lineHeight: 1.04 }}
        >
          Stock your freezer with heritage pork
        </h1>
        <p
          className="mx-auto font-accent italic text-earth-600"
          style={{ marginTop: 20, maxWidth: '34rem', fontSize: '1.3rem', lineHeight: 1.55 }}
        >
          Our Gloucestershire Old Spots grew up on pasture here in Greenwich, and we didn’t rush them.
        </p>
      </div>

      <figure className="plate mx-auto" style={{ maxWidth: 1040, marginTop: 40 }}>
        <img
          className="plate-img"
          src="/farm-media/pig-grazing.jpg"
          srcSet="/farm-media/pig-grazing-800.jpg 800w, /farm-media/pig-grazing.jpg 1600w"
          sizes="(max-width: 1088px) calc(100vw - 74px), 1014px"
          fetchPriority="high"
          alt="A big spotted Gloucestershire Old Spot pig grazing on pasture under a blue sky"
          style={{ aspectRatio: '16 / 9' }}
        />
        <figcaption className="plate-cap">One of our Old Spots out on pasture</figcaption>
      </figure>

      <div className="mx-auto mt-10 text-center" style={{ maxWidth: '40rem' }}>
        <p className="flex items-baseline justify-center gap-2.5">
          <span className="font-display leading-none text-forest-800" style={{ fontSize: '2.8rem' }}>
            $10
          </span>
          <span className="text-earth-600" style={{ fontSize: '1.2rem' }}>
            a pound for pig shares
          </span>
        </p>
        <p className="mt-2 text-[1.0625rem] text-earth-600">
          Cuts by the pack, too, and whole geese and ducks. All ready now.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#price-list" className="btn-primary" onClick={scrollToSection}>
            See the price list
          </a>
          <a href="#how" className="btn-secondary" onClick={scrollToSection}>
            How it works
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- the price list, like an old seed catalog ---------- */

function CatalogRow({ name, sub, price }: { name: string; sub?: string; price: string }) {
  return (
    <li className="catalog-row">
      <span className="catalog-name">
        {name}
        {sub && <span className="catalog-sub">{sub}</span>}
      </span>
      <span className="catalog-leader" aria-hidden />
      <span className="catalog-price">{price}</span>
    </li>
  )
}

function CatalogGroup({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="flex flex-wrap items-baseline gap-x-3 border-b border-linen-200 pb-2">
        <span className="font-smallcaps text-[1.15rem] tracking-[0.12em] text-copper-500">{title}</span>
        {note && <span className="font-accent text-[1rem] italic text-earth-500">{note}</span>}
      </h3>
      <ul className="mt-2 list-none p-0">{children}</ul>
    </div>
  )
}

function PriceList() {
  return (
    <section id="price-list" style={{ ...CONTAINER, padding: '72px 24px 88px' }}>
      <header className="mx-auto text-center" style={{ maxWidth: '40rem' }}>
        <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
          Price list
        </p>
        <h2 className="mt-4 font-display leading-[1.14] text-forest-800" style={{ fontSize: H2_SIZE }}>
          What we have now
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.7] text-earth-600">
          Everything is sold by the pound, so we weigh your order and send you the exact total. Pickup is at
          the farm.
        </p>
      </header>

      <div className="mx-auto mt-12" style={{ maxWidth: '40rem' }}>
        <CatalogGroup title="Pig shares" note="$10 a pound of take-home pork">
          {SHARE_TIERS.map((t) => (
            <CatalogRow key={t.kind} name={t.title} sub={`about ${t.takeHome}`} price={t.price} />
          ))}
        </CatalogGroup>

        <CatalogGroup title="Cuts by the pack" note="per pound">
          {PORK_CUTS.filter((c) => !c.soldOut).map((c) => (
            <CatalogRow key={c.id} name={c.title} price={`$${c.pricePerLb}`} />
          ))}
        </CatalogGroup>

        <CatalogGroup title="Geese & ducks" note="whole birds, per pound">
          {BIRDS.map((b) => (
            <CatalogRow key={b.kind} name={`Whole ${b.singular}`} price={`$${b.pricePerLb}`} />
          ))}
        </CatalogGroup>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/shares" className="btn-primary">
            Order pork
          </Link>
          <Link to="/geese-and-ducks" className="btn-secondary">
            Order geese &amp; ducks
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- a note from the family ---------- */

function FamilyNote() {
  return (
    <section style={{ ...CONTAINER, padding: '24px 24px 96px' }}>
      <div className="mx-auto grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]" style={{ maxWidth: '62rem' }}>
        <figure className="plate plate--tilt m-0 mx-auto w-full" style={{ maxWidth: 430 }}>
          <img
            className="plate-img"
            src="/farm-media/pigs/03-feeding.jpg"
            srcSet="/farm-media/pigs/03-feeding-750.jpg 750w, /farm-media/pigs/03-feeding.jpg 2000w"
            sizes="(max-width: 768px) calc(100vw - 74px), 404px"
            loading="lazy"
            alt="Feeding the young pigs by hand in the barn straw"
            style={{ aspectRatio: '4 / 3' }}
          />
          <figcaption className="plate-cap">Feeding time in the barn, their first spring</figcaption>
        </figure>

        <div>
          <h2 className="font-display leading-[1.14] text-forest-800" style={{ fontSize: H2_SIZE }}>
            Hello from the farm
          </h2>
          <div className="mt-5 space-y-4 text-[1.125rem] leading-[1.75] text-earth-700">
            <p>
              In March 2025 we brought three Gloucestershire Old Spot piglets home in cat carriers, in the
              back of our Subaru. They spent their first month in the barn, then moved out to pasture with
              our chickens, ducks and geese, watched over by our dogs, Bristol and Blanca.
            </p>
            <p>We raised them slowly, for more than a year. Now the pork is cut, wrapped and in our freezer.</p>
          </div>
          <p className="mt-5 font-accent text-[1.15rem] italic text-earth-600">The family at Creekside Fields</p>
          <Link to="/our-pigs" className="btn-secondary mt-1">
            Read the whole story
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- faq ---------- */

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const answerId = useId()
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={answerId}
        className="flex w-full items-center justify-between gap-4 border-0 bg-transparent text-left"
        style={{ padding: '18px 0' }}
      >
        <span className="font-display text-[1.3rem] text-forest-800">{q}</span>
        <span
          aria-hidden
          className="font-display text-2xl text-copper-500"
          style={{ transition: 'transform 200ms', transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      {open && (
        <p id={answerId} className="text-[1.0625rem] leading-[1.7] text-earth-600" style={{ margin: '0 0 22px' }}>
          {a}
        </p>
      )}
    </div>
  )
}
