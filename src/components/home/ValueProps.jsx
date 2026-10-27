import { Truck, ShieldCheck, RefreshCcw, Headphones } from 'lucide-react'

const PROPS = [
  { icon: Truck, title: 'Free Express Shipping', desc: 'On all orders over ₹2,999' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: '100% protected payments' },
  { icon: RefreshCcw, title: 'Easy Exchanges', desc: '30-day hassle-free returns' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'We reply within 24 hours' },
]

export default function ValueProps() {
  return (
    <section className="border-y border-neutral-200">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:px-8">
        {PROPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:text-left">
            <Icon size={22} className="shrink-0 text-neutral-700" />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-neutral-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
