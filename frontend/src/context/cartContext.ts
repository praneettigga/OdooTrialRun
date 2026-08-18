import { createContext, useContext } from 'react'

export type CartContextValue = {
  count: number
  refresh: () => Promise<void>
  add: (productId: string) => Promise<void>
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used inside CartProvider')
  return value
}
