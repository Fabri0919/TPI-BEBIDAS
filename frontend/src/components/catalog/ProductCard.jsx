import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAddToCart } from '@/hooks/useAddToCart'
import { formatARS } from '@/lib/formatters'

export default function ProductCard({ producto }) {
  const navigate = useNavigate()
  const addToCart = useAddToCart()

  const isOutOfStock = producto.stock === 0

  function handleAddToCart(e) {
    e.stopPropagation()
    if (isOutOfStock) return
    try {
      if (addToCart(producto, 1)) {
        toast.success('Agregado al carrito', {
          description: producto.nombre,
        })
      }
    } catch {
      toast.error('No se pudo agregar al carrito')
    }
  }

  function handleCardClick() {
    navigate(`/productos/${producto.id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handleCardClick}
      className="group cursor-pointer rounded-xl bg-[#0D1E35] border border-[#C9A227]/20 hover:border-[#C9A227]/60 transition-all overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-[#16161D] flex items-center justify-center overflow-hidden">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl opacity-30">🍾</div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#0A1628]/70 flex items-center justify-center">
            <Badge className="bg-danger/80 text-white border-0 text-xs font-bold uppercase tracking-wide">
              Agotado
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category badges */}
        <div className="flex flex-wrap gap-1">
          {producto.categoria && (
            <span className="text-xs text-[#C9A227]/70 uppercase tracking-wider">
              {producto.categoria.nombre}
            </span>
          )}
          {producto.subcategoria && (
            <span className="text-xs text-[#F4EFE4]/40 uppercase tracking-wider">
              · {producto.subcategoria}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display text-[#F4EFE4] text-base font-bold leading-tight line-clamp-2">
          {producto.nombre}
        </h3>

        {/* Volume */}
        {producto.volumen_ml && (
          <p className="text-xs text-[#F4EFE4]/40">{producto.volumen_ml} ml</p>
        )}

        {/* Price */}
        <p className="font-display text-[#C9A227] text-xl font-bold mt-auto">
          {formatARS(producto.precio_centavos)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#C9A227]/10">
          <span className="text-xs text-[#F4EFE4]/40">
            Stock: {producto.stock}
          </span>
          <Button
            size="sm"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {isOutOfStock ? 'Agotado' : 'Agregar'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
