import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DataTable from '@/components/admin/DataTable'
import StatePill from '@/components/admin/StatePill'

import * as pedidoService from '@/services/pedidoService'
import { formatARS, formatDate } from '@/lib/formatters'
import { useDebounce } from '@/hooks/useDebounce'

// State machine: from → [allowed targets]
const TRANSITIONS = {
  pendiente_pago: ['confirmado', 'cancelado'],
  confirmado: ['enviado', 'cancelado'],
  enviado: ['entregado'],
  entregado: [],
  cancelado: [],
}

const TRANSITION_LABELS = {
  confirmado: 'Confirmar',
  enviado: 'Marcar enviado',
  entregado: 'Marcar entregado',
  cancelado: 'Cancelar pedido',
}

const ESTADO_OPTIONS = [
  { value: '__all__', label: 'Todos los estados' },
  { value: 'pendiente_pago', label: 'Pendiente de pago' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
]

// Count orders per state
function buildCounts(pedidos) {
  return pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1
    return acc
  }, {})
}

export default function OrdersAdminPage() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [transitioning, setTransitioning] = useState(null) // pedido id being transitioned

  // Filters
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [emailRaw, setEmailRaw] = useState('')
  const [filterEstado, setFilterEstado] = useState('__all__')

  const emailDebounced = useDebounce(emailRaw, 400)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (desde) params.desde = desde
      if (hasta) params.hasta = hasta
      if (emailDebounced) params.email_cliente = emailDebounced
      if (filterEstado && filterEstado !== '__all__') params.estado = filterEstado

      const data = await pedidoService.listAll(params)
      setPedidos(Array.isArray(data) ? data : data.items ?? [])
    } catch {
      toast.error('Error al cargar los pedidos.')
    } finally {
      setLoading(false)
    }
  }, [desde, hasta, emailDebounced, filterEstado])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleTransition = async (pedido, newEstado) => {
    setTransitioning(pedido.id)
    try {
      await pedidoService.changeState(pedido.id, newEstado)
      const label = TRANSITION_LABELS[newEstado] ?? newEstado
      toast.success(`Pedido #${pedido.id} → ${label}.`)
      loadData()
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ??
        err?.response?.data?.error ??
        'Error al cambiar el estado.'
      toast.error(typeof msg === 'string' ? msg : 'Error al cambiar el estado.')
    } finally {
      setTransitioning(null)
    }
  }

  const counts = buildCounts(pedidos)

  const columns = [
    { header: '#', accessor: 'id', width: '60px' },
    {
      header: 'Cliente',
      accessor: '_cliente',
      cell: (row) => {
        const u = row.usuario ?? row.Usuario
        if (!u) return <span className="text-[#F4EFE4]/40">—</span>
        return (
          <div>
            <p className="font-medium text-[#F4EFE4]/90 text-sm">{u.nombre}</p>
            <p className="text-[#F4EFE4]/50 text-xs">{u.email}</p>
          </div>
        )
      },
    },
    {
      header: 'Fecha',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-[#F4EFE4]/70 text-sm">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Items',
      accessor: '_items',
      width: '70px',
      cell: (row) => {
        const detalles = row.detalles ?? row.DetallePedidos ?? []
        return (
          <span className="text-center block">{detalles.length}</span>
        )
      },
    },
    {
      header: 'Total',
      accessor: 'total_centavos',
      cell: (row) => (
        <span className="font-semibold text-[#C9A227]">
          {formatARS(row.total_centavos)}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: 'estado',
      cell: (row) => <StatePill estado={row.estado} />,
    },
    {
      header: 'Acciones',
      accessor: '_actions',
      cell: (row) => {
        const allowed = TRANSITIONS[row.estado] ?? []
        const isLoading = transitioning === row.id
        return (
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-[#C9A227] hover:bg-[#C9A227]/10"
              onClick={() => navigate(`/pedidos/${row.id}`)}
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {allowed.map((target) => (
              <Button
                key={target}
                size="sm"
                variant={target === 'cancelado' ? 'destructive' : 'outline'}
                disabled={isLoading}
                onClick={() => handleTransition(row, target)}
                className={
                  target === 'cancelado'
                    ? 'h-7 text-xs bg-red-600 hover:bg-red-700 text-white border-0'
                    : 'h-7 text-xs border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10'
                }
              >
                {isLoading ? '…' : TRANSITION_LABELS[target] ?? target}
              </Button>
            ))}
          </div>
        )
      },
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="font-display text-2xl font-bold text-[#C9A227]">Pedidos</h1>
          {/* State summary counts */}
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(counts).map(([estado, count]) => (
              <span
                key={estado}
                className="px-2 py-1 rounded bg-[#16161D] border border-[#C9A227]/20 text-[#F4EFE4]/70"
              >
                <span className="font-semibold text-[#C9A227]">{count}</span>{' '}
                {estado.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Desde</Label>
            <Input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4] w-40"
            />
          </div>
          <div>
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Hasta</Label>
            <Input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4] w-40"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Email cliente</Label>
            <Input
              placeholder="ana@ejemplo.com"
              value={emailRaw}
              onChange={(e) => setEmailRaw(e.target.value)}
              className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30"
            />
          </div>
          <div className="min-w-[180px]">
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Estado</Label>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]">
                {ESTADO_OPTIONS.map((o) => (
                  <SelectItem
                    key={o.value}
                    value={o.value}
                    className="focus:bg-[#C9A227]/20"
                  >
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(desde || hasta || emailRaw || filterEstado !== '__all__') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDesde('')
                setHasta('')
                setEmailRaw('')
                setFilterEstado('__all__')
              }}
              className="text-[#F4EFE4]/50 hover:text-[#F4EFE4] text-xs"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={pedidos}
          loading={loading}
          emptyMessage="No hay pedidos que coincidan con los filtros."
        />
      </div>
    </div>
  )
}
