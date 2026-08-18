import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConditionBadge, StatusBadge } from '../../components/ui/Badge'
import { ListingImage } from '../../components/ui/ListingImage'
import { EmptyState, ErrorState, Spinner } from '../../components/ui/states'
import { useCart } from '../../context/cartContext'
import { useAuth } from '../../context/authContext'
import { inr, listedLabel } from '../../format'
import { getListing, listListings, type Listing } from '../../services/products'
import { ListingTile } from '../marketplace/ListingViews'

export function ProductDetailPage() {
  const { id = '' } = useParams()
  const { add } = useCart()
  const { session } = useAuth()

  const [listing, setListing] = useState<Listing | null>(null)
  const [alsoFromSeller, setAlsoFromSeller] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setAdded(false)
    setAddError(null)

    getListing(id)
      .then(async (found) => {
        if (cancelled) return
        setListing(found)
        setLoading(false)
        if (found) {
          const siblings = await listListings({ sellerId: found.sellerId })
          if (!cancelled) setAlsoFromSeller(siblings.filter((l) => l.id !== found.id).slice(0, 3))
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Something went wrong.')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  async function handleAdd() {
    if (!listing) return
    setAdding(true)
    setAddError(null)
    try {
      await add(listing.id)
      setAdded(true)
    } catch (e: unknown) {
      setAddError(e instanceof Error ? e.message : 'Could not add this item to your cart.')
    }
    setAdding(false)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
        <Spinner label="Loading listing" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
        <EmptyState
          title="That listing is gone"
          body="It may have sold or been taken down by the seller. The marketplace has plenty more."
          action={
            <Link
              to="/marketplace"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active"
            >
              Back to marketplace
            </Link>
          }
        />
      </div>
    )
  }

  const isOwnListing = listing.sellerId === session?.user.id
  const isAvailable = listing.status === 'available'

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 py-8">
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-semibold text-body hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to marketplace
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <ListingImage
          category={listing.category}
          imageUrl={listing.imageUrl}
          alt={listing.title}
          className="aspect-[4/3] w-full rounded-xl"
          markSize="size-24"
        />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <ConditionBadge condition={listing.condition} />
            {!isAvailable && <StatusBadge status={listing.status} />}
          </div>

          <h1 className="mt-4 font-display text-display-md">{listing.title}</h1>
          <p className="mt-3 font-display text-display-md text-ink">{inr.format(listing.price)}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-canvas-soft py-5 text-sm">
            <div>
              <dt className="text-mute">Category</dt>
              <dd className="mt-1 font-semibold text-ink">{listing.category}</dd>
            </div>
            <div>
              <dt className="text-mute">Seller</dt>
              <dd className="mt-1 font-semibold text-ink">{listing.sellerName}</dd>
            </div>
            <div>
              <dt className="text-mute">Condition</dt>
              <dd className="mt-1 font-semibold text-ink">{listing.condition}</dd>
            </div>
            <div>
              <dt className="text-mute">Listed</dt>
              <dd className="mt-1 font-semibold text-ink">
                {listedLabel(listing.listedDaysAgo).replace('Listed ', '')}
              </dd>
            </div>
          </dl>

          <h2 className="mt-6 font-display text-display-sm">Description</h2>
          <p className="mt-2 whitespace-pre-line text-body">{listing.description}</p>

          <div className="mt-8">
            {isOwnListing ? (
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/my-listings/${listing.id}/edit`}
                  className="rounded-xl bg-ink px-7 py-3.5 text-base font-semibold text-primary transition-colors duration-150 hover:bg-ink-deep"
                >
                  Edit this listing
                </Link>
                <p className="text-sm text-body">This is your listing.</p>
              </div>
            ) : !isAvailable ? (
              <p className="rounded-xl bg-canvas-soft px-5 py-4 text-sm font-semibold text-body">
                This item is no longer available.
              </p>
            ) : added ? (
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/cart"
                  className="rounded-xl bg-ink px-7 py-3.5 text-base font-semibold text-primary transition-colors duration-150 hover:bg-ink-deep"
                >
                  Go to cart
                </Link>
                <p role="status" className="text-sm font-semibold text-positive-deep">
                  Added to your cart.
                </p>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={adding}
                  className="w-full rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-ink transition-colors duration-150 hover:bg-primary-active disabled:opacity-50 sm:w-auto"
                >
                  {adding ? 'Adding…' : 'Add to cart'}
                </button>
                {addError && (
                  <p role="alert" className="mt-3 text-sm font-medium text-negative-deep">
                    {addError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {alsoFromSeller.length > 0 && (
        <section className="mt-16 border-t border-canvas-soft pt-10">
          <h2 className="font-display text-display-sm">More from {listing.sellerName}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {alsoFromSeller.map((l) => (
              <ListingTile key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
