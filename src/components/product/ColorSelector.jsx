export default function ColorSelector({ colors, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Color{value ? `: ${value}` : ''}
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onChange(color.name)}
            aria-label={color.name}
            title={color.name}
            className={`h-9 w-9 rounded-full border-2 ${
              value === color.name ? 'border-neutral-900' : 'border-transparent'
            }`}
          >
            <span
              className="block h-full w-full rounded-full border border-black/10"
              style={{ backgroundColor: color.hex }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
