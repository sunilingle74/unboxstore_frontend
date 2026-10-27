import ProductCard from './ProductCard'
import EmptyState from '../common/EmptyState'

const COLUMN_CLASSES = {
  2: 'lg:grid-cols-2',
  4: 'lg:grid-cols-4',
  8: 'lg:grid-cols-8',
}

export default function ProductGrid({ products, loading, columns = 4 }) {
  const gridClass = `grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 ${COLUMN_CLASSES[columns] || COLUMN_CLASSES[4]}`

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-neutral-100" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        className="py-24"
        size="md"
        title={
          <>
            It&rsquo;s a little
              <br />
              <em>empty</em> here
          </>
        }
        message="Nothing matches these filters yet. Try clearing a few, or explore our collections."
        action={{ label: 'Explore collections', to: '/explore' }}
      />
    )
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
