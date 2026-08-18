import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './pages/landing/LandingPage'
import { LoginPage } from './pages/login/LoginPage'
import { MarketplacePage } from './pages/marketplace/MarketplacePage'
import { ProductDetailPage } from './pages/product/ProductDetailPage'

export const router = createBrowserRouter([
  // Landing and login carry their own chrome.
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },

  // Everything else shares the app shell.
  {
    element: <AppLayout />,
    children: [
      { path: '/marketplace', element: <MarketplacePage /> },
      { path: '/product/:id', element: <ProductDetailPage /> },
    ],
  },
])
