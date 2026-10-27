import Modal from '../common/Modal'

const ROWS = [
  { size: 'XS', chest: '34-36', waist: '28-30', length: '26' },
  { size: 'S', chest: '36-38', waist: '30-32', length: '27' },
  { size: 'M', chest: '38-40', waist: '32-34', length: '28' },
  { size: 'L', chest: '40-42', waist: '34-36', length: '29' },
  { size: 'XL', chest: '42-44', waist: '36-38', length: '30' },
  { size: 'XXL', chest: '44-46', waist: '38-40', length: '31' },
]

export default function SizeGuideModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Size Guide">
      <p className="mb-4 text-sm text-neutral-600">
        All measurements are in inches. If you're between sizes, we recommend sizing up.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2">Size</th>
              <th className="py-2">Chest</th>
              <th className="py-2">Waist</th>
              <th className="py-2">Length</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.size} className="border-b border-neutral-100">
                <td className="py-2 font-medium">{row.size}</td>
                <td className="py-2 text-neutral-600">{row.chest}</td>
                <td className="py-2 text-neutral-600">{row.waist}</td>
                <td className="py-2 text-neutral-600">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
