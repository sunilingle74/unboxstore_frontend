import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import Gallery from '../components/product/Gallery'
import ColorSelector from '../components/product/ColorSelector'
import SizeSelector from '../components/product/SizeSelector'
import SizeGuideModal from '../components/product/SizeGuideModal'
import QuantityInput from '../components/common/QuantityInput'
import StarRating from '../components/common/StarRating'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { AccordionItem } from '../components/common/Accordion'
import ProductGrid from '../components/shop/ProductGrid'

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isWishlisted, toggle } = useWishlist()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setProduct(null)
    setColor(null)
    setSize(null)
    setQuantity(1)
    setAdded(false)
    window.scrollTo({ top: 0 })

    getProductBySlug(slug).then((p) => {
      if (!p) {
        setLoading(false)
        return
      }
      setProduct(p)
      setColor(p.colors[0]?.name ?? null)
      setLoading(false)
      getRelatedProducts(p).then(setRelated)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid animate-pulse grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="aspect-[3/4] bg-neutral-100" />
          <div className="space-y-4">
            <div className="h-6 w-1/2 bg-neutral-100" />
            <div className="h-4 w-1/4 bg-neutral-100" />
            <div className="h-24 w-full bg-neutral-100" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold">Product not found</p>
        <Button className="mt-6" onClick={() => navigate('/shop')}>
          Back to Shop
        </Button>
      </div>
    )
  }

  const outOfStock = product.stockCount === 0
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null
  const wishlisted = isWishlisted(product.id)

  function handleAddToCart() {
    if (!size) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addItem(product, { size, color, quantity })
    setAdded(true)
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs text-neutral-500">
        <Link to="/" className="hover:text-neutral-900">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-neutral-900">
          {product.category.replace(/-/g, ' ')}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={product.images} productName={product.name} />

        <div className="lg:max-w-md">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            <button
              onClick={() => toggle(product.id)}
              aria-label="Toggle wishlist"
              className="shrink-0 rounded-full border border-neutral-200 p-2.5 hover:border-neutral-900"
            >
              <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700'} />
            </button>
          </div>

          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl font-semibold">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-base text-neutral-400 line-through">₹{product.originalPrice}</span>
                <Badge tone="sale">-{discountPct}%</Badge>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-neutral-600">{product.description}</p>

          <div className="mt-6 flex flex-col gap-6">
            <ColorSelector colors={product.colors} value={color} onChange={setColor} />

            <div>
              <SizeSelector
                sizes={product.sizes}
                value={size}
                onChange={(s) => {
                  setSize(s)
                  setSizeError(false)
                }}
                onOpenGuide={() => setSizeGuideOpen(true)}
              />
              {sizeError && <p className="mt-2 text-xs font-medium text-red-600">Please select a size.</p>}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Quantity</p>
              <QuantityInput value={quantity} onChange={setQuantity} max={Math.max(1, product.stockCount)} />
              {!outOfStock && product.stockCount <= 5 && (
                <p className="mt-2 text-xs font-medium text-amber-700">Only {product.stockCount} left in stock</p>
              )}
            </div>
          </div>

          <Button onClick={handleAddToCart} disabled={outOfStock} size="lg" className="mt-7 w-full">
            {outOfStock ? 'Sold Out' : added ? 'Added to Bag ✓' : 'Add to Bag'}
          </Button>

          <div className="mt-6 grid grid-cols-1 gap-3 border-y border-neutral-200 py-5 text-xs text-neutral-600 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Truck size={16} />
              Free shipping over ₹2,999
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} />
              30-day exchanges
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Secure checkout
            </div>
          </div>

          <div className="mt-2">
            <AccordionItem title="Details" defaultOpen>
              <ul className="list-disc space-y-1 pl-4">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Shipping & Returns">
              Free standard shipping on orders over ₹2,999. Easy 30-day returns and exchanges on unworn items with
              tags attached.
            </AccordionItem>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 text-xl font-bold">You may also like</h2>
          <ProductGrid products={related} loading={false} columns={4} />
        </div>
      )}

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}
