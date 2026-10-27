export default function SizeSelector({ sizes, value, onChange, onOpenGuide }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Size</span>
        <button onClick={onOpenGuide} className="text-xs font-medium underline underline-offset-4">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            aria-pressed={value === size}
            className={`h-10 min-w-10 border px-3 text-sm font-medium ${
              value === size
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
