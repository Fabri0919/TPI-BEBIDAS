import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, hasRole, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
