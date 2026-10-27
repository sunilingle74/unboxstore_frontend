import { Link } from 'react-router-dom'
import statementImage from '../../assets/carsouselimg1.jpg'

export default function BrandStatement() {
  return (
    <section className="relative h-[90vh] min-h-[560px] w-full overflow-hidden bg-[#111] font-display">
      <img src={statementImage} alt="" loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-20 text-center text-white sm:pb-28">
        <h2 className="max-w-5xl text-[38px] font-normal leading-[1.05] tracking-[-0.04em] sm:text-[64px] lg:text-[76px]">
          The brand designs clothing to make everyone feel{' '}
          <em className="font-serif font-normal tracking-normal">unique</em>
        </h2>
        <Link
          to="/about"
          className="mt-10 rounded-full border border-white/80 px-8 py-4 text-[12px] uppercase tracking-[0.16em] transition-colors hover:bg-white hover:text-neutral-900"
        >
          Lookbook
        </Link>
      </div>
    </section>
  )
}
