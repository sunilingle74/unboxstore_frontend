import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/auth/RequireAuth'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/layout/CartDrawer'
import Home from './pages/Home'
const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const ProductForm = lazy(() => import('./components/productForm/ProductForm'))
const Login = lazy(() => import('./pages/auth/Login'))
const EmailLogin = lazy(() => import('./pages/auth/EmailLogin'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Explore = lazy(() => import('./pages/Explore'))
const NotFound = lazy(() => import('./pages/NotFound'))
import NewsletterPopup from './components/newsletter/NewsletterPopup'
const Account = lazy(() => import('./pages/account/Account'))
const OrderDetail = lazy(() => import('./pages/account/OrderDetail'))

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AnnouncementBar />
          <Navbar />
          <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/addproduct" element={<ProductForm/>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/email" element={<EmailLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="/order/:id" element={<RequireAuth><OrderDetail confirmation /></RequireAuth>} />
            <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
            <Route path="/account/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <Footer />
          <CartDrawer />
          <NewsletterPopup />
        </WishlistProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
