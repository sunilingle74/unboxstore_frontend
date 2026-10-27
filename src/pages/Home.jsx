import Hero from '../components/home/Hero'
import JustArrived from '../components/home/JustArrived'
import EditorialSplit from '../components/home/EditorialSplit'
import BrandStatement from '../components/home/BrandStatement'
import SpecialCollections from '../components/home/SpecialCollections'
import ClassicContemporary from '../components/home/ClassicContemporary'
import TabbedProducts from '../components/home/TabbedProducts'
import ScrollToTop from '../components/home/ScrollToTop'

export default function Home() {
  return (
    <div>
      <Hero />
      <JustArrived />
      <EditorialSplit />
      <BrandStatement />
      <SpecialCollections />
      <ClassicContemporary />
      <TabbedProducts />
      <ScrollToTop />
    </div>
  )
}
