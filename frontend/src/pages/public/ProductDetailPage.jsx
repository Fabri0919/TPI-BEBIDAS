import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, ArrowLeft, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAddToCart } from '@/hooks/useAddToCart'
import { formatARS } from '@/lib/formatters'
import * as productoService from '@/services/productoService'

export default function ProductDetailPage() {
  const { id } = useParams()
  const addToCart = useAddToCart()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setLoading(true)
    productoService
      .getById(id)
      .then((data) => {
        setProducto(data.producto || data)
        setLoading(false)
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="h-96 rounded-2xl bg-[#16161D]" />
          <div className="space-y-4">
            <Skeleton className="h-8 bg-[#16161D] w-3/4" />
            <Skeleton className="h-4 bg-[#16161D] w-1/2" />
            <Skeleton className="h-16 bg-[#16161D]" />
            <Skeleton className="h-10 bg-[#16161D] w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !producto) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <p className="text-[#F4EFE4]/40 text-xl mb-6">Producto no encontrado.</p>
        <Link
          to="/productos"
          className="text-[#C9A227] hover:text-[#E0C56A] flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
      </div>
    )
  }

  const isOutOfStock = producto.stock === 0
  const maxQty = producto.stock
  const categoria = producto.categoria?.nombre || ''

  function increment() {
    setQty((q) => Math.min(q + 1, maxQty))
  }
  function decrement() {
    setQty((q) => Math.max(q - 1, 1))
  }

  function handleAddToCart() {
    if (isOutOfStock) return
    try {
      if (addToCart(producto, qty)) {
        toast.success(`${producto.nombre} agregado al carrito`, {
          description: `${qty} unidad${qty > 1 ? 'es' : ''}`,
        })
      }
    } catch {
      toast.error('No se pudo agregar al carrito')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        to="/productos"
        className="inline-flex items-center gap-2 text-sm text-[#F4EFE4]/50 hover:text-[#C9A227] mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden bg-[#0D1E35] border border-[#C9A227]/20 aspect-[3/4] flex items-center justify-center"
        >
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-9xl opacity-20">🍾</div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {categoria && (
              <Badge className="bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30 text-xs uppercase tracking-wider">
                {categoria}
              </Badge>
            )}
            {producto.subcategoria && (
              <Badge className="bg-[#16161D] text-[#F4EFE4]/60 border-[#F4EFE4]/10 text-xs">
                {producto.subcategoria}
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-danger/20 text-danger border-danger/30 text-xs">
                Agotado
              </Badge>
            )}
          </div>

          {/* Name */}
          <h1 className="font-display text-3xl sm:text-4xl text-[#F4EFE4] font-bold leading-tight">
            {producto.nombre}
          </h1>

          {/* Volume */}
          {producto.volumen_ml && (
            <p className="text-[#F4EFE4]/50 text-sm">{producto.volumen_ml} ml</p>
          )}

          {/* Description */}
          {producto.descripcion && (
            <p className="text-[#F4EFE4]/70 text-sm leading-relaxed">
              {producto.descripcion}
            </p>
          )}

          {/* Price */}
          <p className="font-display text-4xl text-[#C9A227] font-bold">
            {formatARS(producto.precio_centavos)}
          </p>

          {/* Stock info */}
          <p className="text-sm text-[#F4EFE4]/40">
            Stock disponible: {producto.stock} unidades
          </p>

          {/* Qty stepper + Add to cart */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#C9A227]/30 rounded-lg overflow-hidden">
                <button
                  onClick={decrement}
                  disabled={qty <= 1}
                  className="px-3 py-2 text-[#C9A227] hover:bg-[#C9A227]/10 disabled:opacity-30 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-[#F4EFE4] font-medium min-w-[3rem] text-center">
                  {qty}
                </span>
                <button
                  onClick={increment}
                  disabled={qty >= maxQty}
                  className="px-3 py-2 text-[#C9A227] hover:bg-[#C9A227]/10 disabled:opacity-30 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          )}

          {isOutOfStock && (
            <Button disabled size="lg" className="w-full opacity-40 cursor-not-allowed">
              Agotado
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
