// The catalogue lives in catalogue.json so the backend can seed the same
// products (`npm run seed:catalogue` in /backend) and price orders from them.
// Image entries are filenames in public/products — served at stable URLs so
// the admin app and emails can show them too.
import catalogue from './catalogue.json'

export const MOCK_PRODUCTS = catalogue.map((product) => ({
  ...product,
  id: product.slug,
  images: product.images.map((file) => `/products/${file}`),
}))
