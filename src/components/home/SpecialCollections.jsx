import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/categories'
import { MOCK_PRODUCTS } from '../../data/mockProducts'
import { useCarousel } from '../../hooks/useCarousel'
import CarouselControls from './CarouselControls'
import jacketsCoatsImage from '../../assets/10043.jpg'
import hoodiesImage from '../../assets/10088.jpg'
import topsImage from '../../assets/10071.jpg'
import tshirtsImage from '../../assets/10065.jpg'
import jeansImage from '../../assets/10058.jpg'

const COLLECTIONS = [
  { slug: 'jackets-and-coats', image: jacketsCoatsImage },
  { slug: 'hoodies-and-sweatshirts', image: hoodiesImage },
  { slug: 'tops', image: topsImage },
  { slug: 't-shirts', image: tshirtsImage },
  { slug: 'jeans', image: jeansImage },
]

function countFor(slug) {
  return MOCK_PRODUCTS.filter((p) => p.category === slug).length
}

export default function SpecialCollections() {
  const { trackRef, canScrollLeft, canScrollRight, scroll } = useCarousel()

  return (
    <section className="bg-[#f7f7f7] py-16 font-display sm:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <h2 className="text-[40px] font-light leading-none tracking-[-0.04em] sm:text-[64px]">
            Our <em className="font-serif font-normal tracking-normal">special</em> collections
          </h2>
          <CarouselControls
            label="Explore all"
            to="/shop"
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            scroll={scroll}
          />
        </div>

        <div ref={trackRef} className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth sm:gap-8">
          {COLLECTIONS.map(({ slug, image }) => {
            const category = CATEGORIES.find((c) => c.slug === slug)
            return (
              <Link
                key={slug}
                to={`/shop?category=${slug}`}
                aria-label={`${category.name}, ${countFor(slug)} products`}
                className="group w-[80%] flex-none snap-start sm:w-[calc((100%-4rem)/3)]"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#e9e9e9]">
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-center text-[30px] font-normal leading-none tracking-[-0.03em] sm:text-[44px]">
                  {category.name}
                  <sup aria-hidden="true" className="ml-1 align-super text-[12px] tracking-[0.1em]">{countFor(slug)}</sup>
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
