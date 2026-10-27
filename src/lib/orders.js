export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

export const STATUS_STYLES = {
  Processing: 'bg-amber-50 text-amber-800',
  Shipped: 'bg-sky-50 text-sky-800',
  Delivered: 'bg-green-50 text-green-800',
  Cancelled: 'bg-neutral-100 text-neutral-600',
}

const OPTION_LABELS = { upi: 'UPI', card: 'Card', netbanking: 'Net banking' }

export function paymentLabel(order) {
  if (order.paymentMethod === 'COD') {
    if (order.paymentStatus === 'Paid') return 'Cash on delivery — paid'
    if (order.paymentStatus === 'Refunded') return 'Cash on delivery — fee refunded'
    return `Cash on delivery — ${formatINR(order.total - (order.amountPaid || 0))} due on delivery`
  }
  const via = OPTION_LABELS[order.paymentOption] ? ` · ${OPTION_LABELS[order.paymentOption]}` : ''
  return { Paid: `Paid online${via}`, Pending: 'Awaiting payment', Refunded: 'Refunded', Failed: 'Payment failed' }[order.paymentStatus]
}

// Loads Razorpay Checkout on demand instead of on every page.
let razorpayScript
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  razorpayScript ||= new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => {
      razorpayScript = null
      resolve(false)
    }
    document.body.appendChild(s)
  })
  return razorpayScript
}
