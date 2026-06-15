import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { WhimsyDivider } from '../components/site/Whimsy'

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container)',
  margin: '0 auto',
  padding: '88px 24px',
}

interface PlatePhoto {
  src: string
  alt: string
  caption: string
  /** Shown if `src` hasn't been added yet; the plate hides entirely if this fails too. */
  fallback?: string
}

// Photos live in /public/farm-media/pigs/. Until those files are added, each
// plate quietly hides itself (or falls back to an existing photo) so the page
// never shows a broken image.
const HERO: PlatePhoto = {
  src: '/farm-media/pigs/01-arrival-barn.jpg',
  alt: 'Two spotted Gloucestershire Old Spot piglets curled up together in the barn straw',
  caption: 'Home at last — two months old, March 2025',
  fallback: '/farm-media/pig-grazing.jpg',
}

const STORY_PLATES: PlatePhoto[] = [
  {
    src: '/farm-media/pigs/02-guardian.jpg',
    alt: 'Young piglets in the barn with one of the farm dogs nearby',
    caption: 'Settling into the barn, a farm dog never far',
  },
  {
    src: '/farm-media/pigs/03-feeding.jpg',
    alt: 'Farmer crouching to feed the young pigs by hand in the straw',
    caption: 'Hand-fed and well-loved',
  },
  {
    src: '/farm-media/pigs/04-gentle-hands.jpg',
    alt: 'A piglet greeting a gentle hand at the edge of the pen',
    caption: 'Daily care, gentle hands',
  },
  {
    src: '/farm-media/pigs/05-pasture.jpg',
    alt: 'Three pigs at a feeder out on pasture with a guardian dog watching in the background',
    caption: 'Out on pasture, watched over by Bristol and Blanca',
    fallback: '/farm-media/pig-grazing.jpg',
  },
]

export default function OurPigs() {
  useEffect(() => {
    document.title = 'Our pigs · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- intro ---------- */}
      <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '72px 24px 56px' }}>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="story-eyebrow">Our pigs · Greenwich, New York</p>
            <h1
              className="fairy-sparkle mt-4 inline-block font-display leading-[1.12] text-forest-800"
              style={{ fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
            >
              How it started
            </h1>
            <p
              className="text-earth-600"
              style={{ marginTop: 20, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
            >
              It started with three sisters. In March 2025 we brought them home at two months old —
              riding in cat carriers in the back of our Subaru.
            </p>
            <p
              className="text-earth-600"
              style={{ marginTop: 16, fontSize: 'var(--text-base)', lineHeight: 1.72 }}
            >
              For their first month they stayed in the safety and warmth of the barn, until they
              were big enough to move out onto pasture — in the good company of our chickens, ducks,
              and geese, and watched over by our livestock guardian dogs, Bristol and Blanca.
            </p>
          </div>
          <StoryPlate photo={HERO} archTop />
        </div>
      </section>

      <WhimsyDivider />

      {/* ---------- the story in pictures ---------- */}
      <section style={CONTAINER}>
        <header style={{ maxWidth: '40rem', marginInline: 'auto', textAlign: 'center' }}>
          <p className="story-eyebrow">Their first season</p>
          <h2
            className="fairy-sparkle mt-4 inline-block font-display leading-[1.14] text-forest-800"
            style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.5rem)' }}
          >
            Raised with care, from the very first day
          </h2>
        </header>

        <div className="grid gap-8 sm:grid-cols-2" style={{ marginTop: 48 }}>
          {STORY_PLATES.map((photo) => (
            <StoryPlate key={photo.src} photo={photo} />
          ))}
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section style={{ maxWidth: '44rem', margin: '0 auto', padding: '0 24px 96px', textAlign: 'center' }}>
        <p
          className="font-accent italic leading-[1.5] text-forest-800"
          style={{ fontSize: 'clamp(1.4rem, 1rem + 1.4vw, 1.9rem)' }}
        >
          In October 2025 we processed one of the three sisters here on our own farm, for our
          family — the honest end of raising an animal well, from the first day to the last.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
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

/** A framed photo plate that gracefully falls back, then hides, if its file is missing. */
function StoryPlate({ photo, archTop = false }: { photo: PlatePhoto; archTop?: boolean }) {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'gone'>('primary')
  if (stage === 'gone') return null
  const src = stage === 'fallback' && photo.fallback ? photo.fallback : photo.src
  return (
    <figure className={`plate m-0${archTop ? ' float-slow' : ''}`}>
      <img
        className="plate-img"
        src={src}
        alt={photo.alt}
        style={{ aspectRatio: '4 / 3', ...(archTop ? { borderRadius: '10px 10px 3px 3px' } : null) }}
        onError={() =>
          setStage((s) => (s === 'primary' && photo.fallback ? 'fallback' : 'gone'))
        }
      />
      <figcaption className="plate-cap">{photo.caption}</figcaption>
    </figure>
  )
}
