import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import FormField, { FormError, INPUT_CLASS } from '../../components/common/FormField'
import { useAuth } from '../../context/AuthContext'
import { api, errorMessage } from '../../lib/api'
import { STATUS_STYLES, formatDate } from '../../lib/orders'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Leave the protected page first; otherwise RequireAuth sees the signed-out
  // state and bounces to /login?next=/account.
  async function handleLogout() {
    navigate('/', { replace: true })
    await logout()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">My account</p>
          <h1 className="mt-2 font-display text-[34px] font-normal tracking-[-0.03em] sm:text-[44px]">
            Hi, {user.name.split(' ')[0]}
          </h1>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Sign out
        </Button>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px]">
        <Orders />
        <div className="space-y-12">
          <Profile />
          <Password />
        </div>
      </div>
    </div>
  )
}

function Orders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data.orders))
      .catch((err) => setError(errorMessage(err)))
  }, [])

  return (
    <section aria-labelledby="orders-heading">
      <h2 id="orders-heading" className="text-lg font-semibold">Orders</h2>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {orders === null && !error && <p className="mt-4 text-sm text-neutral-500">Loading…</p>}
      {orders?.length === 0 && (
        <EmptyState
          className="mt-4 border border-neutral-200 py-14"
          size="md"
          title={
            <>
              No <em>orders</em> yet
            </>
          }
          message="When you place an order, you'll be able to track it and download the invoice here."
          action={{ label: 'Start shopping', to: '/shop' }}
        />
      )}
      {orders?.length > 0 && (
        <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
          {orders.map((order) => (
            <li key={order._id}>
              <Link to={`/account/orders/${order._id}`} className="flex items-center justify-between gap-4 py-4 hover:bg-neutral-50">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(order.createdAt)} · {order.items.reduce((n, i) => n + i.quantity, 0)} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                  <span className="text-sm font-medium">₹{order.total}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Profile() {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [status, setStatus] = useState({ error: '', saved: false, busy: false })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return setStatus({ error: 'Enter your name' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setStatus({ error: 'Enter a valid email address' })
    setStatus({ busy: true })
    try {
      await api.patch('/users/me', form)
      await refresh()
      setStatus({ saved: true })
    } catch (err) {
      setStatus({ error: errorMessage(err) })
    }
  }

  return (
    <section aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="text-lg font-semibold">Profile</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        <FormField label="Mobile number" hint="Used to sign in">
          <input value={user.phone ? `+91 ${user.phone}` : 'Not added'} disabled className={INPUT_CLASS} />
        </FormField>
        <FormField label="Full name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT_CLASS} />
        </FormField>
        <FormField label="Email" hint="Invoices and order updates are sent here">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={INPUT_CLASS} />
        </FormField>
        <FormError message={status.error} />
        {status.saved && <p role="status" className="text-sm text-green-700">Profile saved.</p>}
        <Button type="submit" variant="secondary" disabled={status.busy}>
          Save profile
        </Button>
      </form>
    </section>
  )
}

function Password() {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })
  const [status, setStatus] = useState({ error: '', saved: false, busy: false })

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.newPassword.length < 6) return setStatus({ error: 'Password must be at least 6 characters' })
    setStatus({ busy: true })
    try {
      await api.patch('/users/me/password', form)
      await refresh()
      setForm({ currentPassword: '', newPassword: '' })
      setStatus({ saved: true })
    } catch (err) {
      setStatus({ error: errorMessage(err) })
    }
  }

  return (
    <section aria-labelledby="password-heading">
      <h2 id="password-heading" className="text-lg font-semibold">{user.hasPassword ? 'Change password' : 'Set a password'}</h2>
      <p className="mt-1 text-sm text-neutral-500">
        {user.hasPassword ? 'Used when you sign in with email.' : 'Optional — lets you sign in with your email as well as your mobile number.'}
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        {user.hasPassword && (
          <FormField label="Current password">
            <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} autoComplete="current-password" className={INPUT_CLASS} />
          </FormField>
        )}
        <FormField label="New password">
          <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} autoComplete="new-password" className={INPUT_CLASS} />
        </FormField>
        <FormError message={status.error} />
        {status.saved && <p role="status" className="text-sm text-green-700">Password saved.</p>}
        <Button type="submit" variant="secondary" disabled={status.busy}>
          Save password
        </Button>
      </form>
    </section>
  )
}
