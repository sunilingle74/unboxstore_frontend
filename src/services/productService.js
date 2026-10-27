import { MOCK_PRODUCTS } from '../data/mockProducts'
import { CATEGORIES } from '../data/categories'

// Simulated network layer. Swap the body of each function for a real
// fetch()/axios call against the Node/Express API once Phase 2 lands —
// callers only ever depend on the returned Promise shape below.
const LATENCY_MS = 350

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

export function getCategories() {
  return delay(CATEGORIES)
}

export function getAllProducts() {
  return delay(MOCK_PRODUCTS)
}

export function getProductBySlug(slug) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
  return delay(product ?? null)
}

export function getFeaturedProducts(limit = 8) {
  return delay(MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit))
}

export function getNewArrivals(limit = 8) {
  return delay(MOCK_PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit))
}

export function getRelatedProducts(product, limit = 4) {
  if (!product) return delay([])
  const related = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, limit)
  return delay(related)
}

export function searchProducts(query, gender) {
  const q = query.trim().toLowerCase()
  if (!q) return delay([])
  let results = MOCK_PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.category.includes(q)
  )
  if (gender && gender !== 'all') {
    results = results.filter((p) => p.gender === gender || p.gender === 'unisex')
  }
  return delay(results.slice(0, 8))
}

/**
 * Query-param shaped filtering, mirroring how a real backend list endpoint
 * (e.g. GET /api/products?categories=a,b&minPrice=&maxPrice=&sizes=&sort=)
 * would be called.
 */
export function getFilteredProducts({
  categories = [],
  minPrice,
  maxPrice,
  sizes = [],
  inStockOnly = false,
  gender,
  sort = 'featured',
} = {}) {
  let results = [...MOCK_PRODUCTS]

  if (gender && gender !== 'all') {
    results = results.filter((p) => p.gender === gender || p.gender === 'unisex')
  }
  if (categories.length) {
    results = results.filter((p) => categories.includes(p.category))
  }
  if (typeof minPrice === 'number') {
    results = results.filter((p) => p.price >= minPrice)
  }
  if (typeof maxPrice === 'number') {
    results = results.filter((p) => p.price <= maxPrice)
  }
  if (sizes.length) {
    results = results.filter((p) => p.sizes.some((s) => sizes.includes(s)))
  }
  if (inStockOnly) {
    results = results.filter((p) => p.stockCount > 0)
  }

  switch (sort) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'bestsellers':
      results.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'newest':
      results.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival))
      break
    case 'featured':
    default:
      results.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
      break
  }

  return delay(results)
}
