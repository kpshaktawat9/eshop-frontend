import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useShop } from './ShopContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { shop } = useShop();
  const [items, setItems] = useState([]);

  const storageKey = shop ? `cart_${shop.id}` : null;

  // Load cart from localStorage when shop is known
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  // Save cart to localStorage on every change
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = useCallback((item) => {
    // item: { productId, variantId, name, price, image, variantLabel }
    setItems((prev) => {
      const key = `${item.productId}-${item.variantId ?? 'none'}`;
      const existing = prev.find((i) => `${i.productId}-${i.variantId ?? 'none'}` === key);
      if (existing) {
        return prev.map((i) =>
          `${i.productId}-${i.variantId ?? 'none'}` === key
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((productId, variantId) => {
    const key = `${productId}-${variantId ?? 'none'}`;
    setItems((prev) => prev.filter((i) => `${i.productId}-${i.variantId ?? 'none'}` !== key));
  }, []);

  const updateQty = useCallback((productId, variantId, qty) => {
    const key = `${productId}-${variantId ?? 'none'}`;
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => `${i.productId}-${i.variantId ?? 'none'}` !== key));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          `${i.productId}-${i.variantId ?? 'none'}` === key ? { ...i, quantity: qty } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
