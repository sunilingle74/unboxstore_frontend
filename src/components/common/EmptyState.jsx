import { Link } from 'react-router-dom'

// "It's a little *empty* here" — the shared empty / not-found treatment.
// `title` may contain an <em> for the serif-italic accent word.
export default function EmptyState({ title, message, action, size = 'lg', as: Heading = 'h2', className = '' }) {
  const titleSize = size === 'lg' ? 'text-[44px] sm:text-[64px]' : 'text-[40px] sm:text-[52px]'

  return (
    <div className={`flex flex-col items-center justify-center px-6 text-center font-display ${className}`}>
      <Heading className={`max-w-[12ch] font-normal leading-[1.05] tracking-[-0.04em] [&_em]:font-serif [&_em]:font-normal [&_em]:tracking-normal ${titleSize}`}>
        {title}
      </Heading>
      {message && <p className="mt-6 max-w-sm text-[15px] text-neutral-500">{message}</p>}
      {action && <PillButton {...action} className="mt-10" />}
    </div>
  )
}

export function PillButton({ label, to, onClick, className = '' }) {
  const classes = `inline-flex items-center justify-center rounded-full border border-neutral-900 px-8 py-4 text-[12px] uppercase tracking-[0.16em] transition-colors hover:bg-neutral-900 hover:text-white ${className}`
  return to ? (
    <Link to={to} onClick={onClick} className={classes}>
      {label}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {label}
    </button>
  )
}
