import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'

const DEMO_USERS = [
  {
    label: "Demo cliente",
    email: "cliente@espiritulibre.com",
    password: "Demo1234!",
  },
  {
    label: "Demo admin",
    email: "admin@espiritulibre.com",
    password: "Demo1234!",
  },
  {
    label: "Demo super-admin",
    email: "superadmin@espiritulibre.com",
    password: "Admin1234",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Already authenticated — redirect
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/'
    navigate(from, { replace: true })
    return null
  }

  function validate() {
    const errs = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Ingresá un email válido'
    }
    if (!password || password.length < 8) {
      errs.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await login(email, password)
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        'Credenciales incorrectas'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(user) {
    setEmail(user.email)
    setPassword(user.password)
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[#C9A227] font-bold">
            Espiritu Libre
          </h1>
          <p className="text-[#F4EFE4]/50 text-sm mt-1">Espirituosas exclusivas</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1E35] border border-[#C9A227]/20 rounded-2xl p-8 shadow-xl">
          <h2 className="font-display text-xl text-[#F4EFE4] mb-6 text-center">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#F4EFE4]/70 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-[#F4EFE4]/70 text-sm">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-danger text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold mt-2"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-[#C9A227]/10">
            <p className="text-xs text-[#F4EFE4]/40 text-center mb-3">
              Credenciales de demo (contraseña: Demo1234!)
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fillDemo(u)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#C9A227]/30 text-[#C9A227]/70 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-[#F4EFE4]/50 mt-6">
            ¿No tenés cuenta?{' '}
            <Link
              to="/registro"
              className="text-[#C9A227] hover:text-[#E0C56A] font-medium"
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
