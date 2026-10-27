import { useEffect, useRef, useState } from 'react'
import img1 from '../../assets/carsouselimg1.jpg'
import img2 from '../../assets/carsouselimg2.jpg'
import img3 from '../../assets/carsouselimg3.jpg'
import img4 from '../../assets/carsouselimg4.jpg'
import img5 from '../../assets/carsouselimg5.jpg'

const IMAGES = [img1, img2, img3, img4, img5]
const LOOP_IMAGES = [...IMAGES, ...IMAGES]
const SPEED = 0.6 // px per frame

export default function LifestyleCarousel() {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let frame

    function step() {
      if (!pausedRef.current) {
        el.scrollLeft += SPEED
        const loopPoint = el.scrollWidth / 2
        if (el.scrollLeft >= loopPoint) {
          el.scrollLeft -= loopPoint
        }
      }
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [])

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="py-16">
      <div
        ref={trackRef}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
        className="no-scrollbar flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8"
      >
        {LOOP_IMAGES.map((img, i) => (
          <div key={i} className="aspect-[4/5] w-[70%] flex-none overflow-hidden bg-neutral-100 sm:w-[calc(20%-13px)]">
            <img src={img} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-md px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Join Newsletter</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every
          week.
        </p>
        <form onSubmit={handleSubscribe} className="mt-6 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
          <button className="bg-neutral-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-700">
            Join
          </button>
        </form>
        {subscribed && <p className="mt-3 text-xs text-neutral-600">Thanks for subscribing!</p>}
      </div>
    </section>
  )
}
