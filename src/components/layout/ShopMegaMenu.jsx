import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, FEATURED_LINKS } from '../../data/categories'
import spotlightImage from '../../assets/10055.jpg'
import seasonImage from '../../assets/hero/unboxstorehero2.png'

const PROMOS = [
  { eyebrow: 'Spotlight', title: 'Transient Echoes', to: '/shop?category=jackets-and-coats', image: spotlightImage },
  { eyebrow: 'SS26', title: 'Get ready for the sun', to: '/shop?category=shorts,t-shirts,tops', image: seasonImage },
]

// Dropdown panel anchored under the header (the header must be `relative`).
export default function ShopMegaMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="absolute inset-x-0 top-full hidden border-t border-neutral-200 bg-white text-neutral-900 lg:block">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_1fr_2fr] gap-8 px-8 py-10">
        <MenuColumn heading="Featured" links={FEATURED_LINKS} onClose={onClose} />
        <MenuColumn
          heading="Categories"
          links={CATEGORIES.map((cat) => ({ label: cat.name, to: `/shop?category=${cat.slug}` }))}
          onClose={onClose}
        />

        <div className="grid grid-cols-2 gap-6">
          {PROMOS.map((promo) => (
            <Link
              key={promo.title}
              to={promo.to}
              onClick={onClose}
              className="group relative block aspect-[3/4] max-h-[620px] overflow-hidden bg-neutral-200"
            >
              <img
                src={promo.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/15 px-6 text-center text-white">
                <span className="text-[13px] uppercase tracking-[0.08em]">{promo.eyebrow}</span>
                <span className="mt-2 text-[34px] font-normal leading-[1.1] tracking-[-0.03em] xl:text-[44px]">
                  {promo.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MenuColumn({ heading, links, onClose }) {
  return (
    <div>
      <p className="text-[15px] font-semibold uppercase tracking-[0.04em]">{heading}</p>
      <ul className="mt-6 flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              onClick={onClose}
              className="text-[15px] uppercase underline-offset-[6px] hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
