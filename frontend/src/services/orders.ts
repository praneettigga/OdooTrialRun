// Orders and previous purchases. Stubbed at the real signature.

import { CURRENT_USER, ORDERS, type Order, type OrderItem } from '../fixtures/account'
import { clearCart, getCart } from './cart'
import { markSold } from './products'

export type { Order, OrderItem }

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let orders: Order[] = [...ORDERS]

export async function listOrders(): Promise<Order[]> {
  await delay()
  return [...orders].sort((a, b) => a.placedDaysAgo - b.placedDaysAgo)
}

export async function getOrder(id: string): Promise<Order | null> {
  await delay()
  return orders.find((o) => o.id === id) ?? null
}

// Checkout. The Round 1 brief has no payment step, so this is the whole of it:
// turn the cart into an order with price snapshots, mark the listings sold, and
// empty the cart. Real version wraps the same three writes in a transaction.
export async function placeOrder(): Promise<Order> {
  await delay(600)
  const lines = await getCart()
  if (lines.length === 0) throw new Error('Your cart is empty.')

  const items: OrderItem[] = lines.map((line, index) => ({
    id: `oi-${Date.now()}-${index}`,
    productId: line.listing.id,
    titleSnapshot: line.listing.title,
    priceSnapshot: line.listing.price,
    categorySnapshot: line.listing.category,
  }))

  const order: Order = {
    id: `ord-${Math.floor(Math.random() * 9000 + 1000)}`,
    buyerId: CURRENT_USER.id,
    totalAmount: lines.reduce((sum, line) => sum + line.listing.price * line.quantity, 0),
    status: 'placed',
    placedDaysAgo: 0,
    items,
  }

  orders = [order, ...orders]
  await markSold(lines.map((line) => line.listing.id))
  await clearCart()
  return order
}
