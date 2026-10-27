import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'
import Button from '../../components/common/Button'
import FormField, { FormError, INPUT_CLASS } from '../../components/common/FormField'
import { useAuth } from '../../context/AuthContext'
import { api, errorMessage } from '../../lib/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { refresh } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    if (form.password !== form.confirm) return setError("Passwords don't match")
    setBusy(true)
    try {
      await api.post('/auth/reset-password', { token, password: form.password })
      await refresh()
      navigate('/account', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Reset link missing" subtitle="Open the link from your email again, or request a new one.">
        <AuthLink to="/forgot-password">Request a new link</AuthLink>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout eyebrow="Account help" title="Choose a new password">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField label="New password" hint="At least 6 characters">
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" className={INPUT_CLASS} autoFocus />
        </FormField>
        <FormField label="Confirm password">
          <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" className={INPUT_CLASS} />
        </FormField>
        <FormError message={error} />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Saving…' : 'Save password & sign in'}
        </Button>
        {error && (
          <p className="text-sm">
            <AuthLink to="/forgot-password">Request a new link</AuthLink>
          </p>
        )}
      </form>
    </AuthLayout>
  )
}
