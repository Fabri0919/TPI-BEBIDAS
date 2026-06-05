import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import * as pedidoService from '@/services/pedidoService'

const ESTADOS = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'pendiente_pago', label: 'Pendiente de pago' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
]

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [estadoFilter, setEstadoFilter] = useState('todos')
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      const data = await pedidoService.listMine()
      const list = Array.isArray(data) ? data : data.items || data.pedidos || []
      setPedidos(list)
    } catch {
      toast.error('No se pudo cargar el historial')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(pedidoId) {
    if (!window.confirm('¿Cancelar este pedido?')) return
    setCancelling(pedidoId)
    try {
      await pedidoService.changeState(pedidoId, 'cancelado')
      toast.success('Pedido cancelado')
      fetchOrders()
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        'No se pudo cancelar el pedido'
      toast.error(msg)
    } finally {
      setCancelling(null)
    }
  }

  const filtered =
    estadoFilter === 'todos'
      ? pedidos
      : pedidos.filter((p) => p.estado === estadoFilter)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] py-12">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <Skeleton className="h-8 w-48 bg-[#16161D]" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 bg-[#16161D] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1628] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-[#F4EFE4] font-bold">
            Mis pedidos
          </h1>

          {/* Filter */}
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-52 bg-[#0D1E35] border-[#C9A227]/30 text-[#F4EFE4] focus:border-[#C9A227]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]">
              {ESTADOS.map((e) => (
                <SelectItem
                  key={e.value}
                  value={e.value}
                  className="hover:bg-[#C9A227]/10 focus:bg-[#C9A227]/10 cursor-pointer"
                >
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-[#F4EFE4]/40 text-lg">Aún no hiciste pedidos</p>
            <Button
              asChild
              className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold"
            >
              <Link to="/productos">Ir al catálogo</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-[#C9A227]/20 overflow-hidden bg-[#0D1E35]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#C9A227]/10 hover:bg-transparent">
                  <TableHead className="text-[#F4EFE4]/50">#</TableHead>
                  <TableHead className="text-[#F4EFE4]/50">Fecha</TableHead>
                  <TableHead className="text-[#F4EFE4]/50">Items</TableHead>
                  <TableHead className="text-[#F4EFE4]/50 text-right">Total</TableHead>
                  <TableHead className="text-[#F4EFE4]/50">Estado</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((pedido) => {
                  const itemCount =
                    pedido.detalles?.length ??
                    pedido.DetallePedidos?.length ??
                    pedido.items_count ??
                    '—'
                  return (
                    <TableRow
                      key={pedido.id}
                      className="border-[#C9A227]/10 hover:bg-[#C9A227]/5 cursor-pointer"
                      onClick={() => navigate(`/pedidos/${pedido.id}`)}
                    >
                      <TableCell className="text-[#F4EFE4]/60 text-sm font-mono">
                        #{pedido.id}
                      </TableCell>
                      <TableCell className="text-[#F4EFE4]/70 text-sm">
                        {formatDate(pedido.createdAt)}
                      </TableCell>
                      <TableCell className="text-[#F4EFE4]/50 text-sm">
                        {itemCount}
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-[#C9A227]">
                        {formatARS(pedido.total_centavos)}
                      </TableCell>
                      <TableCell>
                        <StatePill estado={pedido.estado} />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/pedidos/${pedido.id}`)}
                            className="text-[#C9A227] hover:bg-[#C9A227]/10 text-xs"
                          >
                            Ver
                          </Button>
                          {pedido.estado === 'pendiente_pago' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={cancelling === pedido.id}
                              onClick={() => handleCancel(pedido.id)}
                              className="text-danger hover:bg-danger/10 text-xs"
                            >
                              {cancelling === pedido.id ? '...' : 'Cancelar'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
