import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LandingPage } from './pages/landing/LandingPage'
import { AuthPage } from './pages/auth/AuthPage'
import { MarketplacePage } from './pages/marketplace/MarketplacePage'
import { ProductDetailPage } from './pages/product/ProductDetailPage'
import { MyListingsPage } from './pages/listings/MyListingsPage'
import { ListingFormPage } from './pages/listings/ListingFormPage'
import { CartPage } from './pages/cart/CartPage'
import { PurchasesPage } from './pages/purchases/PurchasesPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'

export const router = createBrowserRouter([
  // Landing and auth carry their own chrome.
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <AuthPage /> },
  { path: '/signup', element: <AuthPage /> },

  // Everything else shares the app shell.
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/marketplace', element: <MarketplacePage /> },
      { path: '/product/:id', element: <ProductDetailPage /> },
      { path: '/my-listings', element: <MyListingsPage /> },
      { path: '/my-listings/:id/edit', element: <ListingFormPage /> },
      { path: '/sell', element: <ListingFormPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/purchases', element: <PurchasesPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
    ],
  },
])
