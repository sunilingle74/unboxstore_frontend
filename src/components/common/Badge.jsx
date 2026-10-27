const TONES = {
  dark: 'bg-neutral-900 text-white',
  sale: 'bg-red-600 text-white',
  light: 'bg-white text-neutral-900 border border-neutral-200',
  warn: 'bg-amber-100 text-amber-800',
}

export default function Badge({ tone = 'dark', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
