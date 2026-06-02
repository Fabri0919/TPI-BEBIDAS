import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const openCart = () => setShowCart(true);
  const closeCart = () => setShowCart(false);
  const clearCart = () => setCart([]);
  
  const addToCart = (productId) => {
    setCart((prev) => {
      const item = prev.find((p) => p.productId === productId);

      if (item) {
        return prev.map((p) =>
          p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }

      return [...prev, { productId, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p,
      ),
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p,
        )
        .filter((p) => p.quantity > 0),
    );
  };

  const getQuantity = (productId) => {
    const item = cart.find((p) => p.productId === productId);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
  <CartContext.Provider
    value={{
      cart,
      totalItems,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      getQuantity,
      clearCart,
      showCart,
      openCart,
      closeCart,
    }}
  >
    {children}
  </CartContext.Provider>

  );
};

export const useCart = () => useContext(CartContext);
