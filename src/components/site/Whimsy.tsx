// Whimsy layer — ambient fireflies/sparkles and a storybook divider with
// sprig, toadstools, and a gnome. Enchanted-forest motifs that echo the
// hand-painted Creekside world mark. Ported from the design system UI kit.

function Sparkle({
  size = 9,
  delay = 0,
  className = '',
  color = '#c9a24b',
}: {
  size?: number
  delay?: number
  className?: string
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      className={className}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden
    >
      <path d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z" fill={color} />
    </svg>
  )
}

function Toadstool({ scale = 1, className = '' }: { scale?: number; className?: string }) {
  return (
    <svg
      width={18 * scale}
      height={22 * scale}
      viewBox="0 0 24 28"
      fill="none"
      className={className}
      style={{ transform: 'translateY(2px)' }}
      aria-hidden
    >
      <rect x="9" y="16" width="6" height="12" rx="2" fill="#d8c2b0" opacity="0.7" />
      <ellipse cx="12" cy="14" rx="12" ry="10" fill="#9b5a4a" opacity="0.58" />
      <circle cx="7" cy="10" r="1.5" fill="#faf7f2" opacity="0.8" />
      <circle cx="14" cy="8" r="1.2" fill="#faf7f2" opacity="0.8" />
      <circle cx="17" cy="12" r="1" fill="#faf7f2" opacity="0.7" />
    </svg>
  )
}

function Gnome({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="22"
      viewBox="0 0 14 22"
      fill="none"
      className={className}
      style={{ transform: 'translateY(1px)' }}
      aria-hidden
    >
      <polygon points="7,0 11,10 3,10" fill="#a65d3f" opacity="0.7" />
      <circle cx="7" cy="12" r="3.5" fill="#2f3d2a" opacity="0.55" />
      <ellipse cx="7" cy="18" rx="4.5" ry="4" fill="#2f3d2a" opacity="0.55" />
      <ellipse cx="7" cy="15" rx="3" ry="3.5" fill="#faf7f2" opacity="0.5" />
    </svg>
  )
}

export function WhimsyDivider() {
  return (
    <div className="whimsy-divider" aria-hidden>
      <span className="wd-line" />
      <Sparkle size={8} delay={0} className="wf-twinkle" />
      <Toadstool scale={0.85} />
      <Gnome className="float-slow" />
      <img className="wd-sprig float" src="/brand/ornament-sprig.svg" alt="" />
      <Toadstool />
      <Sparkle size={10} delay={0.7} className="wf-twinkle" />
      <span className="wd-line" />
    </div>
  )
}

// Ambient particle field — fixed behind content, gentle fireflies + sparkles.
const PARTICLES = [
  { top: '14%', left: '6%', t: 'spark', s: 11, d: 0 },
  { top: '24%', left: '90%', t: 'firefly', s: 7, d: 1.1 },
  { top: '38%', left: '3%', t: 'firefly', s: 6, d: 2.2 },
  { top: '52%', left: '95%', t: 'spark', s: 9, d: 0.6 },
  { top: '63%', left: '8%', t: 'spark', s: 8, d: 1.7 },
  { top: '72%', left: '93%', t: 'firefly', s: 7, d: 0.3 },
  { top: '12%', left: '46%', t: 'firefly', s: 5, d: 2.6 },
  { top: '84%', left: '40%', t: 'spark', s: 7, d: 1.3 },
  { top: '46%', left: '14%', t: 'firefly', s: 6, d: 3.1 },
  { top: '33%', left: '82%', t: 'spark', s: 8, d: 2.0 },
  { top: '90%', left: '70%', t: 'firefly', s: 6, d: 0.9 },
  { top: '6%', left: '74%', t: 'spark', s: 7, d: 1.9 },
] as const

export function SparkleField() {
  return (
    <div className="whimsy-field" aria-hidden>
      {PARTICLES.map((p, i) =>
        p.t === 'firefly' ? (
          <span
            key={i}
            className="wf-dot wf-firefly"
            style={{ top: p.top, left: p.left, width: p.s, height: p.s, animationDelay: `${p.d}s` }}
          />
        ) : (
          <span
            key={i}
            className="wf-spark wf-twinkle"
            style={{ top: p.top, left: p.left, animationDelay: `${p.d}s` }}
          >
            <Sparkle size={p.s} />
          </span>
        ),
      )}
    </div>
  )
}
