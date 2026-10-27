import { Link } from 'react-router-dom'
import womenImage from '../../assets/10071.jpg'
import menImage from '../../assets/10043.jpg'

const PANELS = [
  { label: 'Shop Women', to: '/shop?gender=women', image: womenImage },
  { label: 'Shop Men', to: '/shop?gender=men', image: menImage },
]

export default function GenderSplit() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2">
      {PANELS.map((panel) => (
        <Link key={panel.label} to={panel.to} className="group relative block aspect-[3/4] overflow-hidden bg-neutral-900 sm:aspect-[4/5]">
          <img
            src={panel.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
          <span className="absolute bottom-8 left-6 text-2xl font-bold text-white sm:bottom-10 sm:left-8 sm:text-3xl">
            {panel.label}
          </span>
        </Link>
      ))}
    </section>
  )
}
