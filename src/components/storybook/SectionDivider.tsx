type Variant = 'creek' | 'vines' | 'mushrooms' | 'sunflowers' | 'stars'

type Props = {
  variant?: Variant
  className?: string
}

export default function SectionDivider({ variant = 'creek', className = '' }: Props) {
  return (
    <div className={`px-4 py-2 ${className}`} aria-hidden>
      <svg
        className="mx-auto block w-full max-w-5xl text-sage-400/70"
        viewBox="0 0 800 48"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {variant === 'creek' && <Creek />}
        {variant === 'vines' && <Vines />}
        {variant === 'mushrooms' && <Mushrooms />}
        {variant === 'sunflowers' && <Sunflowers />}
        {variant === 'stars' && <Stars />}
      </svg>
    </div>
  )
}

function Creek() {
  return (
    <>
      <path
        d="M0 28 C80 18, 140 38, 220 26 S380 14, 480 28 S640 42, 800 24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-creek-300"
      />
      <path
        d="M0 32 C90 42, 160 22, 260 34 S420 46, 560 30 S700 18, 800 34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
        className="text-creek-500"
      />
      <circle cx="120" cy="22" r="2" className="fill-marigold-300 animate-twinkle" />
      <circle cx="410" cy="18" r="1.5" className="fill-marigold-300 animate-twinkle" style={{ animationDelay: '0.4s' }} />
      <circle cx="680" cy="26" r="2" className="fill-marigold-300 animate-twinkle" style={{ animationDelay: '0.9s' }} />
    </>
  )
}

function Vines() {
  return (
    <>
      <path
        d="M0 24 Q60 8, 120 24 T240 24 T360 24 T480 24 T600 24 T720 24 T800 24"
        stroke="currentColor"
        strokeWidth="2"
        className="text-sage-400"
      />
      {[80, 200, 340, 500, 640, 760].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={i % 2 === 0 ? 14 : 34}
          rx="10"
          ry="6"
          className="fill-sage-300/60"
          transform={`rotate(${i % 2 === 0 ? -18 : 18} ${x} ${i % 2 === 0 ? 14 : 34})`}
        />
      ))}
    </>
  )
}

function Mushrooms() {
  const spots = [
    { x: 100, h: 28 },
    { x: 250, h: 22 },
    { x: 400, h: 30 },
    { x: 550, h: 24 },
    { x: 700, h: 26 },
  ]
  return (
    <>
      {spots.map(({ x, h }) => (
        <g key={x}>
          <path
            d={`M${x - 14} ${48 - h} Q${x} ${48 - h - 16}, ${x + 14} ${48 - h}`}
            className="fill-blush-200 stroke-mud-600"
            strokeWidth="1.2"
          />
          <rect x={x - 5} y={48 - h} width="10" height={h - 4} rx="2" className="fill-cream-200 stroke-mud-600" strokeWidth="1" />
          <circle cx={x - 4} cy={48 - h - 6} r="1.5" className="fill-cream-50" />
          <circle cx={x + 5} cy={48 - h - 10} r="1.2" className="fill-cream-50" />
        </g>
      ))}
    </>
  )
}

function Sunflowers() {
  const flowers = [120, 320, 520, 700]
  return (
    <>
      <path d="M0 36 H800" stroke="currentColor" strokeWidth="1.5" className="text-sage-300/50" strokeDasharray="4 8" />
      {flowers.map((x) => (
        <g key={x}>
          <line x1={x} y1="36" x2={x} y2="18" stroke="currentColor" strokeWidth="2" className="text-sage-500" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx={x}
              cy="12"
              rx="5"
              ry="9"
              className="fill-marigold-100"
              transform={`rotate(${deg} ${x} 12)`}
            />
          ))}
          <circle cx={x} cy="12" r="5" className="fill-marigold-300" />
        </g>
      ))}
    </>
  )
}

function Stars() {
  const stars = [
    { x: 60, y: 20, s: 3 },
    { x: 180, y: 32, s: 2 },
    { x: 310, y: 14, s: 2.5 },
    { x: 450, y: 28, s: 2 },
    { x: 590, y: 16, s: 3 },
    { x: 720, y: 30, s: 2 },
  ]
  return (
    <>
      {stars.map(({ x, y, s }, i) => (
        <g key={x} className="animate-twinkle" style={{ animationDelay: `${i * 0.35}s` }}>
          <circle cx={x} cy={y} r={s} className="fill-marigold-300" />
          <circle cx={x} cy={y} r={s * 2.5} className="fill-marigold-300/20" />
        </g>
      ))}
      <path
        d="M0 38 C200 30, 400 42, 800 34"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
        className="text-indigo-400"
      />
    </>
  )
}
