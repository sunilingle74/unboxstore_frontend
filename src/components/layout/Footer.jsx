import { Link } from 'react-router-dom'
import NewsletterForm from '../newsletter/NewsletterForm'
import { CATEGORIES, FEATURED_LINKS } from '../../data/categories'

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.9987 1.66699H12.4987C11.3936 1.66699 10.3338 2.10598 9.55242 2.88738C8.77102 3.66878 8.33203 4.72859 8.33203 5.83366V8.33366H5.83203V11.667H8.33203V18.3337H11.6654V11.667H14.1654L14.9987 8.33366H11.6654V5.83366C11.6654 5.61265 11.7532 5.40068 11.9094 5.2444C12.0657 5.08812 12.2777 5.00033 12.4987 5.00033H14.9987V1.66699Z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5846 5.41699H14.593M5.83464 1.66699H14.168C16.4692 1.66699 18.3346 3.53247 18.3346 5.83366V14.167C18.3346 16.4682 16.4692 18.3337 14.168 18.3337H5.83464C3.53345 18.3337 1.66797 16.4682 1.66797 14.167V5.83366C1.66797 3.53247 3.53345 1.66699 5.83464 1.66699ZM13.3346 9.47533C13.4375 10.1689 13.319 10.8772 12.9961 11.4995C12.6732 12.1218 12.1623 12.6265 11.536 12.9417C10.9097 13.2569 10.2 13.3667 9.50779 13.2553C8.81557 13.1439 8.1761 12.8171 7.68033 12.3213C7.18457 11.8255 6.85775 11.1861 6.74636 10.4938C6.63497 9.80162 6.74469 9.0919 7.05991 8.46564C7.37512 7.83937 7.87979 7.32844 8.50212 7.00553C9.12445 6.68261 9.83276 6.56415 10.5263 6.66699C11.2337 6.7719 11.8887 7.10154 12.3944 7.60725C12.9001 8.11295 13.2297 8.76789 13.3346 9.47533Z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.33203 6.66699H6.66536V16.6663H3.33203V6.66699ZM5.9987 3.33366C5.9987 4.47292 5.06055 5.41099 3.93203 5.41099C2.80351 5.41099 1.86536 4.47292 1.86536 3.33366C1.86536 2.1944 2.80351 1.25634 3.93203 1.25634C5.06055 1.25634 5.9987 2.1944 5.9987 3.33366ZM7.66536 6.66699H10.9987V8.33366H11.032C11.532 7.42634 12.932 6.66699 14.332 6.66699C17.1654 6.66699 18.332 8.44634 18.332 11.0937V16.6663H14.9987V11.72C14.9987 10.8337 14.9987 9.59301 13.6654 9.59301C12.332 9.59301 12.1654 10.4663 12.1654 11.6337V16.6663H8.83203V6.66699H7.66536Z" />
    </svg>
  )
}

const SOCIALS = [
  { icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/unboxstore.in/' },
  { icon: XIcon, label: 'X', href: 'https://x.com/weunboxhq' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/company/unboxstore/' },
]

const LINK_COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Explore', to: '/explore' },
      { label: 'Contact', to: '/contact' },
      { label: 'Shop All', to: '/shop' },
      { label: 'Cart', to: '/cart' },
    ],
  },
  { heading: 'Featured', links: FEATURED_LINKS },
  {
    heading: 'Shop',
    links: CATEGORIES.map((cat) => ({ label: cat.name, to: `/shop?category=${cat.slug}` })),
  },
]

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'RuPay', 'UPI', 'Razorpay']

export default function Footer() {
  return (
    <footer className="bg-[#111] font-display text-white">
      <div className="mx-auto max-w-[1600px] px-4 pb-14 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Newsletter />

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {LINK_COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">{col.heading}</p>
                <ul className="mt-5 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-[16px] hover:opacity-60">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 items-end gap-8 lg:mt-12 lg:grid-cols-2">
          <div>
            <Link to="/" className="block text-[64px] font-normal leading-none tracking-[-0.05em] sm:text-[88px]">
              unboxstore
            </Link>
            <p className="mt-6 max-w-md text-[16px] text-neutral-200">
              Considered essentials, from tailored outerwear to everyday staples.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition hover:opacity-60"
              >
                <Icon width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-[13px] tracking-[0.04em] text-neutral-400">
            Copyright © {new Date().getFullYear()} unboxstore. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map((method) => (
              <li
                key={method}
                className="rounded-[3px] bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.06em] text-neutral-300"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function Newsletter() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">Newsletter</p>
      <p className="mt-5 text-[17px]">Sign up to receive 10% off your first order</p>
      <div className="mt-6 max-w-[520px]">
        <NewsletterForm source="footer" />
      </div>
    </div>
  )
}
