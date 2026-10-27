import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-900 bg-white/80 backdrop-blur transition-opacity hover:bg-white ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <ChevronUp size={22} strokeWidth={1.25} />
    </button>
  )
}
