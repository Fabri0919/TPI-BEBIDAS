import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCart } from '@/hooks/useCart'
import { formatARS } from '@/lib/formatters'

export default function CartPage() {
  const { items, updateQty, removeItem, totalCentavos, totalItems } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-[#C9A227]/30 mx-auto" />
          <h2 className="font-display text-2xl text-[#F4EFE4]">
            Tu carrito está vacío
          </h2>
          <p className="text-[#F4EFE4]/50 text-sm">
            Explorá el catálogo y agregá productos.
          </p>
          <Button
            asChild
            className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold mt-2"
          >
            <Link to="/productos">Ir al catálogo</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1628] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl text-[#F4EFE4] font-bold mb-8">
          Mi carrito
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items table */}
          <div className="flex-1">
            <div className="rounded-xl border border-[#C9A227]/20 overflow-hidden bg-[#0D1E35]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#C9A227]/10 hover:bg-transparent">
                    <TableHead className="text-[#F4EFE4]/50 font-semibold">Producto</TableHead>
                    <TableHead className="text-[#F4EFE4]/50 font-semibold text-center">
                      Cantidad
                    </TableHead>
                    <TableHead className="text-[#F4EFE4]/50 font-semibold text-right">
                      Precio unit.
                    </TableHead>
                    <TableHead className="text-[#F4EFE4]/50 font-semibold text-right">
                      Subtotal
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.producto_id}
                      className="border-[#C9A227]/10 hover:bg-[#C9A227]/5"
                    >
                      {/* Product */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-[#16161D] border border-[#C9A227]/20 overflow-hidden flex-shrink-0">
                            {item.imagen_url ? (
                              <img
                                src={item.imagen_url}
                                alt={item.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-base">
                                🍾
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-[#F4EFE4] font-medium">
                            {item.nombre}
                          </span>
                        </div>
                      </TableCell>

                      {/* Qty stepper */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() =>
                              updateQty(item.producto_id, item.cantidad - 1)
                            }
                            disabled={item.cantidad <= 1}
                            className="w-7 h-7 rounded border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] disabled:opacity-30 hover:bg-[#C9A227]/10"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm text-[#F4EFE4]">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(item.producto_id, item.cantidad + 1)
                            }
                            disabled={item.cantidad >= item.stockMax}
                            className="w-7 h-7 rounded border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] disabled:opacity-30 hover:bg-[#C9A227]/10"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right text-sm text-[#F4EFE4]/70">
                        {formatARS(item.precio_centavos)}
                      </TableCell>

                      {/* Subtotal */}
                      <TableCell className="text-right text-sm font-semibold text-[#C9A227]">
                        {formatARS(item.precio_centavos * item.cantidad)}
                      </TableCell>

                      {/* Remove */}
                      <TableCell className="text-center">
                        <button
                          onClick={() => removeItem(item.producto_id)}
                          className="text-[#F4EFE4]/30 hover:text-danger transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-[#0D1E35] border border-[#C9A227]/20 rounded-xl p-6 space-y-4 sticky top-24">
              <h3 className="font-display text-lg text-[#F4EFE4] font-bold">
                Resumen
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#F4EFE4]/60">
                  <span>Productos ({totalItems})</span>
                  <span>{formatARS(totalCentavos)}</span>
                </div>
                <div className="border-t border-[#C9A227]/20 pt-2 flex justify-between font-bold text-[#F4EFE4]">
                  <span>Total</span>
                  <span className="font-display text-[#C9A227] text-xl">
                    {formatARS(totalCentavos)}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold"
              >
                Ir a checkout
              </Button>
              <Link
                to="/productos"
                className="block text-center text-xs text-[#F4EFE4]/40 hover:text-[#C9A227] transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
