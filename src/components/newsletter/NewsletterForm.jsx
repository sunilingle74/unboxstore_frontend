import { useState } from 'react'
import { api, errorMessage } from '../../lib/api'

// Email field with an inline SUBSCRIBE button, shared by the footer and the popup.
export default function NewsletterForm({ source, onSubscribed, bordered = false }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ busy: false, error: '', done: false })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ error: 'Enter a valid email address' })
      return
    }
    setStatus({ busy: true })
    try {
      await api.post('/newsletter', { email, source })
      setStatus({ done: true })
      setEmail('')
      onSubscribed?.()
    } catch (err) {
      setStatus({ error: errorMessage(err) })
    }
  }

  if (status.done) {
    return (
      <p role="status" className="text-[15px]">
        You're on the list — check your inbox for 10% off your first order.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className={`flex items-center rounded-lg bg-white pl-5 pr-2 text-neutral-900 ${bordered ? 'border border-neutral-200' : ''}`}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          autoComplete="email"
          className="h-[60px] min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-500"
        />
        <button
          type="submit"
          disabled={status.busy}
          className="px-3 text-[13px] uppercase tracking-[0.2em] hover:opacity-60 disabled:opacity-40"
        >
          Subscribe
        </button>
      </div>
      {status.error && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {status.error}
        </p>
      )}
    </form>
  )
}
