// Whimsy layer — a botanical divider (sprig, leaves, acorns) and fireflies.
// Fireflies drift across the page only at night (dark theme, see .whimsy-field
// in index.css) and always in the dusk-colored footer. Colors come from theme
// variables so the ornaments stay visible in every theme.

function Leaf({ scale = 1, flip = false, className = '' }: { scale?: number; flip?: boolean; className?: string }) {
  return (
    <svg
      width={22 * scale}
      height={20 * scale}
      viewBox="0 0 26 22"
      fill="none"
      className={className}
      style={{ transform: flip ? 'translateY(1px) scaleX(-1)' : 'translateY(1px)' }}
      aria-hidden
    >
      <path d="M2 20 C 2 9 11 2 24 2 C 24 13 15 20 2 20 Z" fill="var(--sage-400)" opacity="0.75" />
      <path d="M2 20 C 9 13 16 7 24 2" stroke="var(--sage-500)" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
      <path d="M9 14 C 11 13 13 11 14 9" stroke="var(--sage-500)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M14 12 C 16 11 18 9 19 7" stroke="var(--sage-500)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

function Acorn({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      width={13 * scale}
      height={20 * scale}
      viewBox="0 0 16 22"
      fill="none"
      style={{ transform: 'translateY(2px)' }}
      aria-hidden
    >
      <path d="M8 1 L8 4" stroke="var(--acorn-cap)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M2.5 6 C 2.5 11 4.5 20 8 20 C 11.5 20 13.5 11 13.5 6 Z" fill="var(--acorn)" opacity="0.7" />
      <path
        d="M1.5 6 C 1.5 4 4 3 8 3 C 12 3 14.5 4 14.5 6 C 14.5 7.5 11.5 8.5 8 8.5 C 4.5 8.5 1.5 7.5 1.5 6 Z"
        fill="var(--acorn-cap)"
        opacity="0.75"
      />
    </svg>
  )
}

/** The farm's sprig ornament, drawn inline so it follows the theme. */
export function Sprig({ width = 30, className = '' }: { width?: number; className?: string }) {
  return (
    <svg width={width} height={(width * 64) / 60} viewBox="0 0 60 64" className={className} aria-hidden>
      <path d="M30 62 L30 17" fill="none" stroke="var(--acorn-cap)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M30 17 C 26 11 27 4 30 1 C 33 4 34 11 30 17 Z" fill="var(--sage-500)" />
      <path d="M30 50 C 22 49 15 44 11 37 C 19 37 27 42 30 50 Z" fill="var(--sage-400)" />
      <path d="M30 50 C 38 49 45 44 49 37 C 41 37 33 42 30 50 Z" fill="var(--sage-400)" />
      <path d="M30 40 C 23 39 17 35 13 29 C 20 29 27 33 30 40 Z" fill="var(--sage-400)" />
      <path d="M30 40 C 37 39 43 35 47 29 C 40 29 33 33 30 40 Z" fill="var(--sage-400)" />
      <path d="M30 31 C 25 30 20 27 17 22 C 22 22 27 25 30 31 Z" fill="var(--sage-300)" />
      <path d="M30 31 C 35 30 40 27 43 22 C 38 22 33 25 30 31 Z" fill="var(--sage-300)" />
    </svg>
  )
}

export function WhimsyDivider() {
  return (
    <div className="whimsy-divider" aria-hidden>
      <span className="wd-line" />
      <Acorn scale={0.85} />
      <Leaf scale={0.9} className="float-slow" />
      <Sprig className="wd-sprig float" />
      <Leaf scale={0.9} flip className="float-slow" />
      <Acorn scale={0.85} />
      <span className="wd-line" />
    </div>
  )
}

type Firefly = { top: string; left: string; size: number; delay: number }

const PAGE_FIREFLIES: Firefly[] = [
  { top: '24%', left: '90%', size: 7, delay: 1.1 },
  { top: '38%', left: '3%', size: 6, delay: 2.2 },
  { top: '72%', left: '93%', size: 7, delay: 0.3 },
  { top: '12%', left: '46%', size: 5, delay: 2.6 },
  { top: '46%', left: '14%', size: 6, delay: 3.1 },
  { top: '90%', left: '70%', size: 6, delay: 0.9 },
  { top: '58%', left: '6%', size: 5, delay: 1.6 },
]

const FOOTER_FIREFLIES: Firefly[] = [
  { top: '18%', left: '8%', size: 6, delay: 0.4 },
  { top: '62%', left: '22%', size: 5, delay: 1.9 },
  { top: '30%', left: '41%', size: 4, delay: 2.7 },
  { top: '74%', left: '57%', size: 6, delay: 0.9 },
  { top: '22%', left: '73%', size: 5, delay: 3.3 },
  { top: '58%', left: '88%', size: 6, delay: 1.3 },
  { top: '84%', left: '95%', size: 4, delay: 2.2 },
]

function Fireflies({ flies }: { flies: Firefly[] }) {
  return flies.map((f, i) => (
    <span
      key={i}
      className="wf-dot wf-firefly"
      style={{ top: f.top, left: f.left, width: f.size, height: f.size, animationDelay: `${f.delay}s` }}
    />
  ))
}

/** Fireflies drifting across the page — shown only in the dark theme. */
export function FireflyField() {
  return (
    <div className="whimsy-field" aria-hidden>
      <Fireflies flies={PAGE_FIREFLIES} />
    </div>
  )
}

/** A few fireflies inside the dusk-colored footer. */
export function FooterFireflies() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Fireflies flies={FOOTER_FIREFLIES} />
    </div>
  )
}
