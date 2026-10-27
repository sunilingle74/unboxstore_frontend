import { useEffect, useRef, useState } from 'react'
import Button from '../common/Button'
import FormField, { FormError, INPUT_CLASS } from '../common/FormField'
import { api, errorMessage } from '../../lib/api'

const RESEND_SECONDS = 30

// Two steps: mobile number → 6-digit code. `beforeSend` can veto sending (e.g.
// sign-up validating name/email first); `extra` is posted along with the code.
export default function PhoneOtpForm({ onVerified, beforeSend, extra, sendLabel = 'Send code' }) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('phone')
  const [devCode, setDevCode] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const codeRef = useRef(null)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  async function sendCode(e) {
    e?.preventDefault()
    setError('')
    if (beforeSend && !beforeSend()) return
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    setBusy(true)
    try {
      const res = await api.post('/auth/otp/send', { phone })
      setDevCode(res.data.devCode || null)
      setStep('code')
      setCode('')
      setSecondsLeft(RESEND_SECONDS)
      setTimeout(() => codeRef.current?.focus(), 0)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function verify(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code')
      return
    }
    setBusy(true)
    try {
      const res = await api.post('/auth/otp/verify', { phone, code, ...extra })
      await onVerified(res.data, phone)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (step === 'phone') {
    return (
      <form onSubmit={sendCode} className="space-y-5" noValidate>
        <FormField label="Mobile number">
          <div className="flex">
            <span className="flex items-center rounded-l-lg border border-r-0 border-neutral-200 bg-neutral-50 px-4 text-[15px] text-neutral-600">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="98765 43210"
              className={`${INPUT_CLASS} rounded-l-none`}
              autoFocus
            />
          </div>
        </FormField>
        <FormError message={error} />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Sending…' : sendLabel}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={verify} className="space-y-5" noValidate>
      <p className="text-sm text-neutral-600">
        We sent a 6-digit code to <span className="font-medium text-neutral-900">+91 {phone}</span>.{' '}
        <button type="button" onClick={() => setStep('phone')} className="underline underline-offset-4 hover:opacity-60">
          Change
        </button>
      </p>
      {devCode && (
        <p data-testid="dev-otp" className="border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Dev mode (no SMS provider configured): your code is <strong>{devCode}</strong>
        </p>
      )}
      <FormField label="Verification code">
        <input
          ref={codeRef}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="••••••"
          className={`${INPUT_CLASS} tracking-[0.5em]`}
        />
      </FormField>
      <FormError message={error} />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? 'Verifying…' : 'Verify & continue'}
      </Button>
      <p className="text-center text-sm text-neutral-600">
        {secondsLeft > 0 ? (
          `Resend code in ${secondsLeft}s`
        ) : (
          <button type="button" onClick={sendCode} className="underline underline-offset-4 hover:opacity-60">
            Resend code
          </button>
        )}
      </p>
    </form>
  )
}
