import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';

export default function Navbar() {
  const { shop } = useShop();
  const { count } = useCart();
  const { isLoggedIn, customer, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);

  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (!shop) return;
    getCategories(shop.id)
      .then((r) => setCategories(r.data.data || []))
      .catch(() => {});
  }, [shop]);

  useEffect(() => {
    function handler(e) {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login');
    setUserOpen(false);
  }

  const topCategories = categories.filter((c) => !c.parent_id);

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg shrink-0" onClick={() => setMobileOpen(false)}>
          {shop?.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} className="h-9 w-9 rounded-full object-cover bg-white" />
          ) : (
            <span className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🏪</span>
          )}
          <span className="hidden sm:block truncate max-w-[150px]">{shop?.name || 'Shop'}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 text-white/90 text-sm font-medium">
          <Link to="/" className="px-3 py-1.5 rounded-lg hover:bg-white/15 transition-colors">Home</Link>

          {/* Categories dropdown */}
          {topCategories.length > 0 ? (
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/15 transition-colors"
              >
                Categories
                <svg className={`w-3.5 h-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {catOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 overflow-visible z-50 min-w-[200px]">
                  <Link
                    to="/products"
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium border-b border-slate-100"
                  >
                    All Products
                  </Link>
                  {topCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="relative"
                      onMouseEnter={() => setHoveredCat(cat.id)}
                      onMouseLeave={() => setHoveredCat(null)}
                    >
                      <Link
                        to={`/products?category_id=${cat.id}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <span>{cat.name}</span>
                        {cat.children?.length > 0 && (
                          <svg className="w-3.5 h-3.5 text-slate-400 ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        )}
                      </Link>

                      {/* Flyout sub-menu */}
                      {cat.children?.length > 0 && hoveredCat === cat.id && (
                        <div className="absolute left-full top-0 ml-0.5 bg-white rounded-xl shadow-lg border border-slate-100 z-50 min-w-[180px]">
                          {cat.children.map((child) => (
                            <Link
                              key={child.id}
                              to={`/products?category_id=${child.id}`}
                              onClick={() => setCatOpen(false)}
                              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link to="/products" className="px-3 py-1.5 rounded-lg hover:bg-white/15 transition-colors">Products</Link>
          )}

          <Link to="/track-order" className="px-3 py-1.5 rounded-lg hover:bg-white/15 transition-colors">Track Order</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center gap-1 text-white bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-sm font-medium">
            🛒
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* User */}
          {isLoggedIn ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="text-white bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
              >
                👤 <span className="hidden sm:inline">{customer?.name?.split(' ')[0]}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <Link to="/account/orders" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">My Orders</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-white bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-sm font-medium">Login</Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden text-white bg-white/20 hover:bg-white/30 transition w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-white/20 py-2 px-4 max-h-[70vh] overflow-y-auto">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-800 border-b border-slate-100">Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-800 border-b border-slate-100">All Products</Link>
          {topCategories.map((cat) => (
            <div key={cat.id}>
              <Link
                to={`/products?category_id=${cat.id}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-semibold text-slate-700 border-b border-slate-100"
              >
                {cat.name}
              </Link>
              {cat.children?.map((child) => (
                <Link
                  key={child.id}
                  to={`/products?category_id=${child.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 pl-6 text-sm text-slate-500 border-b border-slate-50"
                >
                  ↳ {child.name}
                </Link>
              ))}
            </div>
          ))}
          <Link to="/track-order" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-800 border-b border-slate-100">Track Order</Link>
          {!isLoggedIn && <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-800">Login / Register</Link>}
        </div>
      )}
    </nav>
  );
}
