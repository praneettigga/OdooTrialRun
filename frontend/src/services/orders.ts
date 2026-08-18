import type { Database } from '../types/database'
import { getSupabase } from './supabase'

export type OrderItem = {
  id: string
  productId: string | null
  titleSnapshot: string
  priceSnapshot: number
  categorySnapshot: string
  imageUrlSnapshot: string | null
  quantity: number
}

export type Order = {
  id: string
  buyerId: string
  totalAmount: number
  status: 'placed' | 'cancelled'
  placedDaysAgo: number
  items: OrderItem[]
}

type OrderRow = Database['public']['Tables']['orders']['Row']
type OrderItemRow = Database['public']['Tables']['order_items']['Row']
type OrderWithItems = OrderRow & { order_items: OrderItemRow[] }

function daysAgo(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000))
}

async function currentUserId() {
  const { data, error } = await getSupabase().auth.getUser()
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Sign in to view your purchases.')
  return data.user.id
}

function toOrderItem(item: OrderItemRow): OrderItem {
  return {
    id: item.id,
    productId: item.product_id,
    titleSnapshot: item.title_snapshot,
    priceSnapshot: item.price_snapshot,
    categorySnapshot: item.category_snapshot,
    imageUrlSnapshot: item.image_url_snapshot,
    quantity: item.quantity,
  }
}

function toOrder(order: OrderWithItems): Order {
  return {
    id: order.id,
    buyerId: order.buyer_id,
    totalAmount: order.total_amount,
    status: order.status as Order['status'],
    placedDaysAgo: daysAgo(order.created_at),
    items: order.order_items.map(toOrderItem),
  }
}

const orderSelect =
  'id, buyer_id, total_amount, status, created_at, order_items(id, order_id, product_id, title_snapshot, price_snapshot, category_snapshot, image_url_snapshot, quantity)'

export async function listOrders(): Promise<Order[]> {
  const userId = await currentUserId()
  const { data, error } = await getSupabase()
    .from('orders')
    .select(orderSelect)
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as OrderWithItems[]).map(toOrder)
}

export async function getOrder(id: string): Promise<Order | null> {
  const userId = await currentUserId()
  const { data, error } = await getSupabase()
    .from('orders')
    .select(orderSelect)
    .eq('id', id)
    .eq('buyer_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data ? toOrder(data as OrderWithItems) : null
}

export async function placeOrder(): Promise<Order> {
  const { data, error } = await getSupabase().rpc('place_order')
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Could not create your order.')

  const order = await getOrder(data)
  if (!order) throw new Error('Your order was created but could not be loaded.')
  return order
}
