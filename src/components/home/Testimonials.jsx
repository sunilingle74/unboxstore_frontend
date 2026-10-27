import StarRating from '../common/StarRating'

const REVIEWS = [
  {
    name: 'Aarav Mehta',
    text: 'The fit is exactly as described and the fabric feels far more premium than the price suggests. Delivery was quick too.',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    text: 'Ordered the linen shirt for summer — breathable, well-stitched, and the color is true to the photos.',
    rating: 5,
  },
  {
    name: 'Kabir Singh',
    text: 'Exchanged a size with zero hassle. Customer support was quick to respond and the process was seamless.',
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-semibold">What our customers say</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {REVIEWS.map((review) => (
            <div key={review.name} className="rounded-lg border border-neutral-200 bg-white p-6">
              <StarRating rating={review.rating} size={14} />
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">"{review.text}"</p>
              <p className="mt-4 text-sm font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
