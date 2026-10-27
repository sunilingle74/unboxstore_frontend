import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'
import PhoneOtpForm from '../../components/auth/PhoneOtpForm'
import Button from '../../components/common/Button'
import FormField, { FormError, INPUT_CLASS } from '../../components/common/FormField'
import { useAuth } from '../../context/AuthContext'
import { api, errorMessage, safeNext } from '../../lib/api'

export default function Login() {
  const { isAuthenticated, refresh } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(searchParams)
  const [signupToken, setSignupToken] = useState(null)

  if (isAuthenticated && !signupToken) return <Navigate to={next} replace />

  async function handleVerified(data) {
    if (data.needsProfile) {
      setSignupToken(data.signupToken)
      return
    }
    await refresh()
    navigate(next, { replace: true })
  }

  if (signupToken) {
    return (
      <AuthLayout
        eyebrow="Almost there"
        title="Tell us about you"
        subtitle="Your number is verified. We'll send order confirmations and invoices to this email."
      >
        <ProfileForm signupToken={signupToken} onDone={async () => {
          await refresh()
          navigate(next, { replace: true })
        }} />
      </AuthLayout>
    )
  }

  const nextQuery = searchParams.get('next') ? `?next=${encodeURIComponent(next)}` : ''
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Use your mobile number — we'll text you a one-time code."
      footer={
        <div className="space-y-2">
          <p>
            Prefer a password? <AuthLink to={`/login/email${nextQuery}`}>Sign in with email</AuthLink>
          </p>
          <p>
            New to unboxstore? <AuthLink to={`/signup${nextQuery}`}>Create an account</AuthLink>
          </p>
        </div>
      }
    >
      <PhoneOtpForm onVerified={handleVerified} />
    </AuthLayout>
  )
}

function ProfileForm({ signupToken, onDone }) {
  const [form, setForm] = useState({ name: '', email: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Enter your name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address')
    setBusy(true)
    try {
      await api.post('/auth/otp/complete', { signupToken, ...form })
      await onDone()
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField label="Full name">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className={INPUT_CLASS} autoFocus />
      </FormField>
      <FormField label="Email" hint="For order confirmations and invoices">
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" className={INPUT_CLASS} />
      </FormField>
      <FormError message={error} />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
