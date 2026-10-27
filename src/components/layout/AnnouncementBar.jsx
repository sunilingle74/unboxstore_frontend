import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag } from 'lucide-react'

// End of the current drop; the countdown hides itself once this passes.
const DROP_ENDS_AT = new Date('2026-12-31T23:59:59+05:30').getTime()

function timeLeft() {
  const ms = DROP_ENDS_AT - Date.now()
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${Math.floor(s / 86400)}D | ${pad(Math.floor(s / 3600) % 24)}H | ${pad(Math.floor(s / 60) % 60)}M | ${pad(s % 60)}S`
}

export default function AnnouncementBar() {
  const [countdown, setCountdown] = useState(timeLeft)

  useEffect(() => {
    const timer = setInterval(() => setCountdown(timeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[#111] font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
      <div className="mx-auto flex h-10 max-w-[1600px] items-center justify-center px-4 sm:px-6 lg:justify-between lg:px-8">
        <div className="hidden items-center gap-6 lg:flex">
          <span>India · INR ₹</span>
          <Link to="/contact" className="hover:text-white/70">
            Our Stores
          </Link>
        </div>
        <p className="flex items-center gap-2">
          <Tag size={12} />
          Welcome to our store
        </p>
        {countdown ? (
          <Link to="/shop?sort=newest" className="hidden items-center gap-5 hover:text-white/70 lg:flex">
            <span className="flex items-center gap-2">
              <Tag size={12} />
              New products
            </span>
            <span className="tabular-nums">Ends in {countdown}</span>
          </Link>
        ) : (
          <span className="hidden lg:block" />
        )}
      </div>
    </div>
  )
}
