import { useEffect, useMemo, useState } from 'react'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Button } from '../../components/ui/Button'
import RippleDistortion from '../../components/effects/RippleDistortion'
import { CATEGORIES, PRODUCTS, type Product } from '../../fixtures/products'
import { ProductCard } from './ProductCard'

type Sort = 'newest' | 'price-asc' | 'price-desc'
type ConditionFilter = 'all' | Product['condition']
type GroupBy = 'none' | 'category'

// A flat colour has nothing for the ripple to displace, so the hero gets a
// small inline lime gradient (brand tokens only) as the distortion source —
// no network fetch, no product photography implied. Rendered as a raster PNG
// (not an SVG data URI) since SVG-backed images are an unreliable WebGL
// texImage2D source across browsers.
function makeHeroTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 450
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const gradient = ctx.createRadialGradient(224, 81, 0, 224, 81, 720)
  gradient.addColorStop(0, '#cdffad')
  gradient.addColorStop(0.55, '#9fe870')
  gradient.addColorStop(1, '#c5edab')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png')
}

const HERO_TEXTURE = makeHeroTexture()

const SELECT =
  'appearance-none rounded-full border border-ink/15 bg-canvas py-2.5 pl-4 pr-9 text-sm ' +
  'font-semibold text-ink transition-colors duration-150 hover:border-ink/40 hover:bg-canvas-soft/60 ' +
  'bg-[image:var(--chevron)] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat'

const HOW_IT_WORKS = [
  {
    title: 'List what you have stopped using',
    body: 'A title, a category, a price and a photo. It takes about a minute, and the listing is live straight away.',
  },
  {
    title: 'Buyers find it by searching',
    body: 'Everything is browsable by keyword and category, so a thing sitting in your cupboard becomes findable.',
  },
  {
    title: 'It gets a second owner',
    body: 'The item keeps working for someone else, and nothing new had to be manufactured to replace it.',
  },
]

function itemLabel(n: number) {
  return n === 1 ? '1 item' : `${n} items`
}

export function LandingPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | (typeof CATEGORIES)[number]>('all')
  const [condition, setCondition] = useState<ConditionFilter>('all')
  const [sort, setSort] = useState<Sort>('newest')
  const [groupBy, setGroupBy] = useState<GroupBy>('none')
  const [rippleEnabled, setRippleEnabled] = useState(true)

  // Decorative only — respect prefers-reduced-motion per docs/DESIGN.md.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setRippleEnabled(!mq.matches)
    const handleChange = (e: MediaQueryListEvent) => setRippleEnabled(!e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = PRODUCTS.filter((p) => {
      // Round 1 searches listing titles by keyword.
      const matchesQuery = q === '' || p.title.toLowerCase().includes(q)
      const matchesCategory = category === 'all' || p.category === category
      const matchesCondition = condition === 'all' || p.condition === condition
      return matchesQuery && matchesCategory && matchesCondition
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return a.listedDaysAgo - b.listedDaysAgo
    })
  }, [query, category, condition, sort])

  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ label: null, items: results }]
    return CATEGORIES.map((c) => ({
      label: c as string | null,
      items: results.filter((p) => p.category === c),
    })).filter((g) => g.items.length > 0)
  }, [groupBy, results])

  const isFiltered = query.trim() !== '' || category !== 'all' || condition !== 'all'

  function clearFilters() {
    setQuery('')
    setCategory('all')
    setCondition('all')
  }

  return (
    <div className="min-h-svh bg-canvas">
      {/* Header lives outside the lime band so its sticky containing block is
          the whole page — otherwise it only sticks within the hero's height. */}
      <Header />

      {/* Hero band. Ink type and an ink CTA — never a lime button on lime. */}
      <div className="relative overflow-hidden bg-primary text-ink">
        {/* Decorative WebGL ripple over the lime field only — never intercepts
            clicks (pointer-events-none) and sits behind the real content. */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <RippleDistortion
            src={HERO_TEXTURE}
            enabled={rippleEnabled}
            trigger="hover"
            quality="medium"
            brushSize={110}
            strength={0.14}
            swirl={0.8}
            rings={3}
            spread={4}
            fade={3.5}
            spacing={18}
            dispersion={0}
            glint={0.18}
            tint="#163300"
            tintAmount={0.1}
            highlightColor="#ffffff"
            grayscale={false}
          />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-28 lg:pt-16">
          <div>
            <p className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-deep">
              Second-hand marketplace
            </p>
            <h1 className="mt-5 text-balance font-display text-display-xl uppercase">
              Buy it used.
              <br />
              Keep it useful.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-deep">
              Furniture, books, bikes and electronics listed by the people who already own them.
              Nothing here had to be made twice.
            </p>
          </div>

          {/* The search is the hero: it filters the grid below as you type, so the
              counter and the empty case are both real rather than decorative. */}
          <div className="rounded-xl bg-canvas p-6 shadow-xl shadow-ink/10 ring-1 ring-ink/5 sm:p-8">
            <label htmlFor="hero-search" className="font-display text-display-sm text-ink">
              Find something
            </label>
            <div className="relative mt-4">
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
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try desk, kadai, denim"
                className="w-full rounded-md border border-ink/15 bg-canvas py-3.5 pl-12 pr-4 text-base text-ink placeholder:text-mute transition-colors duration-150 hover:border-ink/40 focus:border-ink/60"
              />
            </div>

            <p aria-live="polite" className="mt-4 text-sm text-body">
              {results.length === 0 ? (
                <>
                  Nothing matches that yet. Try a broader word, or{' '}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-semibold text-ink underline underline-offset-4"
                  >
                    clear the search
                  </button>
                  .
                </>
              ) : (
                <>
                  <span className="font-semibold text-ink">{itemLabel(results.length)}</span> ready to
                  find a second owner.
                </>
              )}
            </p>

            <a
              href="#listings"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-ink px-7 py-3.5 text-base font-semibold text-primary transition-[background-color,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-ink-deep active:translate-y-0 active:scale-[0.97] sm:w-auto"
            >
              See listings
            </a>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section aria-label="Categories" className="mx-auto w-full max-w-[1200px] px-6 py-12">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            aria-pressed={category === 'all'}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ${
              category === 'all'
                ? 'bg-ink text-primary'
                : 'bg-canvas-soft text-ink hover:bg-primary-pale'
            }`}
          >
            All categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                category === c
                  ? 'bg-ink text-primary'
                  : 'bg-canvas-soft text-ink hover:bg-primary-pale'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-6 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-canvas-soft pb-6">
          <div>
            <h2 className="font-display text-display-md">Listings</h2>
            <p aria-live="polite" className="mt-1 text-sm text-body">
              {itemLabel(results.length)}
              {isFiltered && ` of ${PRODUCTS.length}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <label className="sr-only" htmlFor="sort">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className={SELECT}
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>

            <label className="sr-only" htmlFor="condition">
              Filter by condition
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as ConditionFilter)}
              className={SELECT}
            >
              <option value="all">Any condition</option>
              <option value="Like new">Like new</option>
              <option value="Good">Good</option>
              <option value="Well used">Well used</option>
            </select>

            <label className="sr-only" htmlFor="groupby">
              Group by
            </label>
            <select
              id="groupby"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className={SELECT}
            >
              <option value="none">No grouping</option>
              <option value="category">Group by category</option>
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-xl bg-canvas-soft px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-canvas text-ink/25">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="mt-5 font-display text-display-sm text-ink">No listings match those filters</p>
            <p className="mx-auto mt-2 max-w-sm text-body">
              Nothing in the catalogue fits that combination yet. Widening the search usually helps.
            </p>
            <Button onClick={clearFilters} className="mt-6">
              Clear filters
            </Button>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label ?? 'all'} className="mt-10">
              {group.label && (
                <h3 className="mb-4 font-display text-display-sm text-ink">
                  {group.label}{' '}
                  <span className="font-sans text-base font-normal text-mute">
                    {itemLabel(group.items.length)}
                  </span>
                </h3>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
                {group.items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* How it works */}
      <section id="how" className="bg-canvas-soft">
        <div className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-6 py-24">
          <h2 className="max-w-xl font-display text-display-md">
            One thing, two owners, half the manufacturing
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl bg-canvas p-6 ring-1 ring-ink/5 transition-shadow duration-200 hover:shadow-md"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-ink font-display text-base text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-display-sm text-ink">{step.title}</h3>
                <p className="mt-3 text-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
