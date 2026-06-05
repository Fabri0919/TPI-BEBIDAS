import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('dealers_token')
      const storedUser = localStorage.getItem('dealers_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch {
      // Corrupt localStorage — ignore
      localStorage.removeItem('dealers_token')
      localStorage.removeItem('dealers_user')
    } finally {
      setLoading(false)
    }
  }, [])

  // Listen for token expiration events from apiClient interceptor
  useEffect(() => {
    const handleExpired = () => {
      setUser(null)
      setToken(null)
      localStorage.removeItem('dealers_token')
      localStorage.removeItem('dealers_user')
      toast.info('Sesión expirada. Volvé a iniciar sesión.')
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [navigate])

  const persistAuth = useCallback((userData, userToken) => {
    localStorage.setItem('dealers_token', userToken)
    localStorage.setItem('dealers_user', JSON.stringify(userData))
    setToken(userToken)
    setUser(userData)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password })
    persistAuth(data.user, data.token)
    return data
  }, [persistAuth])

  const register = useCallback(async ({ email, nombre, password }) => {
    const data = await authService.register({ email, nombre, password })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('dealers_token')
    localStorage.removeItem('dealers_user')
    setUser(null)
    setToken(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const hasRole = useCallback((...roles) => {
    if (!user) return false
    return roles.includes(user.rol)
  }, [user])

  const isAuthenticated = !!token

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated,
    hasRole,
    login,
    register,
    logout,
  }), [user, token, loading, isAuthenticated, hasRole, login, register, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
