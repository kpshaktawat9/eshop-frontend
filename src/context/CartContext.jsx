import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useShop } from './ShopContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { shop } = useShop();
  const storageKey = shop ? `cart_${shop.id}` : null;

  // Lazy initialiser — reads localStorage synchronously on first render.
  // This avoids the React 18 StrictMode race condition where a separate
  // "save" effect would overwrite localStorage with [] before the "load"
  // effect's setState was processed, causing cart wipe on every refresh.
  const [items, setItems] = useState(() => {
    if (!storageKey) return [];
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage on every change
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
