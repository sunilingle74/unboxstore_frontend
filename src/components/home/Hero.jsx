import { Link } from 'react-router-dom'
import heroImage from '../../assets/reference-web-assets/hero.webp'

export default function Hero() {
  return (
    // -mt-[72px] tucks the hero under the sticky, transparent Navbar (h-[72px]).
    <section className="relative -mt-[72px] h-[calc(100svh-40px)] min-h-[560px] w-full overflow-hidden bg-[#111]">
      <img
        src={heroImage}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/0 to-black/45" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 pb-14 text-center font-display text-white sm:pb-20">
        <p className="text-[12px] uppercase tracking-[0.3em] sm:text-[14px]">SS26 Statement Pieces</p>
        <h1 className="mt-5 text-[52px] font-light leading-[1] tracking-[-0.04em] sm:text-[88px] lg:text-[112px]">
          Bold by design
        </h1>
        <Link
          to="/shop?sort=newest"
          className="mt-8 rounded-full border border-white/80 px-8 py-4 text-[12px] uppercase tracking-[0.16em] transition-colors hover:bg-white hover:text-neutral-900"
        >
          Discover more
        </Link>
      </div>
    </section>
  )
}
