// Listing data. Stubbed against fixtures at the signature the real Supabase
// implementation will use, so pages never change when it lands (plan §8).
// Replace the bodies, keep the exports.

import {
  CATEGORIES,
  CONDITIONS,
  CURRENT_USER_ID,
  LISTINGS,
  type Category,
  type Condition,
  type Listing,
  type ListingStatus,
} from '../fixtures/catalog'

export { CATEGORIES, CONDITIONS, CURRENT_USER_ID }
export type { Category, Condition, Listing, ListingStatus }

// Deliberate latency: with instant returns the loading branches never render and
// cannot be verified (plan §12 — a harness that stubs a terminal state cannot
// catch transition bugs).
const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory for now, so a created listing shows up in My Listings without a
// backend. A reload resets to the seed, which is the behaviour we want in a demo.
let listings: Listing[] = [...LISTINGS]

export type ListingSort = 'newest' | 'price-asc' | 'price-desc' | 'title'

export type ListingFilters = {
  query?: string
  categories?: Category[]
  conditions?: Condition[]
  minPrice?: number
  maxPrice?: number
  sellerId?: string
  status?: ListingStatus | 'any'
  sort?: ListingSort
}

function matches(listing: Listing, filters: ListingFilters) {
  const q = filters.query?.trim().toLowerCase() ?? ''
  // Round 1 searches listing titles by keyword.
  if (q && !listing.title.toLowerCase().includes(q)) return false
  if (filters.categories?.length && !filters.categories.includes(listing.category)) return false
  if (filters.conditions?.length && !filters.conditions.includes(listing.condition)) return false
  if (filters.minPrice != null && listing.price < filters.minPrice) return false
  if (filters.maxPrice != null && listing.price > filters.maxPrice) return false
  if (filters.sellerId && listing.sellerId !== filters.sellerId) return false

  const status = filters.status ?? 'available'
  if (status !== 'any' && listing.status !== status) return false

  return true
}

function sortListings(rows: Listing[], sort: ListingSort) {
  return [...rows].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'title') return a.title.localeCompare(b.title)
    return a.listedDaysAgo - b.listedDaysAgo
  })
}

export async function listListings(filters: ListingFilters = {}): Promise<Listing[]> {
  await delay()
  return sortListings(listings.filter((l) => matches(l, filters)), filters.sort ?? 'newest')
}

export async function getListing(id: string): Promise<Listing | null> {
  await delay()
  return listings.find((l) => l.id === id) ?? null
}

export type ListingInput = {
  title: string
  description: string
  category: Category
  price: number
  condition: Condition
  status: ListingStatus
}

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return `${base || 'listing'}-${Math.random().toString(36).slice(2, 7)}`
}

export async function createListing(input: ListingInput): Promise<Listing> {
  await delay(420)
  const listing: Listing = {
    ...input,
    id: slugify(input.title),
    sellerId: CURRENT_USER_ID,
    sellerName: 'Armaan M.',
    imageUrl: null,
    listedDaysAgo: 0,
  }
  listings = [listing, ...listings]
  return listing
}

export async function updateListing(id: string, input: ListingInput): Promise<Listing> {
  await delay(420)
  const existing = listings.find((l) => l.id === id)
  if (!existing) throw new Error('That listing no longer exists.')
  const updated: Listing = { ...existing, ...input }
  listings = listings.map((l) => (l.id === id ? updated : l))
  return updated
}

export async function deleteListing(id: string): Promise<void> {
  await delay(320)
  const existing = listings.find((l) => l.id === id)
  if (!existing) throw new Error('That listing no longer exists.')
  listings = listings.filter((l) => l.id !== id)
}

// Marks a listing sold at checkout. Real implementation is one update.
export async function markSold(ids: string[]): Promise<void> {
  listings = listings.map((l) => (ids.includes(l.id) ? { ...l, status: 'sold' } : l))
}
