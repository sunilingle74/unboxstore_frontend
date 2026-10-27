import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronUp, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import MobileNav from './MobileNav'
import ShopMegaMenu from './ShopMegaMenu'
import SearchOverlay from './SearchOverlay'

// Keep in sync with the home Hero's negative top margin, which pulls the
// image up underneath the transparent header.
const NAVBAR_HEIGHT_CLASS = 'h-[72px]'

const NAV_LINKS = [
  { label: 'Women', to: '/shop?gender=women' },
  { label: 'Men', to: '/shop?gender=men' },
  { label: 'New Arrivals', to: '/shop?sort=newest' },
  { label: 'Explore', to: '/explore' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { itemCount, setCartOpen } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = pathname === '/' && !scrolled && !hovered && !shopMenuOpen
  const tone = transparent ? 'text-white' : 'text-neutral-900'

  return (
    <>
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          setShopMenuOpen(false)
        }}
        className={`sticky top-0 z-40 font-display transition-colors duration-300 ${tone} ${
          transparent ? 'border-b border-white/15 bg-transparent' : 'border-b border-neutral-200 bg-white'
        }`}
      >
        <div
          className={`mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8 ${NAVBAR_HEIGHT_CLASS}`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="-ml-2 p-2 lg:hidden"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <nav className="hidden items-center gap-8 text-[12px] uppercase tracking-[0.16em] lg:flex">
              <button
                onClick={() => setShopMenuOpen((v) => !v)}
                onMouseEnter={() => setShopMenuOpen(true)}
                aria-expanded={shopMenuOpen}
                className={`flex items-center gap-1 border-b pb-1 pt-[5px] uppercase ${
                  shopMenuOpen ? 'border-current' : 'border-transparent hover:opacity-60'
                }`}
              >
                Shop {shopMenuOpen ? <ChevronUp size={13} strokeWidth={1.5} /> : <ChevronDown size={13} strokeWidth={1.5} />}
              </button>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onMouseEnter={() => setShopMenuOpen(false)}
                  className="hover:opacity-60"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link to="/" className="text-[28px] font-normal leading-none tracking-[-0.04em] sm:text-[34px]">
            unboxstore
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-2 hover:opacity-60">
              <Search size={22} strokeWidth={1.5} />
            </button>
            <Link to="/account" aria-label="Account" className="hidden p-2 hover:opacity-60 sm:block">
              <User size={22} strokeWidth={1.5} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hidden p-2 hover:opacity-60 sm:block">
              <Heart size={22} strokeWidth={1.5} />
              {wishlistCount > 0 && <CountDot count={wishlistCount} transparent={transparent} />}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative p-2 hover:opacity-60"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {itemCount > 0 && <CountDot count={itemCount} transparent={transparent} />}
            </button>
          </div>
        </div>

        <ShopMegaMenu open={shopMenuOpen} onClose={() => setShopMenuOpen(false)} />
      </header>

      {shopMenuOpen && (
        <div
          onClick={() => setShopMenuOpen(false)}
          className="fixed inset-0 z-30 hidden bg-black/25 lg:block"
          aria-hidden="true"
        />
      )}

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function CountDot({ count, transparent }) {
  return (
    <span
      className={`absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
        transparent ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
      }`}
    >
      {count}
    </span>
  )
}
