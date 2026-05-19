type Props = { className?: string }

export default function Spots({ className = '' }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="#3f2c1d"
      aria-hidden
    >
      <ellipse cx="40" cy="50" rx="22" ry="16" />
      <ellipse cx="130" cy="40" rx="14" ry="11" />
      <ellipse cx="160" cy="110" rx="20" ry="15" />
      <ellipse cx="80" cy="140" rx="18" ry="13" />
      <ellipse cx="30" cy="170" rx="12" ry="9" />
      <ellipse cx="120" cy="170" rx="9" ry="7" />
    </svg>
  )
}
