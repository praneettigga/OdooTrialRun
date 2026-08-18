import { Link, NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { useCart } from '../../context/cartContext'

// Separate from Header.tsx on purpose. That one is the landing page's marketing
// chrome (Browse / How it works / Log in); this is in-app navigation. Keeping
// them apart also keeps this out of a file the landing lane is editing.
//
// Cart and profile appear here — unlike on the landing header — because there
// are now pages behind them. DESIGN.md: don't ship a dead control.
const LINKS = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/my-listings', label: 'My listings' },
  { to: '/purchases', label: 'Purchases' },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150',
    isActive ? 'bg-canvas-soft text-ink' : 'text-body hover:text-ink',
  ].join(' ')
}

export function AppHeader() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-30 border-b border-canvas-soft bg-canvas">
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-4 px-6 py-3">
        <Logo className="text-ink" />

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/sell"
            className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active sm:inline-flex"
          >
            Sell an item
          </Link>

          <Link
            to="/cart"
            className="relative flex size-10 items-center justify-center rounded-xl text-ink transition-colors duration-150 hover:bg-canvas-soft"
            aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? '' : 's'}` : 'Cart, empty'}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path
                d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.5a1 1 0 0 0 1-.8L20 7H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="20" r="1.4" fill="currentColor" />
              <circle cx="16.5" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-semibold text-primary">
                {count}
              </span>
            )}
          </Link>

          <Link
            to="/dashboard"
            className="flex size-10 items-center justify-center rounded-full bg-canvas-soft font-display text-sm text-ink transition-colors duration-150 hover:bg-primary-pale"
            aria-label="Your dashboard"
          >
            AM
          </Link>
        </div>
      </div>

      {/* Mobile nav — the same real routes, no invented ones. */}
      <nav
        className="flex gap-1 overflow-x-auto border-t border-canvas-soft px-4 py-2 md:hidden"
        aria-label="Main, mobile"
      >
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
        <NavLink to="/sell" className={linkClass}>
          Sell
        </NavLink>
      </nav>
    </header>
  )
}
