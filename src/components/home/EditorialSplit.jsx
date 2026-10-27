import { Link } from 'react-router-dom'
import trenchImage from '../../assets/10050.jpg'
import coatImage from '../../assets/10044.jpg'

export default function EditorialSplit() {
  return (
    <section className="grid grid-cols-1 font-display md:grid-cols-2">
      <Link to="/shop?category=jackets-and-coats" className="group relative block aspect-[4/5] overflow-hidden bg-[#111] md:aspect-auto md:h-[min(115vh,1100px)]">
        <img
          src={trenchImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h2 className="text-[44px] font-normal leading-none tracking-[-0.04em] sm:text-[60px]">
            Timeless <em className="font-serif font-normal tracking-normal">classics</em>
          </h2>
          <span className="mt-10 border-b border-white/0 pb-1 text-[13px] uppercase tracking-[0.16em] transition-colors group-hover:border-white">
            Explore
            <span className="mx-auto mt-1 block h-px w-6 bg-white transition-all group-hover:w-0" />
          </span>
        </div>
      </Link>

      <Link to="/shop?category=hoodies-and-sweatshirts" className="group relative block aspect-[4/5] overflow-hidden bg-[#e9e9e9] md:aspect-auto md:h-[min(115vh,1100px)]">
        <img
          src={coatImage}
          alt="Shop coats"
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-transform duration-[1.2s] group-hover:scale-105"
        />
      </Link>
    </section>
  )
}
