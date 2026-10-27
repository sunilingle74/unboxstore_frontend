import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getFilteredProducts } from '../../services/productService'
import { useCarousel } from '../../hooks/useCarousel'
import HomeProductCard from './HomeProductCard'

const SLIDE_CLASS = 'w-[70%] flex-none snap-start sm:w-[calc((100%-6rem)/4)]'

const TABS = [
  { label: 'Outerwear', categories: ['jackets-and-coats'] },
  { label: 'Fleece', categories: ['hoodies-and-sweatshirts'] },
  { label: 'Essentials', categories: ['t-shirts', 'tops', 'jeans'] },
]

export default function TabbedProducts() {
  const [active, setActive] = useState(0)
  const [results, setResults] = useState({ tab: null, products: [] })
  const { trackRef, canScrollLeft, canScrollRight, scroll, updateArrows } = useCarousel()
  const tab = TABS[active]
  const loading = results.tab !== active

  useEffect(() => {
    let current = true
    getFilteredProducts({ categories: TABS[active].categories }).then((res) => {
      if (current) setResults({ tab: active, products: res })
    })
    return () => {
      current = false
    }
  }, [active])

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 })
    updateArrows()
  }, [results, trackRef, updateArrows])

  return (
    <section className="bg-[#f7f7f7] py-16 font-display sm:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div role="tablist" className="mb-10 flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 sm:mb-12 sm:gap-x-8">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`text-[36px] font-normal leading-none tracking-[-0.04em] transition-colors sm:text-[64px] ${
                i === active ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <div ref={trackRef} className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth sm:gap-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`${SLIDE_CLASS} aspect-[3/4] animate-pulse bg-[#efefef]`} />
                ))
              : results.products.map((product) => (
                  <div key={product.id} className={SLIDE_CLASS}>
                    <HomeProductCard product={product} showAvailability quickAdd />
                  </div>
                ))}
          </div>

          {!loading && (
            <>
              <ArrowButton side="left" disabled={!canScrollLeft} onClick={() => scroll('left')} />
              <ArrowButton side="right" disabled={!canScrollRight} onClick={() => scroll('right')} />
            </>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to={`/shop?category=${tab.categories[0]}`}
            className="border-b border-neutral-900 pb-1 text-[13px] uppercase tracking-[0.16em] hover:opacity-60"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArrowButton({ side, disabled, onClick }) {
  const Icon = side === 'left' ? ArrowLeft : ArrowRight
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? 'Scroll left' : 'Scroll right'}
      className={`absolute top-[38%] hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-white shadow-sm transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:flex ${
        side === 'left' ? 'left-8' : 'right-8'
      }`}
      disabled={disabled}
    >
      <Icon size={18} strokeWidth={1.25} />
    </button>
  )
}
