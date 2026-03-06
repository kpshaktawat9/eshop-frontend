import { createContext, useCallback, useContext, useState } from 'react';
import { logoutCustomer } from '../api/customerApi';
import { useShop } from './ShopContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { shop } = useShop();

  const storageKey = shop ? `customer_token_${shop.id}` : null;
  const customerKey = shop ? `customer_data_${shop.id}` : null;

  const [token, setToken] = useState(() => {
    if (!shop) return null;
    return localStorage.getItem(`customer_token_${shop.id}`) || null;
  });

  const [customer, setCustomer] = useState(() => {
    if (!shop) return null;
    try {
      const raw = localStorage.getItem(`customer_data_${shop.id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    (tok, customerData) => {
      if (!storageKey) return;
      localStorage.setItem(storageKey, tok);
      localStorage.setItem(customerKey, JSON.stringify(customerData));
      setToken(tok);
      setCustomer(customerData);
    },
    [storageKey, customerKey]
  );

  const logout = useCallback(async () => {
    if (shop && token) {
      try { await logoutCustomer(shop.id); } catch { /* ignore */ }
    }
    if (storageKey) localStorage.removeItem(storageKey);
    if (customerKey) localStorage.removeItem(customerKey);
    setToken(null);
    setCustomer(null);
  }, [shop, token, storageKey, customerKey]);

  return (
    <AuthContext.Provider value={{ customer, token, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
