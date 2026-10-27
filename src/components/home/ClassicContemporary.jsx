import { Link } from 'react-router-dom'
import image from '../../assets/carsouselimg2.jpg'

export default function ClassicContemporary() {
  return (
    <section className="grid grid-cols-1 bg-[#111] font-display text-white md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden md:aspect-auto md:h-[min(100vh,960px)]">
        <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>

      <Link
        to="/shop?sort=newest"
        className="group flex flex-col items-center justify-end px-6 py-14 text-center md:py-16"
      >
        <h2 className="text-[36px] font-normal leading-none tracking-[-0.04em] sm:text-[52px]">
          Classic Meets Contemporary
        </h2>
        <p className="mt-3 max-w-xl text-[14px] text-white/85 sm:text-[16px]">
          Redefine timeless styles with a modern twist—explore the Heritage Collection and the Future Edit.
        </p>
        <span className="mt-6 border-b border-white pb-1 text-[12px] uppercase tracking-[0.16em] group-hover:opacity-60">
          Shop the edit
        </span>
      </Link>
    </section>
  )
}
