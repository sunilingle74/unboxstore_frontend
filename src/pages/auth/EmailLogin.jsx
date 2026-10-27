import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'
import Button from '../../components/common/Button'
import FormField, { FormError, INPUT_CLASS } from '../../components/common/FormField'
import { useAuth } from '../../context/AuthContext'
import { api, errorMessage, safeNext } from '../../lib/api'

export default function EmailLogin() {
  const { isAuthenticated, refresh } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(searchParams)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) return <Navigate to={next} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Enter your email and password')
    setBusy(true)
    try {
      await api.post('/auth/login', form)
      await refresh()
      navigate(next, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  const nextQuery = searchParams.get('next') ? `?next=${encodeURIComponent(next)}` : ''
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in with email"
      footer={
        <div className="space-y-2">
          <p>
            Faster with a code? <AuthLink to={`/login${nextQuery}`}>Use your mobile number</AuthLink>
          </p>
          <p>
            New to unboxstore? <AuthLink to={`/signup${nextQuery}`}>Create an account</AuthLink>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField label="Email">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" className={INPUT_CLASS} autoFocus />
        </FormField>
        <FormField label="Password">
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" className={INPUT_CLASS} />
        </FormField>
        <div className="text-right text-sm">
          <AuthLink to="/forgot-password">Forgot password?</AuthLink>
        </div>
        <FormError message={error} />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
