import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { getFilteredProducts } from '../services/productService'
import { CATEGORIES, getCategoryBySlug } from '../data/categories'
import MobileFilterDrawer from '../components/shop/MobileFilterDrawer'
import SortDropdown from '../components/shop/SortDropdown'
import ProductGrid from '../components/shop/ProductGrid'
import { PRICE_BUCKETS } from '../components/shop/Filters'

const PAGE_SIZE = 12
const QUICK_CATEGORY_SLUGS = ['tops', 't-shirts', 'jeans', 'jackets-and-coats', 'hoodies-and-sweatshirts']
const QUICK_CATEGORIES = QUICK_CATEGORY_SLUGS.map((slug) => getCategoryBySlug(slug)).filter(Boolean)
const COLUMN_OPTIONS = [2, 4, 8]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [allResults, setAllResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [columns, setColumns] = useState(4)

  const categories = useMemo(
    () => (searchParams.get('category') ? searchParams.get('category').split(',') : []),
    [searchParams]
  )
  const sizes = useMemo(
    () => (searchParams.get('sizes') ? searchParams.get('sizes').split(',') : []),
    [searchParams]
  )
  const priceBucket = searchParams.has('price') ? Number(searchParams.get('price')) : null
  const inStockOnly = searchParams.get('inStock') === '1'
  const gender = searchParams.get('gender') || 'all'
  const sort = searchParams.get('sort') || 'featured'

  const updateParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          next.delete(key)
        } else {
          next.set(key, Array.isArray(value) ? value.join(',') : value)
        }
      })
      setSearchParams(next)
      setVisibleCount(PAGE_SIZE)
    },
    [searchParams, setSearchParams]
  )

  function toggleCategory(slug) {
    const next = categories.includes(slug) ? categories.filter((c) => c !== slug) : [...categories, slug]
    updateParams({ category: next })
  }

  function selectQuickCategory(slug) {
    updateParams({ category: slug ? [slug] : [] })
  }

  function toggleSize(size) {
    const next = sizes.includes(size) ? sizes.filter((s) => s !== size) : [...sizes, size]
    updateParams({ sizes: next })
  }

  function setPriceBucket(index) {
    updateParams({ price: priceBucket === index ? null : String(index) })
  }

  function toggleInStock() {
    updateParams({ inStock: inStockOnly ? null : '1' })
  }

  function setGender(next) {
    updateParams({ gender: next === 'all' ? null : next })
  }

  function clearFilters() {
    const kept = {}
    if (sort !== 'featured') kept.sort = sort
    if (gender !== 'all') kept.gender = gender
    setSearchParams(new URLSearchParams(kept))
    setVisibleCount(PAGE_SIZE)
  }

  useEffect(() => {
    setLoading(true)
    const bucket = priceBucket !== null ? PRICE_BUCKETS[priceBucket] : null
    getFilteredProducts({
      categories,
      sizes,
      inStockOnly,
      gender,
      sort,
      minPrice: bucket?.min,
      maxPrice: bucket?.max,
    }).then((res) => {
      setAllResults(res)
      setLoading(false)
    })
  }, [categories, sizes, priceBucket, inStockOnly, gender, sort])

  const visibleProducts = allResults.slice(0, visibleCount)
  const activeCategory = categories.length === 1 ? getCategoryBySlug(categories[0]) : null
  const genderLabel = gender === 'women' ? 'Women' : gender === 'men' ? 'Men' : null

  const filterProps = {
    filters: { categories, sizes, priceBucket, inStockOnly, gender },
    onToggleCategory: toggleCategory,
    onToggleSize: toggleSize,
    onSetPriceBucket: setPriceBucket,
    onToggleInStock: toggleInStock,
    onSetGender: setGender,
    onClear: clearFilters,
  }

  const heading = activeCategory
    ? `${genderLabel ? `${genderLabel} ` : ''}${activeCategory.name}`
    : genderLabel
      ? `Shop ${genderLabel}`
      : 'Shop All'

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{heading}</h1>
        <p className="mt-3 text-sm text-neutral-600 sm:text-base">
          {activeCategory
            ? `Explore our ${activeCategory.name.toLowerCase()} — considered pieces made to last.`
            : 'Explore the full collection. Considered essentials, made to last.'}
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'women', label: 'Women' },
          { value: 'men', label: 'Men' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setGender(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              gender === tab.value
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => selectQuickCategory(null)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            categories.length === 0
              ? 'border-neutral-900 text-neutral-900'
              : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
          }`}
        >
          All Shop
        </button>
        {QUICK_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => selectQuickCategory(cat.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              categories.length === 1 && categories[0] === cat.slug
                ? 'border-neutral-900 text-neutral-900'
                : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <p className="text-sm text-neutral-500">{loading ? 'Loading...' : `${allResults.length} items`}</p>
          <SortDropdown value={sort} onChange={(value) => updateParams({ sort: value === 'featured' ? null : value })} />
        </div>

        <div className="hidden items-center gap-3 text-sm text-neutral-500 sm:flex">
          {COLUMN_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setColumns(n)}
              className={columns === n ? 'font-semibold text-neutral-900 underline underline-offset-4' : 'hover:text-neutral-900'}
            >
              {n === 2 ? 'Two' : n === 4 ? 'Four' : 'Eight'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <ProductGrid products={visibleProducts} loading={loading} columns={columns} />

        {!loading && visibleCount < allResults.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="border border-neutral-900 px-8 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-neutral-900 hover:text-white"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => setFiltersOpen(true)}
        className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-neutral-800"
      >
        <SlidersHorizontal size={16} />
        Filter
      </button>

      <MobileFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        resultCount={allResults.length}
        {...filterProps}
      />
    </div>
  )
}
