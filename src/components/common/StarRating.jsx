import { Star } from 'lucide-react'

export default function StarRating({ rating, reviewCount, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= Math.round(rating) ? 'fill-neutral-900 text-neutral-900' : 'fill-neutral-200 text-neutral-200'}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-neutral-500">({reviewCount})</span>
      )}
    </div>
  )
}
