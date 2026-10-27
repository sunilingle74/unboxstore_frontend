import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Banknote, ChevronDown, CreditCard, Landmark, Lock, Smartphone } from 'lucide-react'
import FormField, { FormError, INPUT_CLASS } from '../components/common/FormField'
import MockPaymentSheet from '../components/checkout/MockPaymentSheet'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { api, errorMessage } from '../lib/api'
import { formatINR, loadRazorpay } from '../lib/orders'

const ADDRESS_FIELDS = ['fullName', 'phone', 'addressLine', 'city', 'state', 'pincode']

const PAYMENT_OPTIONS = [
  { value: 'upi', title: 'UPI', description: 'Google Pay, PhonePe, Paytm & more', icon: Smartphone },
  { value: 'card', title: 'Card', description: 'Visa, Mastercard, RuPay, Amex', icon: CreditCard },
  { value: 'netbanking', title: 'Net banking', description: 'All major Indian banks', icon: Landmark },
  { value: 'cod', title: 'Cash on delivery', description: 'Small fee paid online now', icon: Banknote },
]

function initialAddress(user) {
  const saved = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0]
  if (saved) return Object.fromEntries(ADDRESS_FIELDS.map((f) => [f, saved[f] || '']))
  return { fullName: user.name || '', phone: user.phone || '', addressLine: '', city: '', state: '', pincode: '' }
}

function validate(address, email) {
  const errors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email for your invoice'
  if (!address.fullName.trim()) errors.fullName = 'Required'
  if (!/^[6-9]\d{9}$/.test(address.phone.trim())) errors.phone = 'Enter a 10-digit mobile number'
  if (!address.addressLine.trim()) errors.addressLine = 'Required'
  if (!address.city.trim()) errors.city = 'Required'
  if (!address.state.trim()) errors.state = 'Required'
  if (!/^\d{6}$/.test(address.pincode.trim())) errors.pincode = 'Enter a 6-digit pincode'
  return errors
}

export default function Checkout() {
  const { user } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const [email, setEmail] = useState(user.email || '')
  const [address, setAddress] = useState(() => initialAddress(user))
  const [saveAddress, setSaveAddress] = useState(!user.addresses?.length)
  const [paymentOption, setPaymentOption] = useState('upi')
  const [config, setConfig] = useState({ codFee: 100, mockPayments: false })
  const [mockPayment, setMockPayment] = useState(null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [placing, setPlacing] = useState(false)
  const placedRef = useRef(false)

  useEffect(() => {
    api
      .get('/payments/config')
      .then((res) => setConfig(res.data))
      .catch(() => {})
  }, [])

  if (cart.items.length === 0 && !placedRef.current) return <Navigate to="/cart" replace />

  const isCod = paymentOption === 'cod'
  const codFee = isCod ? config.codFee : 0
  const total = cart.total + codFee
  const payNow = isCod ? codFee : total

  function updateAddress(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  function finish(order) {
    placedRef.current = true
    if (saveAddress) api.post('/users/me/addresses', { ...address, isDefault: true }).catch(() => {})
    cart.clearCart()
    navigate(`/order/${order._id}`, { replace: true })
  }

  async function payWithRazorpay(data) {
    const loaded = await loadRazorpay()
    if (!loaded) throw new Error('Could not load the payment window. Check your connection and try again.')

    await new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        order_id: data.razorpayOrder.id,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'unboxstore',
        description: isCod ? `COD fee · ${data.order.orderNumber}` : `Order ${data.order.orderNumber}`,
        // COD fee can be paid any way; otherwise open on the method the customer chose.
        prefill: { name: address.fullName, email, contact: address.phone, ...(!isCod && { method: paymentOption }) },
        theme: { color: '#171717' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', { orderId: data.order._id, ...response })
            resolve()
          } catch (err) {
            reject(new Error(errorMessage(err, 'We could not verify your payment. If money was deducted, contact us.')))
          }
        },
        modal: { ondismiss: () => reject(new Error('Payment was cancelled. Your bag is saved — try again when you’re ready.')) },
      })
      rzp.open()
    })
  }

  // Dev/test only: stands in for Razorpay while keys aren't configured.
  function payWithMock(data) {
    return new Promise((resolve, reject) => {
      setMockPayment({
        amount: data.payNow,
        option: isCod ? 'COD fee (UPI or card)' : PAYMENT_OPTIONS.find((o) => o.value === paymentOption).title,
        onSuccess: async () => {
          setMockPayment(null)
          try {
            await api.post('/payments/mock', { orderId: data.order._id })
            resolve()
          } catch (err) {
            reject(new Error(errorMessage(err)))
          }
        },
        onFailure: () => {
          setMockPayment(null)
          reject(new Error('Payment failed. You haven’t been charged — please try again.'))
        },
      })
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    const nextErrors = validate(address, email)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setPlacing(true)
    try {
      const res = await api.post('/orders/checkout', {
        items: cart.items.map((i) => ({ productId: i.productId, size: i.size, color: i.color, quantity: i.quantity })),
        shippingAddress: Object.fromEntries(Object.entries(address).map(([k, v]) => [k, v.trim()])),
        promoCode: cart.promoCode || undefined,
        paymentOption,
        email: email.trim(),
      })
      if (res.data.mockPayment) await payWithMock(res.data)
      else await payWithRazorpay(res.data)
      finish(res.data.order)
    } catch (err) {
      setFormError(err.response ? errorMessage(err) : err.message)
      setPlacing(false)
    }
  }

  const input = (field, props = {}) => (
    <input value={address[field]} onChange={(e) => updateAddress(field, e.target.value)} className={INPUT_CLASS} {...props} />
  )

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-12 font-display sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-[12px] uppercase tracking-[0.12em]">
        <Link to="/cart" className="border-b border-neutral-400 pb-0.5 text-neutral-500 hover:text-neutral-900">
          Bag
        </Link>
        <span className="mx-3">/</span>
        <span aria-current="page">Checkout</span>
      </nav>
      <h1 className="mt-6 text-[44px] font-normal leading-none tracking-[-0.04em] sm:text-[64px]">Checkout</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[1fr_440px] lg:gap-16">
        <OrderSummary cart={cart} codFee={codFee} total={total} payNow={payNow} isCod={isCod} />

        <form onSubmit={handleSubmit} noValidate className="space-y-14 lg:order-first">
          <Section number="01" title="Contact">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-2 text-[13px]">
              Signed in as <strong className="font-medium">+91 {user.phone || '—'}</strong>
            </p>
            <FormField label="Email" error={errors.email} hint="Your invoice and order updates are sent here">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={INPUT_CLASS} />
            </FormField>
          </Section>

          <Section number="02" title="Delivery">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Full name" error={errors.fullName} className="sm:col-span-2">
                {input('fullName', { autoComplete: 'name' })}
              </FormField>
              <FormField label="Mobile number" error={errors.phone}>
                {input('phone', { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel-national' })}
              </FormField>
              <FormField label="Pincode" error={errors.pincode}>
                {input('pincode', { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}
              </FormField>
              <FormField label="Address" error={errors.addressLine} className="sm:col-span-2">
                {input('addressLine', { autoComplete: 'street-address', placeholder: 'House no., street, area' })}
              </FormField>
              <FormField label="City" error={errors.city}>
                {input('city', { autoComplete: 'address-level2' })}
              </FormField>
              <FormField label="State" error={errors.state}>
                {input('state', { autoComplete: 'address-level1' })}
              </FormField>
            </div>
            <label className="mt-5 flex items-center gap-3 text-[14px]">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="h-4 w-4 accent-neutral-900"
              />
              Save as my default address
            </label>
          </Section>

          <Section number="03" title="Payment">
            <fieldset>
              <legend className="sr-only">Payment method</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((option) => (
                  <PaymentOption
                    key={option.value}
                    option={option}
                    selected={paymentOption === option.value}
                    onSelect={setPaymentOption}
                  />
                ))}
              </div>
            </fieldset>

            {isCod ? (
              <div className="mt-5 rounded-lg bg-[#f4f4f4] px-5 py-4 text-[14px] leading-relaxed">
                <p className="font-medium">How cash on delivery works</p>
                <p className="mt-1 text-neutral-600">
                  Pay a {formatINR(config.codFee)} COD fee online now (UPI or card) to confirm your order. Pay the
                  remaining <strong className="font-medium text-neutral-900">{formatINR(total - config.codFee)}</strong> in
                  cash when it arrives. The fee is refunded if your order is cancelled.
                </p>
              </div>
            ) : (
              <p className="mt-5 text-[14px] text-neutral-600">
                You&rsquo;ll complete the payment in a secure Razorpay window.
              </p>
            )}
          </Section>

          <div className="space-y-4">
            <FormError message={formError} />
            <button
              type="submit"
              disabled={placing}
              className="flex h-[58px] w-full items-center justify-center rounded-full bg-neutral-900 text-[13px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
            >
              {placing ? 'Processing…' : isCod ? `Pay ${formatINR(payNow)} & place order` : `Pay ${formatINR(payNow)}`}
            </button>
            <p className="flex items-center justify-center gap-2 text-[13px] text-neutral-500">
              <Lock size={14} strokeWidth={1.5} /> Payments are encrypted and processed by Razorpay
            </p>
          </div>
        </form>
      </div>

      {mockPayment && <MockPaymentSheet {...mockPayment} />}
    </div>
  )
}

function Section({ number, title, children }) {
  return (
    <section aria-labelledby={`checkout-${number}`}>
      <div className="mb-6 flex items-baseline gap-4 border-b border-neutral-200 pb-4">
        <span className="text-[12px] tracking-[0.16em] text-neutral-400">{number}</span>
        <h2 id={`checkout-${number}`} className="text-[28px] font-normal leading-none tracking-[-0.03em]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function PaymentOption({ option, selected, onSelect }) {
  const Icon = option.icon
  return (
    <label
      className={`relative flex cursor-pointer items-center gap-4 rounded-lg border px-5 py-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-900 ${
        selected ? 'border-neutral-900 bg-white' : 'border-neutral-200 hover:border-neutral-400'
      }`}
    >
      <input
        type="radio"
        name="payment"
        value={option.value}
        checked={selected}
        onChange={() => onSelect(option.value)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-lg opacity-0"
      />
      <Icon size={22} strokeWidth={1.25} className="flex-none" />
      <span className="flex-1">
        <span className="block text-[15px]">{option.title}</span>
        <span className="block text-[12px] text-neutral-500">{option.description}</span>
      </span>
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border ${
          selected ? 'border-neutral-900' : 'border-neutral-300'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />}
      </span>
    </label>
  )
}

function OrderSummary({ cart, codFee, total, payNow, isCod }) {
  const [open, setOpen] = useState(false)

  return (
    <aside className="h-fit rounded-lg bg-[#f4f4f4] lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-6 py-5 text-left lg:hidden"
      >
        <span className="flex items-center gap-2 text-[14px]">
          {open ? 'Hide' : 'Show'} order summary
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
        <span className="text-[18px]">{formatINR(total)}</span>
      </button>

      <div className={`${open ? 'block' : 'hidden'} px-6 pb-7 lg:block lg:pt-7 sm:px-8`}>
        <h2 className="hidden text-[28px] font-normal leading-none tracking-[-0.03em] lg:block">
          Order summary<sup className="ml-1 align-super text-[13px] tracking-normal">{cart.itemCount}</sup>
        </h2>

        <ul className="mt-2 divide-y divide-neutral-200 lg:mt-6">
          {cart.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative w-[64px] flex-none">
                <img src={item.image} alt="" className="aspect-[3/4] w-full rounded bg-white object-cover" />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[11px] text-white">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em]">{item.name}</p>
                <p className="mt-1 text-[13px] text-neutral-500">
                  {item.color} / {item.size}
                </p>
              </div>
              <p className="text-[14px]">{formatINR(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2.5 border-t border-neutral-200 pt-5 text-[14px]">
          <Row label="Subtotal" value={formatINR(cart.subtotal)} />
          {cart.discount > 0 && <Row label={`Discount (${cart.promoCode})`} value={`−${formatINR(cart.discount)}`} />}
          <Row label="Shipping" value={cart.shipping === 0 ? 'Free' : formatINR(cart.shipping)} />
          <Row label="Tax (5%)" value={formatINR(cart.tax)} />
          {isCod && <Row label="COD fee" value={formatINR(codFee)} />}
        </dl>

        <div className="mt-5 flex items-baseline justify-between border-t border-neutral-200 pt-5">
          <span className="text-[20px]">Total</span>
          <span data-testid="checkout-total" className="text-[26px] font-medium tracking-[-0.02em]">
            {formatINR(total)}
          </span>
        </div>

        {isCod && (
          <dl className="mt-4 space-y-2 rounded-lg bg-white px-4 py-3 text-[14px]">
            <Row label="Pay now (online)" value={formatINR(payNow)} strong />
            <Row label="Pay on delivery (cash)" value={formatINR(total - payNow)} />
          </dl>
        )}

        {!cart.promoCode && (
          <p className="mt-5 text-[13px] text-neutral-500">
            Have a promo code?{' '}
            <Link to="/cart" className="underline underline-offset-4 hover:text-neutral-900">
              Apply it in your bag
            </Link>
          </p>
        )}
      </div>
    </aside>
  )
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-600">{label}</dt>
      <dd className={strong ? 'font-medium' : ''}>{value}</dd>
    </div>
  )
}
