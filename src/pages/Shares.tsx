import { useEffect, type CSSProperties } from 'react'
import { WhimsyDivider } from '../components/site/Whimsy'
import OrderForm from '../components/site/OrderForm'
import QuestionsLine from '../components/site/QuestionsLine'
import { SHARE_TIERS, SHARE_ITEMS, SHARE_ORDER, PORK_CUTS, PORK_ORDER } from '../content/sharesCopy'
import { scrollToSection } from '../lib/scroll'

export default function Shares() {
  useEffect(() => {
    document.title = 'Pasture-raised pork · Creekside Fields'
  }, [])

  return (
    <div>
      {/* ---------- header ---------- */}
      <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '76px 24px 0', textAlign: 'center' }}>
        <p className="story-eyebrow" style={{ display: 'flex', justifyContent: 'center' }}>
          Pasture-raised pork
        </p>
        <h1
          className="fairy-sparkle mt-4 inline-block text-balance font-display leading-[1.12] text-forest-800"
          style={{ fontSize: 'clamp(2.4rem, 1.5rem + 3.4vw, 3.4rem)' }}
        >
          By the share or by the cut.
        </h1>
        <p
          className="mx-auto text-earth-600"
          style={{ marginTop: 18, maxWidth: '40rem', fontSize: 'var(--text-lead)', lineHeight: 1.7 }}
        >
          Our pork is ready now — cut, wrapped, and in the freezer. Buy a quarter, half, or whole pig
          share, or just the cuts you want, and pick it up at our farm in Greenwich, NY.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#share-options" className="btn-primary" onClick={scrollToSection}>
            Pig shares
          </a>
          <a href="#cuts" className="btn-secondary" onClick={scrollToSection}>
            Individual cuts
          </a>
        </div>
      </section>

      <div style={{ marginTop: 40 }}>
        <WhimsyDivider />
      </div>

      {/* ---------- pig shares ---------- */}
      <section id="share-options" style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '48px 24px 88px' }}>
        <StoryHeader
          align="center"
          maxWidth="40rem"
          eyebrow="Pig shares"
          title="Choose your share size."
          lead="A whole pig, or a half or quarter of one, as a curated mix of cuts — chops, bacon, ham, sausage, a Boston butt roast, and more, with no added nitrates. $10 per pound of take-home pork; we weigh your share and give you the exact total."
        />

        <div className="mx-auto grid gap-4 sm:grid-cols-3" style={{ maxWidth: '58rem', marginTop: 40 }}>
          {SHARE_TIERS.map((t) => (
            <div key={t.kind} className="flex flex-col rounded-lg border border-linen-200 bg-surface p-6 shadow-card">
              <p className="eyebrow">{t.title}</p>
              <p className="mt-4 font-display text-[1.9rem] leading-none text-forest-800">{t.takeHome}</p>
              <p className="mt-1 text-[0.9375rem] text-earth-500">estimated take-home pork</p>
              <p className="mt-4 border-t border-linen-200 pt-4 font-display text-[1.3rem] text-forest-700">
                {t.price}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-[1.6] text-earth-600">{t.freezer}</p>
            </div>
          ))}
        </div>

        <div
          className="card mx-auto p-4 sm:p-6"
          style={{ marginTop: 32, maxWidth: '46rem', background: 'var(--surface)' }}
        >
          <OrderForm items={SHARE_ITEMS} copy={SHARE_ORDER} />
        </div>
      </section>

      {/* ---------- individual cuts ---------- */}
      <section id="cuts" style={tint('--sage-100', 60)}>
        <div style={CONTAINER}>
          <StoryHeader
            align="center"
            maxWidth="40rem"
            eyebrow="Individual cuts"
            title="Just the cuts you want."
            lead="Not ready for a whole share? Order individual cuts by the pack. Prices are per pound, so we’ll weigh your order and give you the exact total."
          />
          <div
            className="card mx-auto p-4 sm:p-6"
            style={{ marginTop: 40, maxWidth: '46rem', background: 'var(--surface)' }}
          >
            <OrderForm items={PORK_CUTS} copy={PORK_ORDER} />
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 24px 96px' }}>
        <QuestionsLine />
      </section>
    </div>
  )
}

/* ---------- layout helpers (design-system kit metrics) ---------- */

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container)',
  margin: '0 auto',
  padding: '88px 24px',
}

function tint(token: string, pct: number): CSSProperties {
  return {
    background: `color-mix(in srgb, var(${token}) ${pct}%, transparent)`,
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  }
}

function StoryHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
  maxWidth = '42rem',
}: {
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  maxWidth?: string
}) {
  return (
    <header style={{ maxWidth, ...(align === 'center' ? { marginInline: 'auto', textAlign: 'center' } : null) }}>
      <p
        className={`story-eyebrow${align === 'center' ? '' : ' solo'}`}
        style={align === 'center' ? { display: 'flex', justifyContent: 'center' } : undefined}
      >
        {eyebrow}
      </p>
      <h2
        className="fairy-sparkle mt-4 inline-block font-display leading-[1.14] text-forest-800"
        style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.5rem)' }}
      >
        {title}
      </h2>
      {lead && (
        <p className="text-earth-600" style={{ marginTop: 18, fontSize: 'var(--text-lead)', lineHeight: 1.7 }}>
          {lead}
        </p>
      )}
    </header>
  )
}
