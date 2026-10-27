import { useState } from 'react'
import AuthLayout, { AuthLink } from '../../components/auth/AuthLayout'
import Button from '../../components/common/Button'
import FormField, { FormError, INPUT_CLASS } from '../../components/common/FormField'
import { api, errorMessage } from '../../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address')
    setBusy(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Account help"
      title="Forgot your password?"
      subtitle={sent ? null : "Enter your account email and we'll send you a link to choose a new one."}
      footer={
        <div className="space-y-2">
          <p>
            Remembered it? <AuthLink to="/login/email">Back to sign in</AuthLink>
          </p>
          <p>
            You can always <AuthLink to="/login">sign in with your mobile number</AuthLink> instead.
          </p>
        </div>
      }
    >
      {sent ? (
        <p role="status" className="border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm">
          If an account exists for <strong>{email}</strong>, a reset link is on its way. It expires in 30 minutes.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormField label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={INPUT_CLASS} autoFocus />
          </FormField>
          <FormError message={error} />
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
