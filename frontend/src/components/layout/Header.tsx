import { Link } from 'react-router-dom'
import { ButtonLink } from '../ui/Button'
import { Logo } from './Logo'

const NAV_LINK =
  'rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-ink/5'

const MENU_ITEM =
  'rounded-md px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-canvas-soft'

// Sticky and lime at every scroll position (not just over the hero band), so
// it stays legible once the page scrolls into the white/sage sections below.
//
// This is the landing page's marketing chrome. In-app navigation — cart,
// profile, My Listings — lives in AppHeader, which every other route uses.
const LINKS = [
  { href: '#listings', label: 'Browse' },
  { href: '#how', label: 'How it works' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={NAV_LINK}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ButtonLink to="/login" variant="ghost">
            Log in
          </ButtonLink>
          <ButtonLink to="/signup" variant="ink">
            Start selling
          </ButtonLink>
        </div>

        {/* Native disclosure — an accessible toggle with no JS state to keep. */}
        <details className="group relative ml-auto md:hidden">
          <summary
            className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl transition-colors duration-150 hover:bg-ink/5"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </summary>
          <div className="absolute right-0 z-20 mt-2 flex w-56 flex-col rounded-xl bg-canvas p-3 shadow-lg ring-1 ring-ink/10">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className={MENU_ITEM}>
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-canvas-soft" />
            <Link to="/login" className={MENU_ITEM}>
              Log in
            </Link>
            <ButtonLink to="/signup" variant="ink" className="mt-2">
              Start selling
            </ButtonLink>
          </div>
        </details>
      </div>
    </header>
  )
}
