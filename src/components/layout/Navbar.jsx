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
  const [searchQuery, setSearchQuery] = useState('');

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

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  }

  const topCategories = categories.filter((c) => !c.parent_id);

  return (
    <header className="sticky top-0 z-50 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>

      {/* ── Main header row ── */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          {shop?.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} className="h-10 w-10 rounded-full object-cover border border-slate-100" />
          ) : (
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'var(--color-primary)' }}
            >
              {(shop?.name || 'S')[0].toUpperCase()}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="font-extrabold text-slate-900 text-base leading-tight" style={{ color: 'var(--color-primary)' }}>
              {shop?.name || 'Shop'}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight tracking-wide uppercase">Online Store</p>
          </div>
        </Link>

        {/* Search bar — center */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden sm:flex">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full h-11 pl-4 pr-12 rounded-lg border-2 text-sm bg-slate-50 outline-none transition-all"
              style={{ borderColor: 'var(--color-primary)' }}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center rounded-r-lg text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto sm:ml-0 shrink-0">

          {/* User */}
          {isLoggedIn ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600 group-hover:text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">{customer?.name?.split(' ')[0]}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{customer?.name}</p>
                  </div>
                  <Link to="/account/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Login</span>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Cart</span>
            {count > 0 && (
              <span className="absolute top-0.5 right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-0.5"
                style={{ backgroundColor: 'var(--color-primary)' }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="sm:hidden flex flex-col items-center px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {mobileOpen
              ? <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            }
          </button>
        </div>
      </div>

      {/* ── Category nav bar (desktop) ── */}
      <div className="hidden sm:block border-t border-slate-100" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0 text-sm font-medium overflow-x-auto">

            {/* Home */}
            <Link
              to="/"
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 whitespace-nowrap border-b-2 border-transparent hover:border-slate-300 transition-all"
            >
              Home
            </Link>

            {/* Categories dropdown or All Products */}
            {topCategories.length > 0 ? (
              <div ref={catRef} className="relative">
                <button
                  onClick={() => setCatOpen((o) => !o)}
                  className="flex items-center gap-1 px-4 py-2.5 text-slate-600 hover:text-slate-900 whitespace-nowrap border-b-2 border-transparent hover:border-slate-300 transition-all"
                >
                  Categories
                  <svg className={`w-3 h-3 transition-transform ${catOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {catOpen && (
                  <div className="absolute left-0 top-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-visible z-50 min-w-[220px]" style={{ marginTop: '0px' }}>
                    <Link
                      to="/products"
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-800 hover:bg-slate-50 font-semibold border-b border-slate-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                      </svg>
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
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <span>{cat.name}</span>
                          {cat.children?.length > 0 && (
                            <svg className="w-3.5 h-3.5 text-slate-400 ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </Link>
                        {cat.children?.length > 0 && hoveredCat === cat.id && (
                          <div className="absolute left-full top-0 ml-0.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 min-w-[180px]">
                            {cat.children.map((child) => (
                              <Link
                                key={child.id}
                                to={`/products?category_id=${child.id}`}
                                onClick={() => setCatOpen(false)}
                                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
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
              <Link to="/products" className="px-4 py-2.5 text-slate-600 hover:text-slate-900 whitespace-nowrap border-b-2 border-transparent hover:border-slate-300 transition-all">Products</Link>
            )}

            {/* Direct category links (top 5) */}
            {topCategories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category_id=${cat.id}`}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 whitespace-nowrap border-b-2 border-transparent transition-all"
                style={{ borderBottomColor: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
              >
                {cat.name}
              </Link>
            ))}

            <Link to="/track-order" className="px-4 py-2.5 text-slate-600 hover:text-slate-900 whitespace-nowrap border-b-2 border-transparent hover:border-slate-300 transition-all ml-auto">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 max-h-[75vh] overflow-y-auto">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-slate-100">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-4 pr-10 rounded-lg border text-sm outline-none bg-slate-50"
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>
          </div>
          <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-slate-800 border-b border-slate-100">🏠 Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-slate-800 border-b border-slate-100">🛍️ All Products</Link>
          {topCategories.map((cat) => (
            <div key={cat.id}>
              <Link
                to={`/products?category_id=${cat.id}`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-700 border-b border-slate-100"
              >
                {cat.name}
              </Link>
              {cat.children?.map((child) => (
                <Link
                  key={child.id}
                  to={`/products?category_id=${child.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 pl-8 text-sm text-slate-500 border-b border-slate-50"
                >
                  ↳ {child.name}
                </Link>
              ))}
            </div>
          ))}
          <Link to="/track-order" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-slate-800 border-b border-slate-100">📦 Track Order</Link>
          {!isLoggedIn && <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-slate-800">👤 Login / Register</Link>}
        </div>
      )}
    </header>
  );
}
