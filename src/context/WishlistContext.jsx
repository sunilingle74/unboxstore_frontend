import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useLocalStorage('wishlist:ids', [])

  function toggle(productId) {
    setProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  function isWishlisted(productId) {
    return productIds.includes(productId)
  }

  const value = { productIds, toggle, isWishlisted, count: productIds.length }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
