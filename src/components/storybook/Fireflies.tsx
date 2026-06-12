type Props = {
  count?: number
  className?: string
}

const POSITIONS = [
  'left-[6%] top-24',
  'right-[14%] top-20 opacity-70',
  'bottom-16 right-[8%] opacity-80',
  'left-[22%] bottom-24 opacity-60',
  'right-[32%] top-1/3 opacity-50',
]

export default function Fireflies({ count = 3, className = '' }: Props) {
  return (
    <>
      {POSITIONS.slice(0, count).map((pos, i) => (
        <span
          key={pos}
          className={`firefly animate-firefly ${pos} ${className}`}
          style={{ animationDelay: `${i * 0.7}s` }}
          aria-hidden
        />
      ))}
    </>
  )
}
