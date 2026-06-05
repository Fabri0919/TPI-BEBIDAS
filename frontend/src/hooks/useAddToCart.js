import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

/**
 * Single source of truth for the "add to cart requires authentication" policy.
 *
 * Guests can browse the public catalog, but the cart is gated: trying to add
 * a product without a session redirects to /login (preserving the current
 * location so the user returns here after signing in).
 *
 * @returns {(producto: object, cantidad?: number) => boolean} addToCart —
 *   returns true when the item was added, false when the action was blocked
 *   (guest redirected to login). May throw if the product is out of stock,
 *   so callers should keep their own try/catch for that case.
 */
export function useAddToCart() {
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (producto, cantidad = 1) => {
      if (!isAuthenticated) {
        toast.info('Iniciá sesión para agregar productos al carrito')
        navigate('/login', { state: { from: location } })
        return false
      }
      addItem(producto, cantidad)
      return true
    },
    [isAuthenticated, addItem, navigate, location]
  )
}
