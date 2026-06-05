import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/hooks/useCart'
import { formatARS } from '@/lib/formatters'
import * as pedidoService from '@/services/pedidoService'

export default function CheckoutPage() {
  const { items, totalCentavos, clear } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    localidad: '',
    provincia: '',
    telefono: '',
  })

  function setField(field) {
    return (e) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate() {
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    if (!form.direccion.trim() || form.direccion.trim().length < 10)
      errs.direccion = 'La dirección es obligatoria (mínimo 10 caracteres)'
    if (!form.localidad.trim()) errs.localidad = 'La localidad es obligatoria'
    if (!form.provincia.trim()) errs.provincia = 'La provincia es obligatoria'
    if (!form.telefono.trim() || !/^\d[\d\s\-()]{6,}$/.test(form.telefono.trim()))
      errs.telefono = 'Ingresá un teléfono válido'
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
      const payload = {
        items: items.map((i) => ({
          producto_id: i.producto_id,
          cantidad: i.cantidad,
        })),
        direccion_envio: {
          nombre: form.nombre.trim(),
          direccion: form.direccion.trim(),
          localidad: form.localidad.trim(),
          provincia: form.provincia.trim(),
          telefono: form.telefono.trim(),
        },
      }
      const data = await pedidoService.placeOrder(payload)
      clear()
      toast.success('¡Pedido creado correctamente!')
      const pedidoId = data.pedido?.id || data.id
      navigate(pedidoId ? `/pedidos/${pedidoId}` : '/pedidos', { replace: true })
    } catch (err) {
      const status = err?.response?.status
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        'Error al crear el pedido'
      if (status === 409) {
        toast.error(msg, {
          description: 'Ajustá las cantidades e intentá de nuevo',
        })
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-[#F4EFE4]/50">Tu carrito está vacío.</p>
          <Button asChild className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold">
            <Link to="/productos">Ir al catálogo</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1628] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl text-[#F4EFE4] font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Items review */}
          <div className="space-y-4">
            <h2 className="font-display text-lg text-[#F4EFE4]">Tu pedido</h2>
            <div className="bg-[#0D1E35] border border-[#C9A227]/20 rounded-xl divide-y divide-[#C9A227]/10">
              {items.map((item) => (
                <div
                  key={item.producto_id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="w-10 h-10 rounded bg-[#16161D] border border-[#C9A227]/20 flex items-center justify-center text-sm overflow-hidden flex-shrink-0">
                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      '🍾'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F4EFE4] truncate">{item.nombre}</p>
                    <p className="text-xs text-[#F4EFE4]/40">
                      {item.cantidad} × {formatARS(item.precio_centavos)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#C9A227] flex-shrink-0">
                    {formatARS(item.precio_centavos * item.cantidad)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-5 py-4">
                <span className="font-semibold text-[#F4EFE4]">Total</span>
                <span className="font-display text-xl text-[#C9A227] font-bold">
                  {formatARS(totalCentavos)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Address form */}
          <div>
            <h2 className="font-display text-lg text-[#F4EFE4] mb-4">Datos de envío</h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="bg-[#0D1E35] border border-[#C9A227]/20 rounded-xl p-5 space-y-4">
                <div>
                  <Label className="text-[#F4EFE4]/70 text-sm">
                    Nombre del destinatario *
                  </Label>
                  <Input
                    value={form.nombre}
                    onChange={setField('nombre')}
                    placeholder="Nombre completo"
                    className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                  />
                  {errors.nombre && (
                    <p className="text-danger text-xs mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <Label className="text-[#F4EFE4]/70 text-sm">Dirección *</Label>
                  <Textarea
                    value={form.direccion}
                    onChange={setField('direccion')}
                    placeholder="Calle, número, piso, departamento..."
                    rows={3}
                    className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227] resize-none"
                  />
                  {errors.direccion && (
                    <p className="text-danger text-xs mt-1">{errors.direccion}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#F4EFE4]/70 text-sm">Localidad *</Label>
                    <Input
                      value={form.localidad}
                      onChange={setField('localidad')}
                      placeholder="Localidad"
                      className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                    />
                    {errors.localidad && (
                      <p className="text-danger text-xs mt-1">{errors.localidad}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#F4EFE4]/70 text-sm">Provincia *</Label>
                    <Input
                      value={form.provincia}
                      onChange={setField('provincia')}
                      placeholder="Provincia"
                      className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                    />
                    {errors.provincia && (
                      <p className="text-danger text-xs mt-1">{errors.provincia}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-[#F4EFE4]/70 text-sm">Teléfono *</Label>
                  <Input
                    value={form.telefono}
                    onChange={setField('telefono')}
                    placeholder="011 1234-5678"
                    className="mt-1 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227]"
                  />
                  {errors.telefono && (
                    <p className="text-danger text-xs mt-1">{errors.telefono}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold py-6 text-base"
              >
                {loading ? 'Confirmando...' : 'Confirmar pedido'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
