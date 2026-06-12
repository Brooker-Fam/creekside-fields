type Props = {
  className?: string
}

export default function FarmLandscape({ className = '' }: Props) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#edf3dd" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff9ee" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#abc17e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5f7845" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#sky)" />
      <ellipse cx="980" cy="120" rx="90" ry="90" fill="#f8e9b7" opacity="0.55" />
      <path d="M0 420 C200 360, 380 400, 560 370 S920 330, 1200 390 V600 H0 Z" fill="url(#hill)" />
      <path d="M0 460 C180 430, 360 470, 540 450 S900 420, 1200 460 V600 H0 Z" fill="#7f9b5d" opacity="0.12" />
      <path
        d="M0 500 C150 485, 300 515, 480 495 S780 470, 1200 505"
        stroke="#94c3c7"
        strokeWidth="4"
        fill="none"
        opacity="0.45"
        strokeLinecap="round"
      />
      <g opacity="0.55">
        <rect x="180" y="340" width="70" height="45" rx="4" fill="#f6ecd8" stroke="#3d3027" strokeWidth="1.5" />
        <path d="M175 340 L215 310 L255 340 Z" fill="#87483f" stroke="#3d3027" strokeWidth="1.2" />
        <rect x="320" y="355" width="55" height="35" rx="3" fill="#d9897f" stroke="#3d3027" strokeWidth="1.2" />
        <path d="M315 355 L347 330 L379 355 Z" fill="#995a43" stroke="#3d3027" strokeWidth="1" />
      </g>
      <g opacity="0.4">
        <ellipse cx="700" cy="430" rx="18" ry="12" fill="#f6ecd8" stroke="#3d3027" strokeWidth="1" />
        <ellipse cx="730" cy="438" rx="14" ry="10" fill="#f6ecd8" stroke="#3d3027" strokeWidth="1" />
        <circle cx="695" cy="425" r="2" fill="#3d3027" />
        <circle cx="735" cy="433" r="1.5" fill="#3d3027" />
      </g>
      <g className="animate-float" opacity="0.7">
        <circle cx="150" cy="280" r="2" fill="#e6b94e" />
        <circle cx="420" cy="250" r="1.5" fill="#e6b94e" />
        <circle cx="880" cy="290" r="2" fill="#e6b94e" />
      </g>
    </svg>
  )
}
