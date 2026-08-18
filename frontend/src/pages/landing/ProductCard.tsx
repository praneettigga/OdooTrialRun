import type { Category, Condition, Product } from '../../fixtures/products'

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

// Listings carry an image placeholder in Round 1, so the placeholder is a
// designed surface rather than a grey box: a category tint from the brand's own
// sage/lime ramp, watermarked with the EcoFinds loop.
const TINTS: Record<Category, string> = {
  Furniture: 'bg-primary-pale',
  Electronics: 'bg-canvas-soft',
  Books: 'bg-primary-neutral',
  Clothing: 'bg-primary-pale',
  Sports: 'bg-canvas-soft',
  Kitchen: 'bg-primary-neutral',
}

const CONDITION_STYLES: Record<Condition, string> = {
  'Like new': 'bg-ink text-primary',
  Good: 'bg-canvas text-ink',
  'Well used': 'bg-canvas text-body',
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-canvas ring-1 ring-ink/10 transition-shadow duration-200 hover:shadow-lg">
      <div className={`relative aspect-[4/3] ${TINTS[product.category]}`}>
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 m-auto size-16 text-ink/10"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4.5 12a7.5 7.5 0 0 1 12.3-5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M19.5 12a7.5 7.5 0 0 1-12.3 5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 2.5v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 21.5v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${CONDITION_STYLES[product.condition]}`}
        >
          {product.condition}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-semibold leading-snug text-ink">{product.title}</h3>
        <p className="text-sm text-mute">
          {product.category} · {product.seller}
        </p>
        <p className="mt-3 font-display text-xl text-ink">{inr.format(product.price)}</p>
      </div>
    </article>
  )
}
