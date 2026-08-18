import { useEffect, useRef, useState } from 'react'
import { Select } from '../../components/ui/Select'
import { CardSkeleton, EmptyState, ErrorState } from '../../components/ui/states'
import {
  CATEGORIES,
  CONDITIONS,
  listListings,
  type Category,
  type Condition,
  type Listing,
  type ListingSort,
} from '../../services/products'
import { ListingRow, ListingTile } from './ListingViews'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'title', label: 'Title A–Z' },
]

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-ink hover:bg-canvas-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-ink/30 accent-ink"
      />
      {label}
    </label>
  )
}

export function MarketplacePage() {
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState<ListingSort>('newest')
  const [view, setView] = useState<'list' | 'grid'>('list')

  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  // Typing fires overlapping requests; only the newest may write state.
  const requestId = useRef(0)

  useEffect(() => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)

    listListings({
      query,
      categories,
      conditions,
      minPrice: minPrice === '' ? undefined : Number(minPrice),
      maxPrice: maxPrice === '' ? undefined : Number(maxPrice),
      sort,
    })
      .then((rows) => {
        if (id !== requestId.current) return
        setListings(rows)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (id !== requestId.current) return
        setError(e instanceof Error ? e.message : 'Something went wrong.')
        setLoading(false)
      })
  }, [query, categories, conditions, minPrice, maxPrice, sort, reloadKey])

  const activeFilters =
    categories.length + conditions.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0)

  function clearAll() {
    setQuery('')
    setCategories([])
    setConditions([])
    setMinPrice('')
    setMaxPrice('')
  }

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-display-sm text-ink">Category</h2>
        <div className="mt-2 flex flex-col">
          {CATEGORIES.map((c) => (
            <CheckboxRow
              key={c}
              label={c}
              checked={categories.includes(c)}
              onChange={() => setCategories(toggle(categories, c))}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-display-sm text-ink">Condition</h2>
        <div className="mt-2 flex flex-col">
          {CONDITIONS.map((c) => (
            <CheckboxRow
              key={c}
              label={c}
              checked={conditions.includes(c)}
              onChange={() => setConditions(toggle(conditions, c))}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-display-sm text-ink">Price</h2>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            aria-label="Minimum price in rupees"
            className="w-full rounded-md border border-ink/25 bg-canvas px-3 py-2 text-sm text-ink placeholder:text-mute hover:border-ink/50"
          />
          <span aria-hidden="true" className="text-mute">
            –
          </span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            aria-label="Maximum price in rupees"
            className="w-full rounded-md border border-ink/25 bg-canvas px-3 py-2 text-sm text-ink placeholder:text-mute hover:border-ink/50"
          />
        </div>
      </div>

      {activeFilters > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="self-start rounded-xl px-3 py-2 text-sm font-semibold text-ink underline underline-offset-4 hover:bg-canvas-soft"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
      <div className="border-b border-canvas-soft pb-6">
        <h1 className="font-display text-display-md">Marketplace</h1>
        <p className="mt-1 text-body">
          Everything listed on EcoFinds, searchable and filterable.
        </p>
      </div>

      {/* Search spans the full width — it is the primary control here. */}
      <div className="relative mt-6">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-mute"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search listings by title"
          aria-label="Search listings by title"
          className="w-full rounded-xl border border-ink/25 bg-canvas py-3.5 pl-12 pr-4 text-base text-ink placeholder:text-mute hover:border-ink/50"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters — a disclosure on mobile, a sticky rail on desktop. */}
        <details className="rounded-xl bg-canvas-soft p-4 lg:hidden">
          <summary className="cursor-pointer list-none font-semibold text-ink">
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </summary>
          <div className="mt-4">{filterPanel}</div>
        </details>

        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">{filterPanel}</aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-body">
              {loading ? 'Searching…' : `${listings.length} ${listings.length === 1 ? 'result' : 'results'}`}
              {!loading && query.trim() !== '' && ` for “${query.trim()}”`}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-canvas-soft p-1" role="group" aria-label="View">
                {(['list', 'grid'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors duration-150 ${
                      view === v ? 'bg-canvas text-ink shadow-sm' : 'text-body hover:text-ink'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <Select
                label="Sort"
                hideLabel
                value={sort}
                onChange={(e) => setSort(e.target.value as ListingSort)}
                options={SORT_OPTIONS}
                className="w-auto"
              />
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <CardSkeleton count={4} />
            ) : error ? (
              <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
            ) : listings.length === 0 ? (
              <EmptyState
                title="No listings match that"
                body="Nothing in the catalogue fits this combination. Removing a filter or searching a broader word usually helps."
                action={
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : view === 'list' ? (
              <div className="flex flex-col gap-4">
                {listings.map((l) => (
                  <ListingRow key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((l) => (
                  <ListingTile key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
