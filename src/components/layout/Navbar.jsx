import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';

export default function Navbar() {
  const { shop } = useShop();
  const { count } = useCart();
  const { isLoggedIn, customer, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  }

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo / Shop name */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg shrink-0">
          {shop?.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} className="h-9 w-9 rounded-full object-cover bg-white" />
          ) : (
            <span className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🏪</span>
          )}
          <span className="hidden sm:block">{shop?.name || 'Shop'}</span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-6 text-white/90 text-sm font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 text-white bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            🛒
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="text-white bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
              >
                👤 <span className="hidden sm:inline">{customer?.name?.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <Link to="/account/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">My Orders</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
