import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import { useCart } from '../context/CartContext'
import Button from '../components/common/Button'
import QuantityInput from '../components/common/QuantityInput'

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    promoCode,
    promoLabel,
    promoError,
    applyPromo,
    removePromo,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
    amountToFreeShipping,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')

  if (items.length === 0) {
    return (
      <EmptyState
        as="h1"
        className="min-h-[70vh] py-24"
        title={
          <>
            It&rsquo;s a little
              <br />
              <em>empty</em> here
          </>
        }
        message="Your bag is currently empty"
        action={{ label: 'Start shopping', to: '/shop' }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Your Bag</h1>
      <p className="mt-1 text-sm text-neutral-500">{itemCount} items</p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <img src={item.image} alt={item.name} className="h-32 w-24 flex-none bg-neutral-100 object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantityInput
                      size="sm"
                      value={item.quantity}
                      max={item.stockCount}
                      onChange={(qty) => updateQuantity(item.id, qty)}
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

        </div>

        <div className="h-fit rounded-lg border border-neutral-200 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order Summary</h2>

          {amountToFreeShipping > 0 ? (
            <p className="mt-3 text-xs text-neutral-600">
              Add <span className="font-semibold">₹{amountToFreeShipping}</span> more for free shipping.
            </p>
          ) : (
            <p className="mt-3 text-xs font-medium text-green-700">You've unlocked free shipping.</p>
          )}

          <div className="mt-4">
            {promoCode ? (
              <div className="flex items-center justify-between rounded-md bg-neutral-100 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium">{promoCode}</span> applied — {promoLabel}
                </span>
                <button onClick={removePromo} className="text-xs font-medium underline underline-offset-4">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    applyPromo(promoInput)
                    setPromoInput('')
                  }}
                >
                  Apply
                </Button>
              </div>
            )}
            {promoError && <p className="mt-1.5 text-xs font-medium text-red-600">{promoError}</p>}
          </div>

          <div className="mt-5 space-y-2.5 border-t border-neutral-200 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Discount</span>
                <span className="font-medium text-green-700">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping</span>
              <span className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tax</span>
              <span className="font-medium">₹{tax}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Button as={Link} to="/checkout" className="mt-6 w-full" size="lg">
            Checkout — ₹{total}
          </Button>
          <p className="mt-3 text-center text-xs text-neutral-500">Sign in with your mobile number at checkout.</p>
        </div>
      </div>
    </div>
  )
}
