import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ConditionBadge } from '../../components/ui/Badge'
import { ListingImage } from '../../components/ui/ListingImage'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/ui/states'
import { useCart } from '../../context/cartContext'
import { inr } from '../../format'
import { getCart, removeFromCart, setQuantity, type CartLine } from '../../services/cart'
import { placeOrder } from '../../services/orders'

function QuantityStepper({
  value,
  busy,
  max,
  onChange,
}: {
  value: number
  busy: boolean
  max: number
  onChange: (next: number) => void
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-ink/20">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={busy || value <= 1}
        aria-label="Reduce quantity"
        className="px-3 py-2 text-lg font-semibold text-ink hover:bg-canvas-soft disabled:opacity-40"
      >
        −
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={busy || value >= max}
        aria-label="Increase quantity"
        className="px-3 py-2 text-lg font-semibold text-ink hover:bg-canvas-soft disabled:opacity-40"
      >
        +
      </button>
    </div>
  )
}

export function CartPage() {
  const navigate = useNavigate()
  const { refresh } = useCart()

  const [lines, setLines] = useState<CartLine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [lineError, setLineError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setLines(await getCart())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load your cart.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load, reloadKey])

  async function changeQuantity(productId: string, next: number) {
    setBusyId(productId)
    setLineError(null)
    try {
      await setQuantity(productId, next)
      setLines(await getCart())
      await refresh()
    } catch (e: unknown) {
      setLineError(e instanceof Error ? e.message : 'Could not update this item.')
    }
    setBusyId(null)
  }

  async function remove(productId: string) {
    setBusyId(productId)
    setLineError(null)
    try {
      await removeFromCart(productId)
      setLines(await getCart())
      await refresh()
    } catch (e: unknown) {
      setLineError(e instanceof Error ? e.message : 'Could not remove this item.')
    }
    setBusyId(null)
  }

  async function handlePlaceOrder() {
    setPlacing(true)
    setOrderError(null)
    try {
      await placeOrder()
      await refresh()
      navigate('/purchases')
    } catch (e: unknown) {
      setOrderError(e instanceof Error ? e.message : 'Could not place that order.')
      setPlacing(false)
    }
  }

  const total = lines.reduce((sum, line) => sum + line.listing.price * line.quantity, 0)
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
      <div className="border-b border-canvas-soft pb-6">
        <h1 className="font-display text-display-md">Your cart</h1>
        <p className="mt-1 text-body">
          {loading ? 'Loading your cart…' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <CardSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : lines.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            body="Anything you add from the marketplace shows up here, ready to claim."
            action={
              <Link
                to="/marketplace"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active"
              >
                Browse the marketplace
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex min-w-0 flex-col gap-4">
              {lineError && (
                <p role="alert" className="text-sm font-medium text-negative-deep">
                  {lineError}
                </p>
              )}
              {lines.map(({ listing, quantity }) => (
                <div
                  key={listing.id}
                  className="flex flex-col gap-4 rounded-xl bg-canvas p-4 ring-1 ring-ink/10 sm:flex-row sm:items-center sm:p-5"
                >
                  <Link to={`/product/${listing.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                    <ListingImage
                      category={listing.category}
                      imageUrl={listing.imageUrl}
                      alt={listing.title}
                      className="size-20 shrink-0 rounded-lg"
                      markSize="size-7"
                    />
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-ink">{listing.title}</h2>
                      <p className="mt-1 text-sm text-mute">
                        {listing.category} · {listing.sellerName}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="font-display text-lg text-ink">
                          {inr.format(listing.price)}
                        </span>
                        <ConditionBadge condition={listing.condition} />
                      </div>
                    </div>
                  </Link>

                  <div className="flex shrink-0 items-center gap-3">
                    <QuantityStepper
                      value={quantity}
                      busy={busyId === listing.id}
                      max={listing.stockQuantity}
                      onChange={(next) => changeQuantity(listing.id, next)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(listing.id)}
                      disabled={busyId === listing.id}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-negative-deep hover:bg-canvas-soft disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="min-w-0 self-start rounded-xl bg-canvas-soft p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-display-sm">Summary</h2>
              <dl className="mt-4 flex flex-col gap-2 text-sm">
                {lines.map(({ listing, quantity }) => (
                  <div key={listing.id} className="flex justify-between gap-4">
                    <dt className="min-w-0 truncate text-body">
                      {listing.title}
                      {quantity > 1 && ` × ${quantity}`}
                    </dt>
                    <dd className="shrink-0 font-semibold text-ink">
                      {inr.format(listing.price * quantity)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-display text-display-sm text-ink">{inr.format(total)}</span>
              </div>

              {orderError && (
                <p role="alert" className="mt-4 text-sm font-medium text-negative-deep">
                  {orderError}
                </p>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="mt-6 w-full rounded-xl bg-ink px-7 py-3.5 text-base font-semibold text-primary transition-colors duration-150 hover:bg-ink-deep disabled:opacity-50"
              >
                {placing ? 'Placing order…' : 'Place order'}
              </button>
              <p className="mt-3 text-xs text-body">
                Round 1 has no payment step. Placing the order records the purchase and updates
                stock immediately.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
