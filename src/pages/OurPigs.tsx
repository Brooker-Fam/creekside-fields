import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { WhimsyDivider } from '../components/site/Whimsy'
import { SEASONS } from '../content/homeCopy'

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container)',
  margin: '0 auto',
  padding: '64px 24px 88px',
}

interface PlatePhoto {
  src: string
  alt: string
  /** Shown if `src` is missing; the plate hides entirely if this fails too. */
  fallback?: string
}

// Photos live in /public/farm-media/pigs/.
const PHOTOS: PlatePhoto[] = [
  {
    src: '/farm-media/pigs/01-arrival-barn.jpg',
    alt: 'Two spotted Gloucestershire Old Spot piglets curled up together in the barn straw',
  },
  {
    src: '/farm-media/pigs/02-guardian.jpg',
    alt: 'The young piglets in the barn with one of the farm dogs nearby',
  },
  {
    src: '/farm-media/pigs/03-feeding.jpg',
    alt: 'Farmer crouching to feed the young pigs by hand in the straw',
  },
  {
    src: '/farm-media/pigs/04-gentle-hands.jpg',
    alt: 'A piglet greeting a gentle hand at the edge of the pen',
  },
  {
    src: '/farm-media/pigs/05-pasture.jpg',
    alt: 'Three pigs at a feeder out on pasture with a guardian dog watching in the background',
    fallback: '/farm-media/pig-grazing.jpg',
  },
]

export default function OurPigs() {
  useEffect(() => {
    document.title = 'Our pigs · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- our pigs: the breed ---------- */}
      <section style={{ ...CONTAINER, padding: '64px 24px 8px' }}>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="story-eyebrow solo">Our pigs · Greenwich, New York</p>
            <h1
              className="fairy-sparkle mt-4 inline-block font-display leading-[1.14] text-forest-800"
              style={{ fontSize: 'clamp(2.2rem, 1.4rem + 2.6vw, 3rem)' }}
            >
              The orchard pig of England.
            </h1>
            <p
              className="text-earth-600"
              style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
            >
              At Creekside Fields, our Gloucestershire Old Spot pigs are raised slowly and
              thoughtfully over the course of more than a year.
            </p>
            <p
              className="text-[1.0625rem] leading-[1.72] text-earth-600"
              style={{ marginTop: 16, maxWidth: '42rem' }}
            >
              As a heritage breed, Old Spots are known for their gentle temperament, excellent
              foraging instincts, and richly flavored pork. Often called the orchard pig of England,
              they thrive when given the room to root, graze, and explore — fresh air, sunshine, and
              a slower, natural pace of growth.
            </p>
          </div>
          <figure className="plate float-slow m-0">
            <img
              className="plate-img"
              src="/farm-media/pig-grazing.jpg"
              alt="Old Spot pig foraging at pasture"
              style={{ aspectRatio: '4 / 3', borderRadius: '10px 10px 3px 3px' }}
            />
          </figure>
        </div>

        <div className="grid gap-[22px] sm:grid-cols-2" style={{ marginTop: 48 }}>
          {SEASONS.map(([title, body]) => (
            <div key={title} className="card" style={{ background: 'var(--surface)' }}>
              <p className="story-eyebrow solo" style={{ fontSize: 'var(--text-sm)' }}>
                {title}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-earth-600">{body}</p>
            </div>
          ))}
        </div>

        <blockquote className="text-center" style={{ margin: '52px auto 0', maxWidth: '44rem' }}>
          <p
            className="font-accent italic leading-[1.5] text-forest-800"
            style={{ fontSize: 'clamp(1.4rem, 1rem + 1.4vw, 1.9rem)' }}
          >
            The active life of a pasture-raised pig builds strong muscle and beautiful marbling,
            while a diverse diet and slow, heritage growth make pork that is tender, succulent, and
            deeply flavorful.
          </p>
          <p className="story-eyebrow solo mt-[22px] justify-center">
            Exceptional pork starts with exceptional care
          </p>
        </blockquote>
      </section>

      <WhimsyDivider />

      {/* ---------- how it started ---------- */}
      <section style={{ maxWidth: '44rem', margin: '0 auto', padding: '64px 24px 8px', textAlign: 'center' }}>
        <h2
          className="fairy-sparkle inline-block font-display leading-[1.14] text-forest-800"
          style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.5rem)' }}
        >
          How it started
        </h2>
        <p
          className="text-earth-600"
          style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
        >
          The story of our three little pigs began in March 2025, when we brought them home in cat
          carriers in the back of our Subaru.
        </p>
        <p
          className="mx-auto text-earth-600"
          style={{ marginTop: 16, maxWidth: '40rem', fontSize: 'var(--text-base)', lineHeight: 1.72 }}
        >
          For their first month they stayed in the safety and warmth of the barn, until they were
          big enough to move out onto pasture — in the good company of our chickens, ducks, and
          geese, watched over by our livestock guardian dogs, Bristol and Blanca.
        </p>
      </section>

      {/* ---------- photos ---------- */}
      <section style={CONTAINER}>
        <div className="mx-auto [column-gap:2rem] [columns:1] sm:[columns:2]" style={{ maxWidth: '60rem' }}>
          {PHOTOS.map((photo) => (
            <StoryPlate key={photo.src} photo={photo} />
          ))}
        </div>
      </section>

      {/* ---------- closing cta ---------- */}
      <section style={{ maxWidth: '44rem', margin: '0 auto', padding: '8px 24px 96px', textAlign: 'center' }}>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/shares" className="btn-primary">
            See our pork shares
          </Link>
          <Link to="/" className="btn-secondary">
            Back to the farm
          </Link>
        </div>
      </section>
    </div>
  )
}

/** A framed photo plate at the image's natural shape; falls back, then hides, if its file is missing. */
function StoryPlate({ photo }: { photo: PlatePhoto }) {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'gone'>('primary')
  if (stage === 'gone') return null
  const src = stage === 'fallback' && photo.fallback ? photo.fallback : photo.src
  return (
    <figure className="plate m-0 mb-8 break-inside-avoid">
      <img
        className="plate-img"
        src={src}
        alt={photo.alt}
        style={{ height: 'auto' }}
        onError={() => setStage((s) => (s === 'primary' && photo.fallback ? 'fallback' : 'gone'))}
      />
    </figure>
  )
}
