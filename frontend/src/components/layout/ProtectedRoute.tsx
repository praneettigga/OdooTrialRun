import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import { Spinner } from '../ui/states'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-[1240px] items-center justify-center px-6">
        <Spinner label="Checking your session" />
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    )
  }

  return children
}
