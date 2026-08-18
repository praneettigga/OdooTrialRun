import { useCallback, useEffect, useState, type ReactNode } from 'react'
import * as cartService from '../services/cart'
import { CartContext } from './cartContext'

// Only the badge count lives here — the cart page fetches its own lines. This
// exists so adding from a product page updates the header without a reload.
export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)

  const refresh = useCallback(async () => {
    setCount(await cartService.getCartCount())
  }, [])

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
