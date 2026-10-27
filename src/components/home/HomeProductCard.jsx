import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'

function badgeFor(product) {
  if (product.stockCount === 0) return 'Sold out'
  if (product.stockCount < 6) return 'Last few'
  if (product.isNewArrival) return 'New'
  return null
}

export default function HomeProductCard({ product, showAvailability = false, quickAdd = false }) {
  const { addItem } = useCart()
  const badge = badgeFor(product)
  const soldOut = product.stockCount === 0
  const href = `/product/${product.slug}`

  return (
    <div className="group font-display">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#efefef]">
        <Link to={href} className="absolute inset-0" aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              product.images[1] ? 'group-hover:opacity-0' : ''
            }`}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-[4px] bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-900">
            {badge}
          </span>
        )}

        {quickAdd && !soldOut && (
          <button
            onClick={() => addItem(product, { size: product.sizes[0], color: product.colors[0]?.name })}
            aria-label={`Quick add ${product.name}`}
            className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-md bg-neutral-900 text-white opacity-0 transition-opacity hover:bg-neutral-700 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Plus size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <Link to={href} className="block">
        <p className="mt-4 text-[13px] font-medium uppercase tracking-[0.06em] text-neutral-900">{product.name}</p>
        <p className="mt-1.5 text-[13px] tracking-wide">
          {product.originalPrice && (
            <span className="mr-1.5 text-neutral-900 line-through">₹{product.originalPrice}</span>
          )}
          <span className={product.originalPrice ? 'text-[#b2584d]' : 'text-neutral-900'}>₹{product.price}</span>
        </p>
        {showAvailability && (
          <p className="mt-4 text-[13px] text-neutral-500">Available in {product.sizes.length} sizes</p>
        )}
      </Link>
    </div>
  )
}
