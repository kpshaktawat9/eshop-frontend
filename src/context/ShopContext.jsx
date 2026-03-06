import { createContext, useContext, useEffect, useState } from 'react';
import { resolveShop } from '../api/shopApi';
import { applyTheme } from '../hooks/useTheme';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null);
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const host = window.location.hostname;

    resolveShop(host)
      .then(({ data }) => {
        setShop(data);
        setTheme(data.theme);
        applyTheme(data.theme);
        // Store shop id so axios interceptor can read it
        localStorage.setItem('current_shop_id', data.id);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to load shop.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ShopContext.Provider value={{ shop, theme, loading, error }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
