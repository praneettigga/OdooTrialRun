import type { ReactNode } from 'react'

// The three states every page owes the reader (plan §10). Kept together so a
// page imports them in one line and has no excuse to skip one.

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-20 text-body">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-ink/20 border-t-ink"
      />
      <span className="text-sm font-semibold">{label}…</span>
    </div>
  )
}

/** Skeleton cards — used where a spinner would collapse the layout height. */
export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading listings" className="grid gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex gap-4 rounded-xl bg-canvas-soft p-4">
          <div className="size-24 shrink-0 rounded-lg bg-ink/5" />
          <div className="flex flex-1 flex-col gap-2 py-1">
            <div className="h-4 w-2/3 rounded bg-ink/5" />
            <div className="h-3 w-1/3 rounded bg-ink/5" />
            <div className="mt-auto h-5 w-24 rounded bg-ink/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-xl bg-canvas-soft px-6 py-16 text-center">
      <p className="font-display text-display-sm text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-body">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl bg-canvas-soft px-6 py-16 text-center">
      <p className="font-display text-display-sm text-ink">That did not load</p>
      <p className="mx-auto mt-2 max-w-sm text-body">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active"
        >
          Try again
        </button>
      )}
    </div>
  )
}
