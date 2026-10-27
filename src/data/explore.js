import { getCategoryBySlug } from './categories'
import { MOCK_PRODUCTS } from './mockProducts'
import topsImage from '../assets/finalproducts/10193.jpeg'
import tshirtsImage from '../assets/finalproducts/10206.jpeg'
import jeansImage from '../assets/finalproducts/10192.jpg'
import jacketsImage from '../assets/finalproducts/10152.jpg'
import hoodiesImage from '../assets/finalproducts/10167.jpg'
import newImage from '../assets/finalproducts/10153.jpg'
import bestsellersImage from '../assets/finalproducts/10198.jpg'
import basicsImage from '../assets/finalproducts/10155.jpg'

const BASICS = ['t-shirts', 'tops', 'sweatpants']

function categoryCollection(slug, image) {
  return {
    title: getCategoryBySlug(slug).name,
    to: `/shop?category=${slug}`,
    image,
    count: MOCK_PRODUCTS.filter((p) => p.category === slug).length,
  }
}

// Editorial tiles for /explore. Category tiles only appear once that category
// has products, so the page never links to an empty listing.
export const EXPLORE_COLLECTIONS = [
  { title: 'New Arrivals', to: '/shop?sort=newest', image: newImage, count: MOCK_PRODUCTS.filter((p) => p.isNewArrival).length },
  categoryCollection('hoodies-and-sweatshirts', hoodiesImage),
  categoryCollection('jackets-and-coats', jacketsImage),
  categoryCollection('jeans', jeansImage),
  { title: 'Bestsellers', to: '/shop?sort=bestsellers', image: bestsellersImage, count: MOCK_PRODUCTS.length },
  categoryCollection('tops', topsImage),
  categoryCollection('t-shirts', tshirtsImage),
  {
    title: 'Basics',
    to: `/shop?category=${BASICS.join(',')}`,
    image: basicsImage,
    count: MOCK_PRODUCTS.filter((p) => BASICS.includes(p.category)).length,
  },
].filter((c) => c.count > 0)

