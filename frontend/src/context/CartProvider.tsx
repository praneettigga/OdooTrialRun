import { useCallback, useEffect, useState, type ReactNode } from 'react'
import * as cartService from '../services/cart'
import { useAuth } from './authContext'
import { CartContext } from './cartContext'

// Only the badge count lives here — the cart page fetches its own lines. This
// exists so adding from a product page updates the header without a reload.
export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  const { session, loading } = useAuth()

  const refresh = useCallback(async () => {
    if (loading || !session) {
      setCount(0)
      return
    }

    try {
      setCount(await cartService.getCartCount())
    } catch {
      setCount(0)
    }
  }, [loading, session])

  const add = useCallback(
    async (productId: string) => {
      await cartService.addToCart(productId)
      await refresh()
    },
    [refresh],
  )

  useEffect(() => {
    void refresh()
  }, [refresh])

  return <CartContext value={{ count, refresh, add }}>{children}</CartContext>
}
