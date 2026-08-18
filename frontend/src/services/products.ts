import type { Database } from '../types/database'
import { getSupabase } from './supabase'

export const CATEGORIES = [
  'Furniture',
  'Electronics',
  'Books',
  'Clothing',
  'Sports',
  'Kitchen',
] as const

export const CONDITIONS = ['Like new', 'Good', 'Well used'] as const
export const STATUSES = ['available', 'sold', 'draft'] as const

export type Category = (typeof CATEGORIES)[number]
export type Condition = (typeof CONDITIONS)[number]
export type ListingStatus = (typeof STATUSES)[number]

export type Listing = {
  id: string
  sellerId: string
  sellerName: string
  title: string
  description: string
  category: Category
  price: number
  stockQuantity: number
  imageUrl: string | null
  status: ListingStatus
  condition: Condition
  listedDaysAgo: number
}

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

export type ListingInput = {
  title: string
  description: string
  category: Category
  price: number
  stockQuantity: number
  condition: Condition
  status: ListingStatus
}

type ProductRow = Database['public']['Tables']['products']['Row']
type ProductWithSeller = ProductRow & { seller: { username: string } | null }

function toMessage(cause: unknown) {
  return cause instanceof Error ? cause.message : 'Could not reach the listings service.'
}

function daysAgo(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000))
}

function toListing(product: ProductWithSeller): Listing {
  return {
    id: product.id,
    sellerId: product.seller_id,
    sellerName: product.seller?.username ?? 'Unknown seller',
    title: product.title,
    description: product.description,
    category: product.category as Category,
    price: product.price,
    stockQuantity: product.stock_quantity,
    imageUrl: product.image_url,
    status: product.status as ListingStatus,
    condition: product.condition as Condition,
    listedDaysAgo: daysAgo(product.created_at),
  }
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

function escapedLike(value: string) {
  return value.replace(/[%_\\]/g, '\\$&')
}

async function currentUserId() {
  try {
    const { data, error } = await getSupabase().auth.getUser()
    throwIfError(error)
    if (!data.user) throw new Error('Sign in to manage listings.')
    return data.user.id
  } catch (cause: unknown) {
    throw new Error(toMessage(cause))
  }
}

export async function listListings(filters: ListingFilters = {}): Promise<Listing[]> {
  try {
    const supabase = getSupabase()
    let query = supabase
      .from('products')
      .select('id, seller_id, title, description, category, price, stock_quantity, image_url, condition, status, created_at, seller:profiles!products_seller_id_fkey(username)')

    const status = filters.status ?? 'available'
    if (status !== 'any') query = query.eq('status', status)
    if (filters.query?.trim()) query = query.ilike('title', `%${escapedLike(filters.query.trim())}%`)
    if (filters.categories?.length) query = query.in('category', filters.categories)
    if (filters.conditions?.length) query = query.in('condition', filters.conditions)
    if (filters.minPrice != null) query = query.gte('price', filters.minPrice)
    if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice)
    if (filters.sellerId) query = query.eq('seller_id', filters.sellerId)

    const sort = filters.sort ?? 'newest'
    if (sort === 'price-asc') query = query.order('price', { ascending: true })
    else if (sort === 'price-desc') query = query.order('price', { ascending: false })
    else if (sort === 'title') query = query.order('title', { ascending: true })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    throwIfError(error)
    return (data as ProductWithSeller[]).map(toListing)
  } catch (cause: unknown) {
    throw new Error(toMessage(cause))
  }
}

export async function getListing(id: string): Promise<Listing | null> {
  try {
    const { data, error } = await getSupabase()
      .from('products')
      .select('id, seller_id, title, description, category, price, stock_quantity, image_url, condition, status, created_at, seller:profiles!products_seller_id_fkey(username)')
      .eq('id', id)
      .maybeSingle()

    throwIfError(error)
    return data ? toListing(data as ProductWithSeller) : null
  } catch (cause: unknown) {
    throw new Error(toMessage(cause))
  }
}

export async function createListing(input: ListingInput): Promise<Listing> {
  const sellerId = await currentUserId()
  try {
    const { data, error } = await getSupabase()
      .from('products')
      .insert({
        seller_id: sellerId,
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        price: input.price,
        stock_quantity: input.stockQuantity,
        condition: input.condition,
        status: input.status,
      })
      .select('id, seller_id, title, description, category, price, stock_quantity, image_url, condition, status, created_at, seller:profiles!products_seller_id_fkey(username)')
      .single()

    throwIfError(error)
    return toListing(data as ProductWithSeller)
  } catch (cause: unknown) {
    throw new Error(toMessage(cause))
  }
}

export async function updateListing(id: string, input: ListingInput): Promise<Listing> {
  try {
    const { data, error } = await getSupabase()
      .from('products')
      .update({
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        price: input.price,
        stock_quantity: input.stockQuantity,
        condition: input.condition,
        status: input.status,
      })
      .eq('id', id)
      .select('id, seller_id, title, description, category, price, stock_quantity, image_url, condition, status, created_at, seller:profiles!products_seller_id_fkey(username)')
      .maybeSingle()

    throwIfError(error)
    if (!data) throw new Error('That listing no longer exists.')
    return toListing(data as ProductWithSeller)
  } catch (cause: unknown) {
    throw new Error(toMessage(cause))
  }
}

export async function deleteListing(id: string): Promise<void> {
  try {
    const { error } = await getSupabase().from('products').delete().eq('id', id)
    throwIfError(error)
  } catch (cause: unknown) {
    throw new Error(toMessage(cause))
  }
}
