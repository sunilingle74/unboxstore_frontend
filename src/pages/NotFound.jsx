import EmptyState from '../components/common/EmptyState'

export default function NotFound() {
  return (
    <EmptyState
      as="h1"
      className="min-h-[70vh] py-24"
      title={
        <>
          This page is <em>nowhere</em> to be found
        </>
      }
      message="The link may be broken or the page may have moved."
      action={{ label: 'Explore collections', to: '/explore' }}
    />
  )
}
