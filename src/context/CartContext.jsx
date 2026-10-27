import { createContext, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MOCK_PRODUCTS } from '../data/mockProducts'

const CartContext = createContext(null)

// Bags saved before a catalogue change can hold products that no longer exist.
const PRODUCT_IDS = new Set(MOCK_PRODUCTS.map((p) => p.id))

const FREE_SHIPPING_THRESHOLD = 2999
const STANDARD_SHIPPING = 149
const TAX_RATE = 0.05

const PROMO_CODES = {
  WELCOME10: { type: 'percent', value: 10, label: '10% off' },
  FREESHIP: { type: 'shipping', value: 0, label: 'Free shipping' },
}

function lineId(productId, size, color) {
  return `${productId}::${size}::${color}`
}

export function CartProvider({ children }) {
  const [storedItems, setItems] = useLocalStorage('cart:items', [])
  const items = storedItems.filter((item) => PRODUCT_IDS.has(item.productId))
  const [isCartOpen, setCartOpen] = useState(false)
  const [promoCode, setPromoCode] = useLocalStorage('cart:promo', null)
  const [promoError, setPromoError] = useState('')

  function addItem(product, { size, color, quantity = 1 }) {
    setItems((prev) => {
      const id = lineId(product.id, size, color)
      const existing = prev.find((item) => item.id === id)
      const maxQty = product.stockCount

      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxQty)
        return prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
      }

      return [
        ...prev,
        {
          id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          size,
          color,
          quantity: Math.min(quantity, maxQty),
          stockCount: maxQty,
        },
      ]
    })
    setCartOpen(true)
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function updateQuantity(id, quantity) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stockCount)) }
          : item
      )
    )
  }

  function clearCart() {
    setItems([])
    setPromoCode(null)
  }

  function applyPromo(code) {
    const normalized = code.trim().toUpperCase()
    if (!normalized) return
    if (PROMO_CODES[normalized]) {
      setPromoCode(normalized)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  function removePromo() {
    setPromoCode(null)
    setPromoError('')
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const promo = promoCode ? PROMO_CODES[promoCode] : null

    const discount = promo?.type === 'percent' ? Math.round(subtotal * (promo.value / 100)) : 0
    const discountedSubtotal = subtotal - discount

    let shipping = subtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
    if (promo?.type === 'shipping') shipping = 0

    const tax = Math.round(discountedSubtotal * TAX_RATE)
    const total = discountedSubtotal + shipping + tax
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal)

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount,
      amountToFreeShipping,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    }
  }, [items, promoCode])

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    setCartOpen,
    promoCode,
    promoLabel: promoCode ? PROMO_CODES[promoCode].label : null,
    promoError,
    applyPromo,
    removePromo,
    ...totals,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
