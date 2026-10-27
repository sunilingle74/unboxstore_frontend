import { CATEGORIES } from '../../data/categories'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const PRICE_BUCKETS = [
  { label: 'Under ₹75', min: 0, max: 75 },
  { label: '₹75 – ₹150', min: 75, max: 150 },
  { label: '₹150 – ₹250', min: 150, max: 250 },
  { label: '₹250 and above', min: 250, max: Infinity },
]

const GENDERS = [
  { value: 'all', label: 'All' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
]

export default function Filters({
  filters,
  onToggleCategory,
  onSetPriceBucket,
  onToggleSize,
  onToggleInStock,
  onSetGender,
  onClear,
}) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.priceBucket !== null ||
    filters.inStockOnly ||
    (filters.gender && filters.gender !== 'all')

  return (
    <div className="space-y-8">
      {hasActiveFilters && (
        <button onClick={onClear} className="text-xs font-medium underline underline-offset-4">
          Clear all filters
        </button>
      )}

      {onSetGender && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Gender</h3>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.value}
                onClick={() => onSetGender(g.value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  (filters.gender || 'all') === g.value
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => onToggleCategory(cat.slug)}
                className="h-4 w-4 accent-neutral-900"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Price</h3>
        <div className="flex flex-col gap-2">
          {PRICE_BUCKETS.map((bucket, i) => (
            <label key={bucket.label} className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="radio"
                name="price-bucket"
                checked={filters.priceBucket === i}
                onChange={() => onSetPriceBucket(i)}
                className="h-4 w-4 accent-neutral-900"
              />
              {bucket.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onToggleSize(size)}
              className={`h-9 min-w-9 border px-2 text-xs font-medium ${
                filters.sizes.includes(size)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={onToggleInStock}
          className="h-4 w-4 accent-neutral-900"
        />
        In stock only
      </label>
    </div>
  )
}
