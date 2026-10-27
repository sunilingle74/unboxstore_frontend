import EmptyState from '../components/common/EmptyState'
import ProductGrid from '../components/shop/ProductGrid'
import { useWishlist } from '../context/WishlistContext'
import { MOCK_PRODUCTS } from '../data/mockProducts'

export default function Wishlist() {
  const { productIds } = useWishlist()
  const products = MOCK_PRODUCTS.filter((p) => productIds.includes(p.id))

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-[34px] font-normal tracking-[-0.03em] sm:text-[44px]">Wishlist</h1>
      {products.length === 0 ? (
        <EmptyState
          className="py-24"
          title={
            <>
              Nothing <em>saved</em> yet
            </>
          }
          message="Tap the heart on any product to keep it here for later."
          action={{ label: 'Explore collections', to: '/explore' }}
        />
      ) : (
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  )
}
