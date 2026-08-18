import { Link } from 'react-router-dom'
import { ButtonLink } from '../ui/Button'
import { Logo } from './Logo'

const MENU_ITEM =
  'rounded-md px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-canvas-soft'

// Sits transparent on the hero band, so it inherits ink from the band.
// Cart and profile from the wireframe are deliberately absent: there is no page
// behind either one yet, and DESIGN.md forbids shipping a dead control.
// Tracked in docs/TASKS.md.
const LINKS = [
  { href: '#listings', label: 'Browse' },
  { href: '#how', label: 'How it works' },
]

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-6 py-5">
      <Logo />

      <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-semibold underline-offset-4 hover:underline"
          >
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
          className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl hover:bg-ink/5"
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
        <div className="absolute right-0 z-20 mt-2 flex w-56 flex-col rounded-xl bg-canvas p-3 shadow-lg">
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
    </header>
  )
}
