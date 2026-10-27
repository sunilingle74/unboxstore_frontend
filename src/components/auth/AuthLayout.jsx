import { Link } from 'react-router-dom'
import sideImage from '../../assets/finalproducts/10194.jpg'

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid max-w-[1600px] lg:min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-neutral-200 lg:block">
        <img src={sideImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{eyebrow}</p>}
          <h1 className="mt-2 font-display text-[34px] font-normal leading-tight tracking-[-0.03em] sm:text-[40px]">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-600">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="font-medium text-neutral-900 underline underline-offset-4 hover:opacity-60">
      {children}
    </Link>
  )
}
