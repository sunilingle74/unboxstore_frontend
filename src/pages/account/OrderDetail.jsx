import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Download } from 'lucide-react'
import Button from '../../components/common/Button'
import { api, errorMessage } from '../../lib/api'
import { STATUS_STYLES, formatDate, paymentLabel } from '../../lib/orders'

// Shared by the post-checkout confirmation (/order/:id) and the account order page.
export default function OrderDetail({ confirmation = false }) {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let current = true
    api
      .get(`/orders/${id}`)
      .then((res) => current && setOrder(res.data.order))
      .catch((err) => current && setError(errorMessage(err, 'We could not find this order.')))
    return () => {
      current = false
    }
  }, [id])

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm text-neutral-600">{error}</p>
        <Button as={Link} to="/account" className="mt-6">
          Go to my account
        </Button>
      </div>
    )
  }
  if (!order) return <div className="min-h-[60vh]" aria-busy="true" />

  const a = order.shippingAddress
  const hasInvoice = !order.awaitingPayment

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {confirmation ? (
        <div className="text-center">
          <CheckCircle2 size={44} strokeWidth={1.5} className="mx-auto" />
          <h1 className="mt-4 font-display text-[34px] font-normal tracking-[-0.03em]">Thank you for your order</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Order <strong data-testid="order-number">{order.orderNumber}</strong> is confirmed. We've emailed your
            confirmation and invoice to <strong>{order.email}</strong>.
          </p>
        </div>
      ) : (
        <div>
          <Link to="/account" className="text-sm underline underline-offset-4 hover:opacity-60">
            ← My account
          </Link>
          <h1 className="mt-4 font-display text-[34px] font-normal tracking-[-0.03em]">
            Order <span data-testid="order-number">{order.orderNumber}</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Placed {formatDate(order.createdAt)}</p>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
        <span className={`px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}>{order.status}</span>
        <span className="text-neutral-600">{paymentLabel(order)}</span>
        {order.shiprocket?.awbCode && (
          <span className="text-neutral-600">
            {order.shiprocket.courierName} · AWB {order.shiprocket.awbCode}
          </span>
        )}
        {hasInvoice && (
          <a
            href={`/api/orders/${order._id}/invoice`}
            download
            className="ml-auto inline-flex items-center gap-1.5 underline underline-offset-4 hover:opacity-60"
          >
            <Download size={15} /> Download invoice
          </a>
        )}
      </div>

      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between gap-4 py-4 text-sm">
            <div>
              {item.product?.slug ? (
                <Link to={`/product/${item.product.slug}`} className="font-medium hover:underline">
                  {item.name}
                </Link>
              ) : (
                <p className="font-medium">{item.name}</p>
              )}
              <p className="text-xs text-neutral-500">
                {item.color} / {item.size} × {item.quantity}
              </p>
            </div>
            <p className="font-medium">₹{item.price * item.quantity}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div className="text-sm">
          <h2 className="font-semibold">Shipping to</h2>
          <p className="mt-2 leading-relaxed text-neutral-600">
            {a.fullName}
            <br />
            {a.addressLine}
            <br />
            {a.city}, {a.state} {a.pincode}
            <br />
            +91 {a.phone}
          </p>
        </div>
        <dl className="space-y-2 text-sm">
          <Row label="Subtotal" value={`₹${order.subtotal}`} />
          {order.discount > 0 && <Row label={`Discount${order.promoCode ? ` (${order.promoCode})` : ''}`} value={`-₹${order.discount}`} />}
          <Row label="Shipping" value={order.shipping ? `₹${order.shipping}` : 'Free'} />
          <Row label="Tax" value={`₹${order.tax}`} />
          {order.codFee > 0 && <Row label="COD fee" value={`₹${order.codFee}`} />}
          <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd data-testid="order-total">₹{order.total}</dd>
          </div>
          {order.paymentMethod === 'COD' && (
            <>
              <Row label="Paid online" value={`₹${order.amountPaid || 0}`} />
              <Row label="Due on delivery" value={`₹${order.total - (order.amountPaid || 0)}`} />
            </>
          )}
        </dl>
      </div>

      {confirmation && (
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as={Link} to={`/account/orders/${order._id}`} variant="secondary">
            View order
          </Button>
          <Button as={Link} to="/shop">
            Continue shopping
          </Button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
