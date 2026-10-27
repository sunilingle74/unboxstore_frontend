const OPTIONS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'newest', label: 'Newest First' },
  { value: 'bestsellers', label: 'Bestsellers' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export default function SortDropdown({ value, onChange }) {
  const activeLabel = OPTIONS.find((opt) => opt.value === value)?.label || OPTIONS[0].label

  return (
    <div className="relative inline-flex items-center text-sm text-neutral-700">
      <span>
        Sorted by <span className="font-semibold text-neutral-900">{activeLabel}</span> +
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
