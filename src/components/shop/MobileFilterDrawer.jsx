import Drawer from '../common/Drawer'
import Button from '../common/Button'
import Filters from './Filters'

export default function MobileFilterDrawer({ open, onClose, resultCount, ...filterProps }) {
  return (
    <Drawer open={open} onClose={onClose} title="Filters">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <Filters {...filterProps} />
        </div>
        <div className="border-t border-neutral-200 px-5 py-4">
          <Button onClick={onClose} className="w-full">
            Show {resultCount} results
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
