import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/'
    navigate(from, { replace: true })
    return null
  }

  function setField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const errs = {}
    if (!form.nombre || form.nombre.trim().length < 2) {
      errs.nombre = 'El nombre debe tener al menos 2 caracteres'
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Ingresá un email válido'
    }
    if (!form.password || form.password.length < 8) {
      errs.password = 'La contraseña debe tener al menos 8 caracteres'
    } else if (!/\d/.test(form.password)) {
      errs.password = 'La contraseña debe tener al menos un número'
    }
    if (form.password !== form.confirmar) {
      errs.confirmar = 'Las contraseñas no coinciden'
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
      await register({
        nombre: form.nombre.trim(),
        email: form.email,
        password: form.password,
      })
      toast.success('¡Cuenta creada! Iniciá sesión.')
      navigate('/login', { replace: true })
    } catch (err) {
      const status = err?.response?.status
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        'Error al registrarse'
      if (status === 409) {
        toast.error('Este email ya está registrado')
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[#C9A227] font-bold">
            Dealer&apos;s Drinks
          </h1>
          <p className="text-[#F4EFE4]/50 text-sm mt-1">Espirituosas exclusivas</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1E35] border border-[#C9A227]/20 rounded-2xl p-8 shadow-xl">
          <h2 className="font-display text-xl text-[#F4EFE4] mb-6 text-center">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <Label htmlFor="nombre" className="text-[#F4EFE4]/70 text-sm">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={setField('nombre')}
                placeholder="Ana García"
                className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                autoComplete="name"
              />
              {errors.nombre && (
                <p className="text-danger text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-[#F4EFE4]/70 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={setField('email')}
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
                value={form.password}
                onChange={setField('password')}
                placeholder="Mínimo 8 caracteres con un número"
                className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-danger text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmar" className="text-[#F4EFE4]/70 text-sm">
                Confirmar contraseña
              </Label>
              <Input
                id="confirmar"
                type="password"
                value={form.confirmar}
                onChange={setField('confirmar')}
                placeholder="Repetí tu contraseña"
                className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                autoComplete="new-password"
              />
              {errors.confirmar && (
                <p className="text-danger text-xs mt-1">{errors.confirmar}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#F4EFE4]/50 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link
              to="/login"
              className="text-[#C9A227] hover:text-[#E0C56A] font-medium"
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
