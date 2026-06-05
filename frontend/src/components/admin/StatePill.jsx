import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATE_CONFIG = {
  pendiente_pago: {
    label: 'Pendiente de pago',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  confirmado: {
    label: 'Confirmado',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  enviado: {
    label: 'Enviado',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  entregado: {
    label: 'Entregado',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
}

export default function StatePill({ estado, className }) {
  const config = STATE_CONFIG[estado] || {
    label: estado,
    className: 'bg-[#16161D] text-[#F4EFE4]/50 border-[#F4EFE4]/10',
  }
  return (
    <Badge
      className={cn(
        'text-xs font-semibold uppercase tracking-wide border',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
