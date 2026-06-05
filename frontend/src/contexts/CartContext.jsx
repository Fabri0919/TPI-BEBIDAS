import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const CartContext = createContext(null)

const CART_KEY = 'dealers_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((producto, cantidad = 1) => {
    if (!producto || producto.stock === 0) {
      throw new Error('Producto agotado')
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.producto_id === producto.id)
      if (existing) {
        return prev.map((i) =>
          i.producto_id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, i.stockMax) }
            : i
        )
      }
      return [
        ...prev,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_centavos: producto.precio_centavos,
          cantidad: Math.min(cantidad, producto.stock),
          imagen_url: producto.imagen_url || null,
          stockMax: producto.stock,
        },
      ]
    })
  }, [])

  const updateQty = useCallback((producto_id, cantidad) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.producto_id !== producto_id))
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.producto_id === producto_id
          ? { ...i, cantidad: Math.min(Math.max(1, cantidad), i.stockMax) }
          : i
      )
    )
  }, [])

  const removeItem = useCallback((producto_id) => {
    setItems((prev) => prev.filter((i) => i.producto_id !== producto_id))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const totalCentavos = useMemo(
    () => items.reduce((acc, i) => acc + i.precio_centavos * i.cantidad, 0),
    [items]
  )

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      removeItem,
      clear,
      totalCentavos,
      totalItems,
    }),
    [items, addItem, updateQty, removeItem, clear, totalCentavos, totalItems]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
