import { Minus, Plus } from 'lucide-react'

export default function QuantityInput({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const dims = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'

  function step(delta) {
    const next = value + delta
    if (next >= min && next <= max) onChange(next)
  }

  return (
    <div className="inline-flex items-center border border-neutral-300">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= min}
        className={`flex ${dims} items-center justify-center disabled:opacity-30`}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={value >= max}
        className={`flex ${dims} items-center justify-center disabled:opacity-30`}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
