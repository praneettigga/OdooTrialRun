import { getListing, type Listing } from './products'
import { getSupabase } from './supabase'

export type CartLine = {
  listing: Listing
  quantity: number
}

async function currentUserId() {
  const { data, error } = await getSupabase().auth.getUser()
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Sign in to manage your cart.')
  return data.user.id
}

async function purchasableListing(productId: string, userId: string) {
  const listing = await getListing(productId)
  if (!listing || listing.status !== 'available' || listing.stockQuantity < 1) {
    throw new Error('That listing is no longer available.')
  }
  if (listing.sellerId === userId) {
    throw new Error('You cannot add your own listing to your cart.')
  }
  return listing
}

export async function getCart(): Promise<CartLine[]> {
  const userId = await currentUserId()
  const { data, error } = await getSupabase()
    .from('cart_items')
    .select('product_id, quantity')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) throw new Error(error.message)

  const lines = await Promise.all(
    (data ?? []).map(async (item) => {
      const listing = await getListing(item.product_id)
      return listing?.status === 'available' && listing.stockQuantity > 0
        ? { listing, quantity: item.quantity }
        : null
    }),
  )

  return lines.filter((line): line is CartLine => line !== null)
}

export async function getCartCount(): Promise<number> {
  const lines = await getCart()
  return lines.reduce((total, line) => total + line.quantity, 0)
}

export async function addToCart(productId: string): Promise<void> {
  const userId = await currentUserId()
  const listing = await purchasableListing(productId, userId)
  const { data: existing, error: readError } = await getSupabase()
    .from('cart_items')
    .select('quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle()

  if (readError) throw new Error(readError.message)

  const quantity = (existing?.quantity ?? 0) + 1
  if (quantity > listing.stockQuantity) {
    throw new Error(`Only ${listing.stockQuantity} available for this listing.`)
  }

  const { error } = existing
    ? await getSupabase()
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)
    : await getSupabase().from('cart_items').insert({ user_id: userId, product_id: productId, quantity })

  if (error) throw new Error(error.message)
}

export async function setQuantity(productId: string, quantity: number): Promise<void> {
  const userId = await currentUserId()
  if (quantity <= 0) {
    await removeFromCart(productId)
    return
  }

  const listing = await purchasableListing(productId, userId)
  if (!Number.isInteger(quantity) || quantity > listing.stockQuantity) {
    throw new Error(`Only ${listing.stockQuantity} available for this listing.`)
  }

  const { error } = await getSupabase()
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) throw new Error(error.message)
}

export async function removeFromCart(productId: string): Promise<void> {
  const userId = await currentUserId()
  const { error } = await getSupabase()
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) throw new Error(error.message)
}

export async function clearCart(): Promise<void> {
  const userId = await currentUserId()
  const { error } = await getSupabase().from('cart_items').delete().eq('user_id', userId)
  if (error) throw new Error(error.message)
}
