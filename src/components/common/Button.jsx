const VARIANTS = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-700 disabled:bg-neutral-300',
  secondary: 'bg-white text-neutral-900 border border-neutral-900 hover:bg-neutral-100',
  ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-100',
  danger: 'bg-transparent text-red-600 hover:bg-red-50',
}

const SIZES = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-sm px-7 py-3.5',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 font-medium tracking-wide uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
