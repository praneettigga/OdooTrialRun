import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/ui/states'
import { agoLabel, inr } from '../../format'
import { listOrders, type Order } from '../../services/orders'

export function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    listOrders()
      .then((rows) => {
        if (cancelled) return
        setOrders(rows)
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

  const itemCount = orders.reduce(
    (sum, order) => sum + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0),
    0,
  )
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
      <div className="border-b border-canvas-soft pb-6">
        <h1 className="font-display text-display-md">Previous purchases</h1>
        <p className="mt-1 text-body">
          {loading
            ? 'Loading your purchases…'
            : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} · ${itemCount} items · ${inr.format(totalSpent)} total`}
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <CardSkeleton count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="Nothing bought yet"
            body="Once you claim something from the marketplace, the order shows up here."
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
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <article key={order.id} className="overflow-hidden rounded-xl ring-1 ring-ink/10">
                <header className="flex flex-wrap items-center justify-between gap-3 bg-canvas-soft px-5 py-4">
                  <div>
                    <h2 className="font-semibold text-ink">Order {order.id}</h2>
                    <p className="mt-0.5 text-sm text-body">
                      Placed {agoLabel(order.placedDaysAgo)} ·{' '}
                      {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1
                        ? '1 item'
                        : `${order.items.reduce((sum, item) => sum + item.quantity, 0)} items`}
                    </p>
                  </div>
                  <span className="font-display text-xl text-ink">
                    {inr.format(order.totalAmount)}
                  </span>
                </header>

                <ul className="divide-y divide-canvas-soft bg-canvas">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                    >
                      <div className="min-w-0">
                        {/* Snapshots, not the live listing — so this still reads
                            correctly after a seller edits or removes the item. */}
                        <p className="font-semibold text-ink">{item.titleSnapshot}</p>
                        <p className="mt-0.5 text-sm text-mute">
                          {item.categorySnapshot}
                          {item.quantity > 1 && ` · Quantity ${item.quantity}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-ink">
                          {inr.format(item.priceSnapshot)}
                        </span>
                        {item.productId ? (
                          <Link
                            to={`/product/${item.productId}`}
                            className="rounded-xl border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition-colors duration-150 hover:border-ink/50"
                          >
                            View listing
                          </Link>
                        ) : (
                          <span className="text-sm text-mute">Listing removed</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
