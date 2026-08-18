// Current account and its order history.
//
// Deliberately limited to what docs/SCHEMA.md actually has. `profiles` carries
// id, username, avatar_url and created_at; email lives in Supabase-managed
// auth.users, so it is read-only here. The wireframe's "user other info" has no
// columns behind it yet — see docs/TASKS.md before adding any.

import { CURRENT_USER_ID } from './catalog'

export type Profile = {
  id: string
  username: string
  email: string
  avatarUrl: string | null
  memberSinceDaysAgo: number
}

export const CURRENT_USER: Profile = {
  id: CURRENT_USER_ID,
  username: 'armaan',
  email: 'armaan@ecofinds.app',
  avatarUrl: null,
  memberSinceDaysAgo: 213,
}

// order_items keeps snapshots so a purchase still renders after the seller
// edits or deletes the listing. Schema note: product_id is nullable for exactly
// that reason.
export type OrderItem = {
  id: string
  productId: string | null
  titleSnapshot: string
  priceSnapshot: number
  categorySnapshot: string
}

export type Order = {
  id: string
  buyerId: string
  totalAmount: number
  status: 'placed' | 'cancelled'
  placedDaysAgo: number
  items: OrderItem[]
}

export const ORDERS: Order[] = [
  {
    id: 'ord-2417',
    buyerId: CURRENT_USER_ID,
    totalAmount: 7000,
    status: 'placed',
    placedDaysAgo: 12,
    items: [
      {
        id: 'oi-1',
        productId: 'penguin-classics-set',
        titleSnapshot: 'Penguin Classics — 12 book set',
        priceSnapshot: 2100,
        categorySnapshot: 'Books',
      },
      {
        id: 'oi-2',
        productId: 'rattan-lounge-chair',
        titleSnapshot: 'Rattan lounge chair with cushion',
        priceSnapshot: 4900,
        categorySnapshot: 'Furniture',
      },
    ],
  },
  {
    id: 'ord-2295',
    buyerId: CURRENT_USER_ID,
    totalAmount: 1400,
    status: 'placed',
    placedDaysAgo: 38,
    items: [
      {
        id: 'oi-3',
        productId: 'copper-water-jug',
        titleSnapshot: 'Hammered copper jug, 1.5 litre',
        priceSnapshot: 1400,
        categorySnapshot: 'Kitchen',
      },
    ],
  },
  {
    id: 'ord-2088',
    buyerId: CURRENT_USER_ID,
    totalAmount: 2750,
    status: 'placed',
    placedDaysAgo: 74,
    items: [
      {
        id: 'oi-4',
        // The seller took this listing down; the snapshot is all that remains.
        productId: null,
        titleSnapshot: 'Enamel camping kettle, 1 litre',
        priceSnapshot: 750,
        categorySnapshot: 'Kitchen',
      },
      {
        id: 'oi-5',
        productId: 'yoga-mat-cork',
        titleSnapshot: 'Cork yoga mat, 4mm',
        priceSnapshot: 2000,
        categorySnapshot: 'Sports',
      },
    ],
  },
]
