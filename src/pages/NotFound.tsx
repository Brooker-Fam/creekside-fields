import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · Creekside Fields'
  }, [])

  return (
    <section style={{ maxWidth: '40rem', margin: '0 auto', padding: '96px 24px 120px', textAlign: 'center' }}>
      <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
        Page not found
      </p>
      <h1
        className="mt-4 font-display leading-[1.12] text-forest-800"
        style={{ fontSize: 'clamp(2.2rem, 1.5rem + 3vw, 3rem)' }}
      >
        This page wandered off
      </h1>
      <p className="mx-auto mt-4 text-earth-600" style={{ fontSize: 'var(--text-lead)', lineHeight: 1.7 }}>
        It might have moved. Everything we have is on one of these:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shares" className="btn-primary">
          Pork
        </Link>
        <Link to="/geese-and-ducks" className="btn-secondary">
          Geese &amp; ducks
        </Link>
        <Link to="/contact" className="btn-secondary">
          Say hello
        </Link>
      </div>
    </section>
  )
}
