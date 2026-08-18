import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from './pages/landing/LandingPage'
import { LoginPage } from './pages/login/LoginPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
])
