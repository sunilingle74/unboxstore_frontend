import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, PackageCheck, Plus, Trash2, X } from 'lucide-react'
import Drawer from '../common/Drawer'
import EmptyState from '../common/EmptyState'
import { useCart } from '../../context/CartContext'
import { MOCK_PRODUCTS } from '../../data/mockProducts'

// What pairs with what for the "Complete the set" suggestion.
const PAIRS_WITH = {
  tops: ['jeans', 'jackets-and-coats'],
  't-shirts': ['jeans', 'hoodies-and-sweatshirts'],
  jeans: ['t-shirts', 'tops', 'hoodies-and-sweatshirts'],
  'jackets-and-coats': ['jeans', 't-shirts'],
  'hoodies-and-sweatshirts': ['jeans', 't-shirts'],
}

function pickSuggestion(items) {
  const inCart = new Set(items.map((i) => i.productId))
  const cartCategories = MOCK_PRODUCTS.filter((p) => inCart.has(p.id)).map((p) => p.category)
  const wanted = cartCategories.flatMap((c) => PAIRS_WITH[c] || [])
  const candidates = MOCK_PRODUCTS.filter(
    (p) => !inCart.has(p.id) && p.stockCount > 0 && !cartCategories.includes(p.category)
  )
  for (const category of wanted) {
    const match = candidates.find((p) => p.category === category && p.isFeatured) || candidates.find((p) => p.category === category)
    if (match) return match
  }
  return candidates[0] || null
}

export default function CartDrawer() {
  const cart = useCart()
  const { items, isCartOpen, setCartOpen, itemCount } = cart
  const close = () => setCartOpen(false)

  const header = (
    <div>
      <p className="flex items-center justify-center gap-2 border-b border-neutral-200 px-5 py-3 text-[13px] font-medium">
        <PackageCheck size={15} strokeWidth={1.5} />
        Free shipping on orders over ₹{cart.freeShippingThreshold.toLocaleString('en-IN')}
      </p>
      <div className="flex items-start justify-between px-6 pt-7 sm:px-11">
        <h2 className="font-display text-[36px] font-normal leading-none tracking-[-0.04em] sm:text-[44px]">
          Your cart<sup className="ml-1 align-super text-[16px] tracking-normal">{itemCount}</sup>
        </h2>
        <button onClick={close} aria-label="Close cart" className="-mr-2 p-2 hover:opacity-60">
          <X size={26} strokeWidth={1.25} />
        </button>
      </div>
    </div>
  )

  return (
    <Drawer
      open={isCartOpen}
      onClose={close}
      title={`Your Bag (${itemCount})`}
      header={header}
      widthClass="max-w-[560px]"
    >
      {items.length === 0 ? (
        <EmptyState
          className="h-full pb-20"
          size="md"
          title={
            <>
              It&rsquo;s a little
              <br />
              <em>empty</em> here
            </>
          }
          message="Your cart is currently empty"
          action={{ label: 'Start shopping', to: '/shop', onClick: close }}
        />
      ) : (
        <div className="flex min-h-full flex-col font-display">
          <div className="flex-1 px-6 sm:px-11">
            <FreeShippingProgress
              remaining={cart.amountToFreeShipping}
              threshold={cart.freeShippingThreshold}
            />

            <ul className="mt-2">
              {items.map((item) => (
                <CartLine key={item.id} item={item} onNavigate={close} />
              ))}
            </ul>

            <CompleteTheSet items={items} onNavigate={close} />
          </div>

          <div className="sticky bottom-0 border-t border-neutral-200 bg-white px-6 pb-7 pt-6 sm:px-11">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[24px] font-normal tracking-[-0.02em]">Subtotal</p>
              <p className="text-[24px] font-medium tracking-[-0.02em]">₹{cart.subtotal.toLocaleString('en-IN')}</p>
            </div>
            <p className="mt-1 text-[14px] text-neutral-600">Tax and shipping calculated at checkout.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={close}
                className="flex h-[52px] items-center justify-center rounded-full border border-neutral-900 text-[12px] uppercase tracking-[0.16em] hover:bg-neutral-50"
              >
                View cart
              </Link>
              <Link
                to="/checkout"
                onClick={close}
                className="flex h-[52px] items-center justify-center rounded-full bg-neutral-900 text-[12px] uppercase tracking-[0.16em] text-white hover:bg-neutral-700"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}

function FreeShippingProgress({ remaining, threshold }) {
  const progress = Math.min(1, Math.max(0, (threshold - remaining) / threshold))
  return (
    <div className="pt-6">
      <p className="flex items-center gap-2 text-[14px]">
        <PackageCheck size={16} strokeWidth={1.5} />
        {remaining > 0 ? (
          <span>
            Spend <strong className="font-medium">₹{remaining.toLocaleString('en-IN')}</strong> more for free shipping
          </span>
        ) : (
          <span>You&rsquo;ve unlocked free shipping</span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="mt-3 h-[3px] bg-neutral-200"
      >
        <div className="h-full bg-neutral-700 transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}

function CartLine({ item, onNavigate }) {
  const { updateQuantity, removeItem } = useCart()
  return (
    <li className="flex gap-5 py-6 sm:gap-7">
      <Link to={`/product/${item.slug}`} onClick={onNavigate} className="w-[96px] flex-none bg-[#efefef] sm:w-[123px]">
        <img src={item.image} alt={item.name} className="aspect-[3/4] h-auto w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <Link
            to={`/product/${item.slug}`}
            onClick={onNavigate}
            className="text-[13px] font-semibold uppercase leading-[1.7] tracking-[0.06em] hover:opacity-60"
          >
            {item.name}
          </Link>
          <p className="text-[14px] text-neutral-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
        </div>
        <p className="mt-3 text-[14px] text-neutral-600">₹{item.price.toLocaleString('en-IN')}</p>
        <p className="mt-2 text-[14px] text-neutral-600">
          {item.color} / {item.size}
        </p>
        <div className="mt-5 flex items-center gap-5">
          <div className="inline-flex h-9 items-center rounded border border-neutral-200">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="flex h-full w-9 items-center justify-center text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span aria-live="polite" className="w-6 text-center text-[14px]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stockCount}
              aria-label={`Increase quantity of ${item.name}`}
              className="flex h-full w-9 items-center justify-center text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            className="p-1 hover:opacity-60"
          >
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </li>
  )
}

function CompleteTheSet({ items, onNavigate }) {
  const { addItem } = useCart()
  const [pickingSize, setPickingSize] = useState(false)
  const product = pickSuggestion(items)
  if (!product) return null

  function quickAdd(size) {
    addItem(product, { size, color: product.colors[0]?.name, quantity: 1 })
    setPickingSize(false)
  }

  return (
    <section aria-labelledby="complete-the-set" className="mb-8 mt-10">
      <h3 id="complete-the-set" className="inline-block bg-[#f4f4f4] px-4 py-2.5 text-[11px] uppercase tracking-[0.16em]">
        Complete the set
      </h3>
      <div className="mt-2 flex bg-[#f4f4f4] sm:max-w-[466px]">
        <Link to={`/product/${product.slug}`} onClick={onNavigate} className="w-[96px] flex-none bg-[#efefef] sm:w-[123px]">
          <img src={product.images[0]} alt={product.name} className="aspect-[3/4] h-auto w-full object-cover" />
        </Link>
        <div className="flex flex-1 flex-col justify-center px-6 py-4">
          <Link to={`/product/${product.slug}`} onClick={onNavigate} className="text-[14px] hover:opacity-60">
            {product.name}
          </Link>
          <p className="mt-2 text-[14px]">₹{product.price.toLocaleString('en-IN')}</p>
          {pickingSize ? (
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={`Choose a size for ${product.name}`}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => quickAdd(size)}
                  className="h-8 min-w-8 border border-neutral-300 bg-white px-2 text-[12px] hover:border-neutral-900"
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickingSize(true)}
              className="mt-3 self-start border-b border-neutral-900 pb-0.5 text-[13px] uppercase tracking-[0.16em] hover:opacity-60"
            >
              Quick add
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
