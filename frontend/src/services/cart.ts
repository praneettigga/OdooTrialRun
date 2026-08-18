// Cart. Stubbed at the signature the Supabase implementation will use —
// cart_items keyed on (user_id, product_id), per docs/SCHEMA.md.

import { getListing, type Listing } from './products'

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export type CartLine = {
  listing: Listing
  quantity: number
}

// Seeded with two lines so the cart page has something to show on a cold demo.
let entries: { productId: string; quantity: number }[] = [
  { productId: 'kindle-paperwhite-10', quantity: 1 },
  { productId: 'cast-iron-kadai', quantity: 1 },
]

export async function getCart(): Promise<CartLine[]> {
  await delay()
  const lines: CartLine[] = []
  for (const entry of entries) {
    const listing = await getListing(entry.productId)
    // A listing can vanish between adding and viewing; drop it rather than crash.
    if (listing) lines.push({ listing, quantity: entry.quantity })
  }
  return lines
}

export async function getCartCount(): Promise<number> {
  return entries.reduce((total, entry) => total + entry.quantity, 0)
}

export async function addToCart(productId: string): Promise<void> {
  await delay(180)
  const existing = entries.find((e) => e.productId === productId)
  if (existing) existing.quantity += 1
  else entries = [...entries, { productId, quantity: 1 }]
}

export async function setQuantity(productId: string, quantity: number): Promise<void> {
  await delay(140)
  if (quantity <= 0) {
    entries = entries.filter((e) => e.productId !== productId)
    return
  }
  entries = entries.map((e) => (e.productId === productId ? { ...e, quantity } : e))
}

export async function removeFromCart(productId: string): Promise<void> {
  await delay(180)
  entries = entries.filter((e) => e.productId !== productId)
}

export async function clearCart(): Promise<void> {
  entries = []
}
