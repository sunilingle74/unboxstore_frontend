import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'
import PhoneOtpForm from '../../components/auth/PhoneOtpForm'
import FormField, { FormError, INPUT_CLASS } from '../../components/common/FormField'
import { useAuth } from '../../context/AuthContext'
import { safeNext } from '../../lib/api'

export default function Signup() {
  const { isAuthenticated, refresh } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(searchParams)
  const [form, setForm] = useState({ name: '', email: '' })
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to={next} replace />

  function validate() {
    setError('')
    if (!form.name.trim()) {
      setError('Enter your name')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid email address')
      return false
    }
    return true
  }

  async function handleVerified() {
    await refresh()
    navigate(next, { replace: true })
  }

  const nextQuery = searchParams.get('next') ? `?next=${encodeURIComponent(next)}` : ''
  return (
    <AuthLayout
      eyebrow="Join unboxstore"
      title="Create an account"
      subtitle="Sign in with your mobile number. We'll send order updates and invoices to your email."
      footer={
        <p>
          Already have an account? <AuthLink to={`/login${nextQuery}`}>Sign in</AuthLink>
        </p>
      }
    >
      <div className="space-y-5">
        <FormField label="Full name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className={INPUT_CLASS} />
        </FormField>
        <FormField label="Email" hint="For order confirmations and invoices">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" className={INPUT_CLASS} />
        </FormField>
        <FormError message={error} />
        <PhoneOtpForm
          beforeSend={validate}
          extra={{ name: form.name.trim(), email: form.email.trim() }}
          onVerified={handleVerified}
          sendLabel="Verify mobile number"
        />
      </div>
    </AuthLayout>
  )
}
