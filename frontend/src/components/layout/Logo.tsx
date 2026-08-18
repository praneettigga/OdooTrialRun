import { Link } from 'react-router-dom'

// The mark is a closed loop, not a leaf: EcoFinds is about circulation —
// a thing leaving one household and entering another.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 font-display text-xl tracking-tight ${className}`}
      aria-label="EcoFinds — home"
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path
          d="M4.5 12a7.5 7.5 0 0 1 12.3-5.8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M19.5 12a7.5 7.5 0 0 1-12.3 5.8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M17 2.5v4h-4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 21.5v-4h4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      EcoFinds
    </Link>
  )
}
