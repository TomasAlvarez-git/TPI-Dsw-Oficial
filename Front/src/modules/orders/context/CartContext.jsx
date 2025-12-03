// CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {

  // Cargar carrito desde localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');

      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error al leer carrito:', e);

      return [];
    }
  });

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Identificador seguro
  const getSafeId = (product) => product.id ?? product.sku;

  // Obtener stock desde el producto
  const getStockFromProduct = (p) => Number(
    p.stockQuantity ??
    p.stock ??
    p.stockAvailable ??
    p.currentStock ??
    p.quantityAvailable ??
    p.stockUnits ??
    0,
  );

  // --------------------------
  // AGREGAR AL CARRITO
  // --------------------------
  const addToCart = (product, quantity = 1) => {
    if (quantity < 1) return false;

    const productId = getSafeId(product);
    const stock = getStockFromProduct(product);

    setCartItems(prev => {

      const existing = prev.find(i => i.id === productId);

      // Si ya existe, validar stock
      if (existing) {
        if (existing.quantity + quantity > stock) return prev;

        return prev.map(i =>
          i.id === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }

      // Nuevo producto
      const price = product.currentPrice ?? product.currentUnitPrice ?? 0;

      // Si la cantidad inicial supera stock
      if (quantity > stock) return prev;

      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          price,
          quantity,
          sku: product.sku,
          stock, // guardamos stock dentro del carrito
        },
      ];
    });

    return true;
  };

  // --------------------------
  // QUITAR PRODUCTO
  // --------------------------
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.id !== productId));
  };

  // --------------------------
  // CAMBIAR CANTIDAD (sumar/restar/escribir)
  // --------------------------
  const updateQuantity = (productId, newQuantity) => {

    return setCartItems(prev => {

      return prev.map(item => {
        if (item.id !== productId) return item;

        const stock = item.stock ?? 0;

        // VALIDACIÓN: no pasar stock
        if (newQuantity > stock) {
          console.warn('Stock excedido');

          return item; // NO cambies nada
        }

        // Cantidad mínima = 1
        const fixedQty = Math.max(1, newQuantity);

        return { ...item, quantity: fixedQty };
      });
    });
  };

  // --------------------------
  // LIMPIAR TODO
  // --------------------------
  const clearCart = () => setCartItems([]);

  // --------------------------
  // TOTALES
  // --------------------------
  const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalCount,
      totalAmount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);