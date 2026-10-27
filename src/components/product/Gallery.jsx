import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Gallery({ images, productName }) {
  const [active, setActive] = useState(0)

  function step(delta) {
    setActive((i) => (i + delta + images.length) % images.length)
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActive(i)}
            className={`aspect-[3/4] w-16 flex-none overflow-hidden rounded-md border-2 sm:w-20 ${
              active === i ? 'border-neutral-900' : 'border-transparent'
            }`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-lg bg-neutral-100">
        <img src={images[active]} alt={productName} className="aspect-[3/4] w-full object-cover" />
        <button
          onClick={() => step(-1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow sm:hidden"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => step(1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow sm:hidden"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
