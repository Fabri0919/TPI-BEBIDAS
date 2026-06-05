import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import StatePill from '@/components/admin/StatePill'
import { formatARS, formatDate } from '@/lib/formatters'
import { useAuth } from '@/hooks/useAuth'
import * as pedidoService from '@/services/pedidoService'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchPedido()
  }, [id])

  async function fetchPedido() {
    setLoading(true)
    try {
      const data = await pedidoService.getById(id)
      setPedido(data.pedido || data)
    } catch (err) {
      if (err?.response?.status === 404) {
        toast.error('Pedido no encontrado')
        navigate('/pedidos', { replace: true })
      } else {
        toast.error('Error al cargar el pedido')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!window.confirm('¿Estás seguro que querés cancelar este pedido?')) return
    setCancelling(true)
    try {
      await pedidoService.changeState(id, 'cancelado')
      toast.success('Pedido cancelado')
      fetchPedido()
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        'No se pudo cancelar el pedido'
      toast.error(msg)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <Skeleton className="h-8 w-48 bg-[#16161D]" />
          <Skeleton className="h-32 bg-[#16161D] rounded-xl" />
          <Skeleton className="h-48 bg-[#16161D] rounded-xl" />
        </div>
      </div>
    )
  }

  if (!pedido) return null

  const detalles = pedido.detalles || pedido.DetallePedidos || []
  const direccion = pedido.direccion_entrega || {}
  const isAdmin = hasRole('admin', 'super-admin')
  const canCancel = pedido.estado === 'pendiente_pago'

  return (
    <div className="min-h-screen bg-[#0A1628] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/pedidos"
          className="inline-flex items-center gap-2 text-sm text-[#F4EFE4]/50 hover:text-[#C9A227] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Mis pedidos
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl text-[#F4EFE4] font-bold">
              Pedido #{pedido.id}
            </h1>
            <p className="text-[#F4EFE4]/40 text-sm mt-1">
              {formatDate(pedido.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatePill estado={pedido.estado} />
            {canCancel && (
              <Button
                size="sm"
                variant="ghost"
                disabled={cancelling}
                onClick={handleCancel}
                className="text-danger hover:bg-danger/10 border border-danger/30 text-xs"
              >
                {cancelling ? 'Cancelando...' : 'Cancelar pedido'}
              </Button>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="bg-[#0D1E35] border border-[#C9A227]/20 rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-[#C9A227]/10">
            <h2 className="font-display text-base text-[#F4EFE4]">Productos</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-[#C9A227]/10 hover:bg-transparent">
                <TableHead className="text-[#F4EFE4]/50">Producto</TableHead>
                <TableHead className="text-[#F4EFE4]/50 text-center">Cant.</TableHead>
                <TableHead className="text-[#F4EFE4]/50 text-right">
                  Precio unit.
                </TableHead>
                <TableHead className="text-[#F4EFE4]/50 text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalles.map((d) => {
                const precioUnit =
                  d.precio_unitario_centavos ?? d.precio_unitario
                return (
                  <TableRow
                    key={d.id}
                    className="border-[#C9A227]/10 hover:bg-[#C9A227]/5"
                  >
                    <TableCell className="text-[#F4EFE4] text-sm">
                      {d.nombre_producto}
                    </TableCell>
                    <TableCell className="text-center text-[#F4EFE4]/70 text-sm">
                      {d.cantidad}
                    </TableCell>
                    <TableCell className="text-right text-[#F4EFE4]/70 text-sm">
                      {formatARS(precioUnit)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-[#C9A227]">
                      {formatARS(precioUnit * d.cantidad)}
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="border-[#C9A227]/10 hover:bg-transparent">
                <TableCell colSpan={3} className="text-right font-bold text-[#F4EFE4]">
                  Total
                </TableCell>
                <TableCell className="text-right font-display text-lg text-[#C9A227] font-bold">
                  {formatARS(pedido.total_centavos)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Delivery address */}
        <div className="bg-[#0D1E35] border border-[#C9A227]/20 rounded-xl p-5">
          <h2 className="font-display text-base text-[#F4EFE4] mb-3">
            Dirección de envío
          </h2>
          {typeof direccion === 'object' && Object.keys(direccion).length > 0 ? (
            <div className="text-sm text-[#F4EFE4]/70 space-y-1">
              {direccion.nombre && (
                <p className="font-medium text-[#F4EFE4]">{direccion.nombre}</p>
              )}
              {direccion.direccion && <p>{direccion.direccion}</p>}
              {(direccion.localidad || direccion.provincia) && (
                <p>
                  {[direccion.localidad, direccion.provincia]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {direccion.telefono && <p>Tel: {direccion.telefono}</p>}
            </div>
          ) : (
            <p className="text-[#F4EFE4]/40 text-sm">Sin información de envío</p>
          )}
        </div>
      </div>
    </div>
  )
}
