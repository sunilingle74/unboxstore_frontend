import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NewsletterForm from './NewsletterForm'
import popupImage from '../../assets/finalproducts/10128.jpg'

const STORAGE_KEY = 'newsletter:popup'
const DELAY_MS = 6000
// Never interrupt sign-in or buying.
const QUIET_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/checkout', '/order', '/cart']

function alreadyHandled() {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return true
  }
}

function remember(outcome) {
  try {
    window.localStorage.setItem(STORAGE_KEY, outcome)
  } catch {
    // storage unavailable — the popup may show again next visit
  }
}

export default function NewsletterPopup() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const dialogRef = useRef(null)
  const quiet = QUIET_PATHS.some((p) => pathname.startsWith(p))

  const close = useCallback(() => {
    if (!subscribed) remember('dismissed')
    setOpen(false)
  }, [subscribed])

  useEffect(() => {
    if (quiet || alreadyHandled()) return
    const t = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [quiet])

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open || quiet) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-display">
      <div className="absolute inset-0 animate-[fadeIn_.3s_ease-out] bg-black/45" onClick={close} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-[550px] animate-[popIn_.35s_ease-out] overflow-y-auto bg-white outline-none"
      >
        <img src={popupImage} alt="" className="aspect-[3/2] w-full object-cover grayscale" />
        <div className="px-6 pb-12 pt-10 text-center sm:px-12">
          <h2
            id="newsletter-popup-title"
            className="text-[44px] font-normal leading-[0.95] tracking-[-0.04em] sm:text-[56px]"
          >
            <em className="font-serif font-normal tracking-normal">Sign up</em> for our newsletter
          </h2>
          <p className="mt-5 text-[16px]">Stay informed about new collections and discounts</p>

          <div className="mt-8 text-left">
            <NewsletterForm
              source="popup"
              bordered
              onSubscribed={() => {
                setSubscribed(true)
                remember('subscribed')
              }}
            />
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-10 border-b border-neutral-900 pb-1 text-[13px] uppercase tracking-[0.2em] hover:opacity-60"
          >
            {subscribed ? 'Continue shopping' : 'No thanks'}
          </button>
        </div>
      </div>
    </div>
  )
}
