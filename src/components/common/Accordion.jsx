import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
        aria-expanded={open}
      >
        {title}
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid overflow-hidden transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden text-sm leading-relaxed text-neutral-600">{children}</div>
      </div>
    </div>
  )
}

export default function Accordion({ children }) {
  return <div className="divide-y-0">{children}</div>
}
