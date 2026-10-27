import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Badge from '../common/Badge'
import { useWishlist } from '../../context/WishlistContext'

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const { isWishlisted, toggle } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const outOfStock = product.stockCount === 0
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const visibleColors = product.colors.slice(0, 5)
  const extraColors = product.colors.length - visibleColors.length

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              hovered && product.images[1] ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {product.isNewArrival && <Badge tone="dark">New</Badge>}
            {discountPct && <Badge tone="sale">-{discountPct}%</Badge>}
            {outOfStock && <Badge tone="light">Sold Out</Badge>}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              toggle(product.id)
            }}
            aria-label="Toggle wishlist"
            className="absolute right-2 top-2 rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700'} />
          </button>
        </div>

        <div className="mt-3 flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-neutral-900">{product.name}</p>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-medium">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>

        {visibleColors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {visibleColors.map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="h-4 w-4 rounded-full border border-neutral-200"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {extraColors > 0 && <span className="text-xs text-neutral-500">+{extraColors}</span>}
          </div>
        )}
      </Link>
    </div>
  )
}
