import { Link } from 'react-router-dom'
import { EXPLORE_COLLECTIONS } from '../data/explore'

export default function Explore() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-14 font-display sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-center text-[12px] uppercase tracking-[0.12em]">
        <Link to="/" className="border-b border-neutral-400 pb-0.5 text-neutral-500 hover:text-neutral-900">
          Home
        </Link>
        <span className="mx-3">/</span>
        <span aria-current="page">Collections</span>
      </nav>
      <h1 className="mt-10 text-center text-[48px] font-normal leading-none tracking-[-0.04em] sm:text-[72px]">
        Collections
      </h1>

      <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
        {EXPLORE_COLLECTIONS.map((collection) => (
          <li key={collection.title}>
            <Link
              to={collection.to}
              aria-label={`${collection.title}, ${collection.count} ${collection.count === 1 ? 'product' : 'products'}`}
              className="group block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={collection.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
              </div>
              <p className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.03em] lg:text-[30px] xl:text-[36px] 2xl:text-[44px]">
                {collection.title}
                <sup aria-hidden="true" className="ml-1 align-super text-[12px] tracking-[0.1em]">
                  {collection.count}
                </sup>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
