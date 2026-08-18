import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/ui/Badge'
import { ListingImage } from '../../components/ui/ListingImage'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/ui/states'
import { inr, listedLabel } from '../../format'
import {
  CURRENT_USER_ID,
  deleteListing,
  listListings,
  type Listing,
} from '../../services/products'

function ListingRow({
  listing,
  onDeleted,
}: {
  listing: Listing
  onDeleted: (id: string) => void
}) {
  // Inline confirm instead of window.confirm: a native dialog blocks the page
  // and cannot be styled, and this keeps the destructive step two decisions.
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      await deleteListing(listing.id)
      onDeleted(listing.id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not delete that listing.')
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-canvas p-4 ring-1 ring-ink/10 sm:flex-row sm:items-center sm:p-5">
      <Link to={`/product/${listing.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <ListingImage
          category={listing.category}
          imageUrl={listing.imageUrl}
          alt={listing.title}
          className="size-20 shrink-0 rounded-lg"
          markSize="size-7"
        />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink">{listing.title}</h3>
          <p className="mt-1 text-sm text-mute">
            {listing.category} · {listedLabel(listing.listedDaysAgo)}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-display text-lg text-ink">{inr.format(listing.price)}</span>
            <StatusBadge status={listing.status} />
          </div>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        {confirming ? (
          <>
            <span className="text-sm font-semibold text-ink">Delete it?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl bg-negative px-4 py-2 text-sm font-semibold text-canvas transition-colors duration-150 hover:bg-negative-deep disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas-soft"
            >
              Keep
            </button>
          </>
        ) : (
          <>
            <Link
              to={`/my-listings/${listing.id}/edit`}
              className="rounded-xl border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition-colors duration-150 hover:border-ink/50"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-negative-deep transition-colors duration-150 hover:bg-canvas-soft"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-negative-deep sm:w-full">
          {error}
        </p>
      )}
    </div>
  )
}

export function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // status 'any' so drafts and sold items show — this is the seller's own view.
    listListings({ sellerId: CURRENT_USER_ID, status: 'any' })
      .then((rows) => {
        if (cancelled) return
        setListings(rows)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Something went wrong.')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const handleDeleted = useCallback((id: string) => {
    setListings((rows) => rows.filter((r) => r.id !== id))
  }, [])

  const live = listings.filter((l) => l.status === 'available').length

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-canvas-soft pb-6">
        <div>
          <h1 className="font-display text-display-md">My listings</h1>
          <p className="mt-1 text-body">
            {loading
              ? 'Loading your listings…'
              : `${listings.length} total · ${live} live`}
          </p>
        </div>
        <Link
          to="/sell"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active"
        >
          + Add new listing
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <CardSkeleton count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : listings.length === 0 ? (
          <EmptyState
            title="Nothing listed yet"
            body="Anything you have stopped using can go here. A title, a category and a price is enough to start."
            action={
              <Link
                to="/sell"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active"
              >
                List your first item
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {listings.map((l) => (
              <ListingRow key={l.id} listing={l} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
