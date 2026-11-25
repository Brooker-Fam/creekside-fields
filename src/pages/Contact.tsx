import { useEffect } from 'react'
import ContactForm from '../components/site/ContactForm'

const FARM_EMAIL = 'brookerhousehold@gmail.com'

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact · Creekside Fields'
  }, [])

  return (
    <section style={{ maxWidth: '46rem', margin: '0 auto', padding: '64px 24px 96px' }}>
      <header className="text-center">
        <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
          Contact
        </p>
        <h1
          className="fairy-sparkle mt-4 inline-block font-display leading-[1.12] text-forest-800"
          style={{ fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
        >
          Get in touch.
        </h1>
        <p
          className="mx-auto text-earth-600"
          style={{ marginTop: 18, maxWidth: '36rem', fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
        >
          Questions about pig shares, cuts, or geese and ducks? Send us a note — we read every message
          ourselves and will get back to you soon.
        </p>
      </header>

      <div className="card mx-auto p-4 sm:p-6" style={{ marginTop: 40, background: 'var(--surface)' }}>
        <ContactForm />
      </div>

      <div className="mt-10 grid gap-6 text-center sm:grid-cols-2 sm:text-left">
        <div>
          <h2 className="label">Email</h2>
          <a className="text-[1.0625rem] text-earth-600 underline hover:text-copper-600" href={`mailto:${FARM_EMAIL}`}>
            {FARM_EMAIL}
          </a>
        </div>
        <div>
          <h2 className="label">The farm</h2>
          <p className="text-[1.0625rem] leading-relaxed text-earth-600">
            49 Clarks Mills Rd
            <br />
            Greenwich, NY 12834
          </p>
          <p className="mt-1 text-[0.9375rem] text-earth-500">Pickup by arrangement — we’ll set a time with you.</p>
        </div>
      </div>
    </section>
  )
}
