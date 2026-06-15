// Whimsy layer — ambient fireflies/sparkles and a storybook divider with
// a botanical sprig, leaves, and acorns. Natural woodland motifs that echo
// the hand-painted Creekside world mark. Ported from the design system UI kit.

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

function Leaf({
  scale = 1,
  flip = false,
  className = '',
}: {
  scale?: number
  flip?: boolean
  className?: string
}) {
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
      <path d="M2 20 C 2 9 11 2 24 2 C 24 13 15 20 2 20 Z" fill="#8fa07a" opacity="0.7" />
      <path
        d="M2 20 C 9 13 16 7 24 2"
        stroke="#6b8058"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M9 14 C 11 13 13 11 14 9"
        stroke="#6b8058"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M14 12 C 16 11 18 9 19 7"
        stroke="#6b8058"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

function Acorn({ scale = 1, className = '' }: { scale?: number; className?: string }) {
  return (
    <svg
      width={13 * scale}
      height={20 * scale}
      viewBox="0 0 16 22"
      fill="none"
      className={className}
      style={{ transform: 'translateY(2px)' }}
      aria-hidden
    >
      <path d="M8 1 L8 4" stroke="#5c4e42" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M2.5 6 C 2.5 11 4.5 20 8 20 C 11.5 20 13.5 11 13.5 6 Z" fill="#b07f4e" opacity="0.62" />
      <path
        d="M1.5 6 C 1.5 4 4 3 8 3 C 12 3 14.5 4 14.5 6 C 14.5 7.5 11.5 8.5 8 8.5 C 4.5 8.5 1.5 7.5 1.5 6 Z"
        fill="#5c4e42"
        opacity="0.65"
      />
    </svg>
  )
}

export function WhimsyDivider() {
  return (
    <div className="whimsy-divider" aria-hidden>
      <span className="wd-line" />
      <Sparkle size={8} delay={0} className="wf-twinkle" />
      <Acorn scale={0.85} />
      <Leaf scale={0.9} className="float-slow" />
      <img className="wd-sprig float" src="/brand/ornament-sprig.svg" alt="" />
      <Leaf scale={0.9} flip className="float-slow" />
      <Acorn scale={0.85} />
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
