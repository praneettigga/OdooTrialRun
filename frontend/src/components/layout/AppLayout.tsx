import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { Footer } from './Footer'

// Shared chrome for authenticated application pages. ProtectedRoute wraps this
// layout in the router, while RLS remains the server-side authorization layer.
export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

/** Standard page heading block, so every app page starts the same way. */
export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-canvas-soft pb-6">
      <div>
        <h1 className="font-display text-display-md">{title}</h1>
        {subtitle && <p className="mt-1 text-body">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
