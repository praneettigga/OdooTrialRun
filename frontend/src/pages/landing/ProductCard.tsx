import type { Category, Condition, Product } from '../../fixtures/products'

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

// Listings carry an image placeholder in Round 1, so the placeholder is a
// designed surface rather than a grey box: a two-stop gradient across the
// brand's own sage/lime ramp, watermarked with the EcoFinds loop.
const TINTS: Record<Category, string> = {
  Furniture: 'bg-gradient-to-br from-primary-pale to-canvas-soft',
  Electronics: 'bg-gradient-to-br from-canvas-soft to-canvas',
  Books: 'bg-gradient-to-br from-primary-neutral to-primary-pale',
  Clothing: 'bg-gradient-to-br from-primary-pale to-primary-neutral',
  Sports: 'bg-gradient-to-br from-canvas-soft to-primary-pale',
  Kitchen: 'bg-gradient-to-br from-primary-neutral to-canvas-soft',
}

const CONDITION_STYLES: Record<Condition, string> = {
  'Like new': 'bg-ink text-primary',
  Good: 'bg-canvas text-ink',
  'Well used': 'bg-canvas text-body',
}

function relativeTime(daysAgo: number) {
  if (daysAgo <= 0) return 'Listed today'
  if (daysAgo === 1) return 'Listed 1 day ago'
  return `Listed ${daysAgo} days ago`
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-canvas ring-1 ring-ink/10 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-ink/15">
      <div className={`relative aspect-[4/3] overflow-hidden ${TINTS[product.category]}`}>
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 m-auto size-16 text-ink/10 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4.5 12a7.5 7.5 0 0 1 12.3-5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M19.5 12a7.5 7.5 0 0 1-12.3 5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 2.5v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 21.5v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Grounds the badge and gives the placeholder a touch of depth. */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/5 to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${CONDITION_STYLES[product.condition]}`}
        >
          {product.condition}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="line-clamp-2 font-semibold leading-snug text-ink">{product.title}</h3>
        <p className="text-sm text-mute">
          {product.category} · {product.seller}
        </p>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="font-display text-xl text-ink">{inr.format(product.price)}</p>
          <p className="text-xs text-mute">{relativeTime(product.listedDaysAgo)}</p>
        </div>
      </div>
    </article>
  )
}
