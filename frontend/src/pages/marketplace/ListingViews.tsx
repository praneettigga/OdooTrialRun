import { Link } from 'react-router-dom'
import { ConditionBadge } from '../../components/ui/Badge'
import { ListingImage } from '../../components/ui/ListingImage'
import { inr, listedLabel } from '../../format'
import type { Listing } from '../../services/products'

export function ListingRow({ listing }: { listing: Listing }) {
  return (
    <Link
      to={`/product/${listing.id}`}
      className="flex gap-4 rounded-xl bg-canvas p-4 ring-1 ring-ink/10 transition-shadow duration-200 hover:shadow-md sm:gap-6 sm:p-5"
    >
      <ListingImage
        category={listing.category}
        imageUrl={listing.imageUrl}
        alt={listing.title}
        className="size-24 shrink-0 rounded-lg sm:size-32"
        markSize="size-8"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-semibold leading-snug text-ink">{listing.title}</h3>
        <p className="mt-1 text-sm text-mute">
          {listing.category} · {listing.sellerName} · {listedLabel(listing.listedDaysAgo)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-body">{listing.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
          <span className="font-display text-xl text-ink">{inr.format(listing.price)}</span>
          <ConditionBadge condition={listing.condition} />
        </div>
      </div>
    </Link>
  )
}

export function ListingTile({ listing }: { listing: Listing }) {
  return (
    <Link
      to={`/product/${listing.id}`}
      className="flex flex-col overflow-hidden rounded-xl bg-canvas ring-1 ring-ink/10 transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="relative">
        <ListingImage
          category={listing.category}
          imageUrl={listing.imageUrl}
          alt={listing.title}
          className="aspect-[4/3] w-full"
        />
        <span className="absolute left-3 top-3">
          <ConditionBadge condition={listing.condition} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-semibold leading-snug text-ink">{listing.title}</h3>
        <p className="text-sm text-mute">
          {listing.category} · {listing.sellerName}
        </p>
        <p className="mt-3 font-display text-xl text-ink">{inr.format(listing.price)}</p>
      </div>
    </Link>
  )
}
