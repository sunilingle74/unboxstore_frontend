import { useEffect, useState } from 'react'
import { getNewArrivals } from '../../services/productService'
import { useCarousel } from '../../hooks/useCarousel'
import HomeProductCard from './HomeProductCard'
import CarouselControls from './CarouselControls'

const SLIDE_CLASS = 'w-[70%] flex-none snap-start sm:w-[calc((100%-6rem)/4)]'

export default function JustArrived() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { trackRef, canScrollLeft, canScrollRight, scroll, updateArrows } = useCarousel()

  useEffect(() => {
    let active = true
    getNewArrivals(10).then((res) => {
      if (active) {
        setProducts(res)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(updateArrows, [products, updateArrows])

  if (!loading && products.length === 0) return null

  return (
    <section className="bg-[#f7f7f7] py-16 sm:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-4">
          <h2 className="font-display text-[40px] font-light leading-none tracking-[-0.04em] sm:text-[64px]">
            Just arrived
          </h2>
          <CarouselControls
            label="View all"
            to="/shop?sort=newest"
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            scroll={scroll}
          />
        </div>

        <div ref={trackRef} className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth sm:gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${SLIDE_CLASS} aspect-[3/4] animate-pulse bg-[#efefef]`} />
              ))
            : products.map((product) => (
                <div key={product.id} className={SLIDE_CLASS}>
                  <HomeProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
