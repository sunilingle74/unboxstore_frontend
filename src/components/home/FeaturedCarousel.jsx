import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getFeaturedProducts } from '../../services/productService'
import ProductCard from '../shop/ProductCard'
import { useCarousel } from '../../hooks/useCarousel'

export default function FeaturedCarousel({ title = 'Featured Products' }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { trackRef, canScrollLeft, canScrollRight, scroll } = useCarousel()

  useEffect(() => {
    let active = true
    getFeaturedProducts(10).then((res) => {
      if (active) {
        setProducts(res)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="rounded-full border border-neutral-300 p-2 disabled:opacity-30"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="rounded-full border border-neutral-300 p-2 disabled:opacity-30"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
      ) : (
        <div ref={trackRef} className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth">
          {products.map((product) => (
            <div key={product.id} className="w-[46%] flex-none snap-start sm:w-[23%]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
