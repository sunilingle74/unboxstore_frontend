import { useEffect } from 'react'
import { X } from 'lucide-react'

// `header` replaces the default title bar; `title` still labels the dialog.
export default function Drawer({ open, onClose, side = 'right', title, header, children, widthClass = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const sideClass = side === 'right' ? 'right-0' : 'left-0'
  const translateClosed = side === 'right' ? 'translate-x-full' : '-translate-x-full'

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 ${sideClass} h-full w-full ${widthClass} bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : translateClosed
        }`}
      >
        {header ?? (
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 hover:bg-neutral-100"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
