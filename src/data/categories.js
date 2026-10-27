export const CATEGORIES = [
  { name: 'Tops', slug: 'tops' },
  { name: 'Jeans', slug: 'jeans' },
  { name: 'Shorts', slug: 'shorts' },
  { name: 'T-Shirts', slug: 't-shirts' },
  { name: 'Bottoms', slug: 'bottoms' },
  { name: 'Sweatpants', slug: 'sweatpants' },
  { name: 'Jackets & Coats', slug: 'jackets-and-coats' },
  { name: 'Hoodies & Sweatshirts', slug: 'hoodies-and-sweatshirts' },
]

// Curated shop views shown alongside categories in the Shop menu.
export const FEATURED_LINKS = [
  { label: 'New', to: '/shop?sort=newest' },
  { label: 'Bestsellers', to: '/shop?sort=bestsellers' },
  { label: 'Basics', to: '/shop?category=t-shirts,tops,sweatpants' },
]

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug)
}
