import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { formatARS } from '@/lib/formatters'

export default function CartDrawer({ open, onOpenChange }) {
  const { items, updateQty, removeItem, totalCentavos } = useCart()
  const navigate = useNavigate()

  function handleCheckout() {
    onOpenChange(false)
    navigate('/checkout')
  }

  function handleCatalog() {
    onOpenChange(false)
    navigate('/productos')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0D1E35] border-l border-[#C9A227]/20 text-[#F4EFE4] flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4 border-b border-[#C9A227]/20">
          <SheetTitle className="font-display text-[#C9A227] text-lg">
            Tu carrito
          </SheetTitle>
        </SheetHeader>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-[#C9A227]/40" />
              <p className="text-[#F4EFE4]/60 text-sm">Tu carrito está vacío</p>
              <Button
                onClick={handleCatalog}
                className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-semibold"
              >
                Ver catálogo
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.producto_id}
                className="flex gap-3 items-start py-3 border-b border-[#C9A227]/10 last:border-0"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded bg-[#16161D] border border-[#C9A227]/20 flex-shrink-0 overflow-hidden">
                  {item.imagen_url ? (
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C9A227]/40 text-xs">
                      🍾
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F4EFE4] truncate">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-[#C9A227] mt-0.5">
                    {formatARS(item.precio_centavos)}
                  </p>

                  {/* Qty stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.producto_id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                      className="w-6 h-6 rounded border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] disabled:opacity-30 hover:bg-[#C9A227]/10 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm w-6 text-center text-[#F4EFE4]">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => updateQty(item.producto_id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stockMax}
                      className="w-6 h-6 rounded border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] disabled:opacity-30 hover:bg-[#C9A227]/10 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Subtotal + remove */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-[#F4EFE4]">
                    {formatARS(item.precio_centavos * item.cantidad)}
                  </span>
                  <button
                    onClick={() => removeItem(item.producto_id)}
                    className="text-[#F4EFE4]/30 hover:text-danger transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-[#C9A227]/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#F4EFE4]/70 text-sm">Total</span>
              <span className="font-display text-lg font-bold text-[#C9A227]">
                {formatARS(totalCentavos)}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold text-sm"
            >
              Ir a checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
