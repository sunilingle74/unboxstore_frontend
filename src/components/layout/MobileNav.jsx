import { Link } from 'react-router-dom'
import Drawer from '../common/Drawer'
import { CATEGORIES, FEATURED_LINKS } from '../../data/categories'

export default function MobileNav({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu" widthClass="max-w-xs">
      <nav className="flex flex-col px-2 py-2">
        <Link to="/shop?gender=women" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          Women
        </Link>
        <Link to="/shop?gender=men" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          Men
        </Link>
        <Link to="/shop?sort=newest" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          New Arrivals
        </Link>
        <Link to="/shop" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          Shop All
        </Link>
        <Link to="/explore" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          Explore
        </Link>
        <Link to="/about" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          About
        </Link>
        <Link to="/contact" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          Contact
        </Link>
        <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Featured
        </p>
        {FEATURED_LINKS.map((link) => (
          <Link key={link.label} to={link.to} onClick={onClose} className="px-3 py-2.5 text-sm text-neutral-700">
            {link.label}
          </Link>
        ))}
        <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Categories
        </p>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            onClick={onClose}
            className="px-3 py-2.5 text-sm text-neutral-700"
          >
            {cat.name}
          </Link>
        ))}
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <Link to="/account" onClick={onClose} className="px-3 py-2.5 text-sm font-medium">
            Account
          </Link>
          <Link to="/wishlist" onClick={onClose} className="px-3 py-2.5 text-sm font-medium">
            Wishlist
          </Link>
        </div>
      </nav>
    </Drawer>
  )
}
