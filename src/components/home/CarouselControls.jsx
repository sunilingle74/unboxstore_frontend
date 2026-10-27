import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// "VIEW ALL" underlined link + bare chevrons, used beside home section headings.
export default function CarouselControls({ label, to, canScrollLeft, canScrollRight, scroll }) {
  return (
    <div className="flex items-center gap-8 font-display">
      <Link
        to={to}
        className="border-b border-neutral-900 pb-1 text-[12px] uppercase tracking-[0.16em] hover:opacity-60 sm:text-[13px]"
      >
        {label}
      </Link>
      <div className="hidden items-center gap-6 sm:flex">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="disabled:opacity-25"
        >
          <ChevronLeft size={18} strokeWidth={1.25} />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className="disabled:opacity-25"
        >
          <ChevronRight size={18} strokeWidth={1.25} />
        </button>
      </div>
    </div>
  )
}
