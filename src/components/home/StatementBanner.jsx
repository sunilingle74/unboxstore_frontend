import { Link } from 'react-router-dom'
import statementImage from '../../assets/10101.png'

export default function StatementBanner() {
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-neutral-900">
      <img src={statementImage} alt="" className="h-full w-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-16 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">The Philosophy</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white sm:text-5xl">
          Considered pieces.
          <br />
          Considered choices.
        </h2>
        <p className="mt-5 max-w-md text-sm text-white/80">
          Every garment is designed to outlast the season it was made for — fewer, better things, worn often.
        </p>
        <Link
          to="/shop?sort=newest"
          className="mt-8 inline-flex items-center border-b border-white pb-1 text-xs font-semibold uppercase tracking-wide text-white hover:border-white/50 hover:text-white/80"
        >
          Shop New Arrivals
        </Link>
      </div>
    </section>
  )
}
