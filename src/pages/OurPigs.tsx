import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import QuestionsLine from '../components/site/QuestionsLine'
import { SEASONS } from '../content/homeCopy'

interface Photo {
  /** File name in /public/farm-media/pigs/, without ".jpg"; a "-750" copy sits beside it. */
  name: string
  /** Width of the full-size file in pixels. */
  width: number
  alt: string
  caption: string
  aspect: string
}

const GALLERY: Photo[] = [
  {
    name: '02-guardian',
    width: 1125,
    alt: 'Two young spotted pigs in the barn straw with a black dog watching them',
    caption: 'Getting to know one of our dogs',
    aspect: '3 / 4',
  },
  {
    name: '04-gentle-hands',
    width: 2000,
    alt: 'A man crouched in the barn straw, scratching a young spotted pig on the back',
    caption: 'Saying hello',
    aspect: '4 / 3',
  },
]

export default function OurPigs() {
  useEffect(() => {
    document.title = 'Our pigs · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- how they came home ---------- */}
      <section style={{ maxWidth: '68rem', margin: '0 auto', padding: '56px 24px 40px' }}>
        <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="story-eyebrow solo">Our pigs</p>
            <h1
              className="mt-4 text-balance font-display text-forest-800"
              style={{ fontSize: 'clamp(2.5rem, 1.6rem + 3.4vw, 3.8rem)', lineHeight: 1.06 }}
            >
              They came home in cat carriers
            </h1>
            <div className="mt-6 space-y-4 text-[1.125rem] leading-[1.75] text-earth-700">
              <p>
                In March 2025 we brought three little Gloucestershire Old Spots home in the back of our
                Subaru. They spent their first month in the warm barn, then moved out to pasture with our
                chickens, ducks and geese, watched over by our livestock guardian dogs, Bristol and Blanca.
              </p>
              <p>
                We raise our pigs slowly, for more than a year, mostly out on pasture. Old Spots are a gentle
                heritage breed, nicknamed the orchard pig of England. They do best with plenty of room to
                root and no hurry to grow.
              </p>
            </div>
          </div>

          <figure className="plate plate--tilt-right m-0 mx-auto w-full" style={{ maxWidth: 360 }}>
            <img
              className="plate-img"
              src="/farm-media/pigs/01-arrival-barn.jpg"
              srcSet="/farm-media/pigs/01-arrival-barn-750.jpg 750w, /farm-media/pigs/01-arrival-barn.jpg 1500w"
              sizes="(max-width: 768px) calc(100vw - 74px), 334px"
              alt="Two spotted Old Spot piglets curled up together in the barn straw"
              style={{ aspectRatio: '3 / 4' }}
            />
            <figcaption className="plate-cap">Home at last, in the barn straw</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- what they eat ---------- */}
      <section style={{ maxWidth: '68rem', margin: '0 auto', padding: '40px 24px' }}>
        <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <figure className="plate plate--tilt m-0 mx-auto w-full md:order-none" style={{ maxWidth: 460 }}>
            <img
              className="plate-img"
              src="/farm-media/pig-feast.jpg"
              loading="lazy"
              alt="A spotted pig sprawled across a blue tub of leftover pasta, happily eating"
              style={{ aspectRatio: '4 / 3' }}
            />
            <figcaption className="plate-cap">Cafeteria leftovers, much appreciated</figcaption>
          </figure>

          <div className="space-y-8">
            {SEASONS.map(([title, body]) => (
              <div key={title}>
                <h2 className="font-display text-[1.6rem] text-forest-800">{title}</h2>
                <p className="mt-2 text-[1.125rem] leading-[1.75] text-earth-700">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- a few more ---------- */}
      <section style={{ maxWidth: '60rem', margin: '0 auto', padding: '48px 24px 24px' }}>
        <div className="grid items-start gap-10 sm:grid-cols-2">
          {GALLERY.map((p, i) => (
            <figure key={p.name} className={`plate m-0 ${i % 2 ? 'plate--tilt-right sm:mt-16' : 'plate--tilt'}`}>
              <img
                className="plate-img"
                src={`/farm-media/pigs/${p.name}.jpg`}
                srcSet={`/farm-media/pigs/${p.name}-750.jpg 750w, /farm-media/pigs/${p.name}.jpg ${p.width}w`}
                sizes="(max-width: 640px) calc(100vw - 74px), 440px"
                loading="lazy"
                alt={p.alt}
                style={{ aspectRatio: p.aspect }}
              />
              <figcaption className="plate-cap">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section style={{ maxWidth: '44rem', margin: '0 auto', padding: '40px 24px 72px', textAlign: 'center' }}>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/shares" className="btn-primary">
            See the pork
          </Link>
          <Link to="/geese-and-ducks" className="btn-secondary">
            Geese &amp; ducks
          </Link>
        </div>
        <div style={{ marginTop: 40 }}>
          <QuestionsLine />
        </div>
      </section>
    </div>
  )
}
