export const INPUT_CLASS =
  'h-[52px] w-full rounded-lg border border-neutral-200 bg-white px-4 text-[15px] outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500'

// Hints and errors sit outside the <label> so the field's accessible name is just its label.
export default function FormField({ label, error, hint, children, className = '' }) {
  return (
    <div className={`text-sm ${className}`}>
      <label className="block">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-neutral-600">{label}</span>
        {children}
      </label>
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function FormError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  )
}
