import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import contactImage from '../assets/10079.jpg'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <div className="overflow-hidden bg-neutral-100 md:w-2/5">
          <img src={contactImage} alt="Unboxstore" className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center gap-8 md:w-3/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">Get in Touch</p>
            <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">Contact Us</h1>
          </div>

          <div className="flex flex-col gap-4 text-sm text-neutral-600">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-neutral-500" />
              <p>794 Francisco, Suite 350, 94102</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-neutral-500" />
              <p>+91 87998 3109</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-neutral-500" />
              <p>unboxstore@gmail.com</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Your email"
                className="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <textarea
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              className="resize-none border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
            />
            <button className="w-fit bg-neutral-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-700">
              Send Message
            </button>
            {sent && <p className="text-xs text-neutral-600">Thanks — we'll get back to you shortly.</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
