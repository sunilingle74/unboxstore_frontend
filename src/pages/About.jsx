import { Link } from 'react-router-dom'
import { ShieldCheck, Sparkles, Users } from 'lucide-react'
import aboutImage from '../assets/10062.jpg'

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    desc: 'We meticulously select and vet every product to meet our stringent quality standards.',
  },
  {
    icon: Sparkles,
    title: 'Considered Design',
    desc: 'Fewer, better pieces — designed to outlast the season they were made for.',
  },
  {
    icon: Users,
    title: 'Customer First',
    desc: 'Our team is here to help every step of the way, from sizing to returns.',
  },
]

export default function About() {
  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:gap-16 lg:px-8">
        <div className="overflow-hidden bg-neutral-100 md:w-1/2">
          <img src={aboutImage} alt="Unboxstore" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-6 text-neutral-600 md:w-1/2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">About Us</p>
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Our Story</h1>
          <p>
            Unboxstore was created with a passion for self-expression and a mission to redefine everyday style.
            What started as a simple idea — build a place where people can discover, explore, and shop considered
            essentials without the noise — has grown into a destination for anyone who cares about what they wear.
          </p>
          <p>
            Since launch, we've been dedicated to curating a collection of on-trend pieces that reflect
            individuality and craft. From tailored outerwear to everyday staples, our selection is sourced from
            brands and makers we trust.
          </p>
          <div>
            <b className="text-neutral-900">Our Mission</b>
            <p className="mt-2">
              To make style effortless, convenient, and confident — a seamless shopping experience that helps you
              stay true to your own taste, every step of the way.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-2 inline-flex w-fit items-center bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-700"
          >
            Shop the Collection
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xl font-bold">
          Why <span className="text-neutral-400">Choose Us</span>
        </p>
      </div>

      <div className="mx-auto mb-20 mt-8 grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {VALUES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col gap-4 border border-neutral-200 px-8 py-10">
            <Icon size={24} className="text-neutral-700" />
            <b className="text-neutral-900">{title}</b>
            <p className="text-sm text-neutral-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
