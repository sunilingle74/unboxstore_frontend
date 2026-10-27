import { useEffect, useRef } from 'react'
import { FlaskConical } from 'lucide-react'
import { formatINR } from '../../lib/orders'

// Development stand-in for the Razorpay window. The API only offers it while
// Razorpay keys are missing outside production.
export default function MockPaymentSheet({ amount, option, onSuccess, onFailure }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onFailure()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onFailure])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 font-display">
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mock-payment-title"
        className="relative w-full max-w-[420px] animate-[popIn_.3s_ease-out] rounded-lg bg-white p-8 text-center outline-none"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-amber-800">
          <FlaskConical size={13} /> Test payment
        </span>
        <h2 id="mock-payment-title" className="mt-5 text-[32px] font-normal leading-none tracking-[-0.03em]">
          Pay {formatINR(amount)}
        </h2>
        <p className="mt-2 text-[14px] text-neutral-500">via {option}</p>
        <p className="mt-5 text-[13px] leading-relaxed text-neutral-500">
          Razorpay keys aren&rsquo;t configured, so this screen simulates the payment window. It only appears in
          development.
        </p>
        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={onSuccess}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-neutral-900 text-[12px] uppercase tracking-[0.16em] text-white hover:bg-neutral-700"
          >
            Simulate successful payment
          </button>
          <button
            type="button"
            onClick={onFailure}
            className="flex h-[52px] w-full items-center justify-center rounded-full border border-neutral-900 text-[12px] uppercase tracking-[0.16em] hover:bg-neutral-50"
          >
            Simulate failed payment
          </button>
        </div>
      </div>
    </div>
  )
}
