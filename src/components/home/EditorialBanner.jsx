import { Link } from 'react-router-dom'
import trenchImage from '../../assets/10088.jpg'
import blazerImage from '../../assets/10054.jpg'

export default function EditorialBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <ImagePanel
          image={trenchImage}
          eyebrow="Seasonal Edit"
          title="Trench Coats"
          cta="Shop the edit"
          to="/shop?category=jackets-and-coats"
          className="lg:col-span-7 aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto"
        />

        <div className="flex flex-col lg:col-span-5">
          <ImagePanel
            image={blazerImage}
            eyebrow="Tailoring"
            title="Blazers"
            cta="Shop the edit"
            to="/shop?category=tops"
            className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-auto lg:flex-1"
          />

          <Link
            to="/shop?sort=newest"
            className="group flex flex-1 flex-col justify-center bg-neutral-900 px-8 py-10 text-white sm:px-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Just In</p>
            <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">New Arrivals, weekly.</h3>
            <span className="mt-5 inline-flex w-fit items-center border-b border-white pb-1 text-xs font-semibold uppercase tracking-wide group-hover:border-white/50 group-hover:text-white/80">
              Explore now
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function ImagePanel({ image, eyebrow, title, cta, to, className = '' }) {
  return (
    <Link to={to} className={`group relative block overflow-hidden ${className}`}>
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
        <span className="mt-3 inline-block border-b border-white text-xs font-semibold uppercase tracking-wide text-white">
          {cta}
        </span>
      </div>
    </Link>
  )
}
