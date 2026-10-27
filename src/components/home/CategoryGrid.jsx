import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/categories'
import { MOCK_PRODUCTS } from '../../data/mockProducts'

// Ordered deliberately: the first entry becomes the large bento tile.
const FEATURED_SLUGS = ['jackets-and-coats', 'jeans', 'tops', 'hoodies-and-sweatshirts', 't-shirts']

// One tall/wide span per position keeps the grid from feeling like a plain uniform table.
const SPANS = [
  'sm:col-span-2 sm:row-span-2',
  'sm:row-span-2',
  '',
  '',
  'sm:col-span-2',
  '',
]

function imageFor(slug) {
  return MOCK_PRODUCTS.find((p) => p.category === slug)?.images[0]
}

export default function CategoryGrid() {
  const featured = FEATURED_SLUGS.map((slug) => CATEGORIES.find((c) => c.slug === slug)).filter(Boolean)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Shop by Category</h2>
        <Link to="/shop" className="text-sm font-medium underline underline-offset-4">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:auto-rows-[180px] sm:grid-cols-4">
        {featured.map((cat, i) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className={`group relative overflow-hidden bg-neutral-100 ${SPANS[i] || ''} aspect-[3/4] sm:aspect-auto`}
          >
            <img
              src={imageFor(cat.slug)}
              alt={cat.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            <p className="absolute bottom-3 left-3 text-sm font-semibold text-white sm:bottom-4 sm:left-4 sm:text-base">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
