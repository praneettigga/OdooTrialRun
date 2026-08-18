import type { Category } from '../../services/products'

// Round 1 listings carry an image placeholder, so the placeholder is designed
// rather than a grey box: a category tint from the brand's sage/lime ramp,
// watermarked with the EcoFinds loop. Renders the real image once one exists.
const TINTS: Record<Category, string> = {
  Furniture: 'bg-primary-pale',
  Electronics: 'bg-canvas-soft',
  Books: 'bg-primary-neutral',
  Clothing: 'bg-primary-pale',
  Sports: 'bg-canvas-soft',
  Kitchen: 'bg-primary-neutral',
}

export function ListingImage({
  category,
  imageUrl,
  alt,
  className = '',
  markSize = 'size-12',
}: {
  category: Category
  imageUrl: string | null
  alt: string
  className?: string
  markSize?: string
}) {
  if (imageUrl) {
    return <img src={imageUrl} alt={alt} className={`object-cover ${className}`} loading="lazy" />
  }

  return (
    <div className={`relative ${TINTS[category]} ${className}`} role="img" aria-label={`${alt} — no photo yet`}>
      <svg
        viewBox="0 0 24 24"
        className={`absolute inset-0 m-auto text-ink/10 ${markSize}`}
        fill="none"
        aria-hidden="true"
      >
        <path d="M4.5 12a7.5 7.5 0 0 1 12.3-5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M19.5 12a7.5 7.5 0 0 1-12.3 5.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 2.5v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 21.5v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
