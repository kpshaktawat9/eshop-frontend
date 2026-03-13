import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCarousels, getCategories, getDeals, getProducts } from '../api/productApi';
import DealsSlider from '../components/ui/DealsSlider';
import ImageCarousel from '../components/ui/ImageCarousel';
import ProductCard from '../components/ui/ProductCard';
import Spinner from '../components/ui/Spinner';
import { useShop } from '../context/ShopContext';

const FEATURES = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: 'Free Delivery',
    desc: 'On all orders',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    title: 'Easy Returns',
    desc: '10-day return policy',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: '100% Secure',
    desc: 'Safe & protected',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    title: '24/7 Support',
    desc: 'Always here for you',
  },
];

export default function Home() {
  const { shop } = useShop();
  const [carousels, setCarousels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    Promise.all([
      getCarousels(shop.id),
      getCategories(shop.id),
      getDeals(shop.id),
      getProducts(shop.id, { per_page: 8 }),
    ])
      .then(([carRes, catRes, dealRes, prodRes]) => {
        setCarousels(carRes.data.data || []);
        setCategories(catRes.data.data || []);
        setDeals(dealRes.data.data || []);
        setProducts(prodRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [shop]);

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner size="lg" />
        <p className="text-slate-500 font-medium">Loading store...</p>
      </div>
    );
  }

  const topCats = categories.filter((c) => !c.parent_id);

  return (
    <div className="bg-gray-50">

      {/* Announcement bar */}
      <div className="announce-bar">
        🚚 Free delivery on all orders &nbsp;·&nbsp; 🔒 Secure payments &nbsp;·&nbsp; ↩️ Easy 10-day returns
      </div>

      {/* Carousel or fallback hero */}
      {carousels.length > 0 ? (
        <ImageCarousel slides={carousels} />
      ) : (
        <section
          className="relative flex items-center justify-center text-white overflow-hidden"
          style={{
            minHeight: 420,
            background: shop?.banner_url
              ? `url(${shop.banner_url}) center/cover no-repeat`
              : `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center px-6 py-16 max-w-2xl mx-auto">
            {shop?.logo_url && (
              <img src={shop.logo_url} alt={shop.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-5 border-4 border-white shadow-xl" />
            )}
            <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg mb-3">{shop?.name}</h1>
            {shop?.meta_description && (
              <p className="text-white/85 text-lg max-w-xl mx-auto mb-7">{shop.meta_description}</p>
            )}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/products">
                <button className="btn-primary text-sm px-8 py-3.5 shadow-lg" style={{ borderRadius: '9999px' }}>Shop Now →</button>
              </Link>
              <Link to="/track-order">
                <button className="bg-white/15 border border-white/50 text-white font-bold px-6 py-3.5 text-sm hover:bg-white/25 transition" style={{ borderRadius: '9999px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Track Order
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust features strip */}
      <div className="bg-white border-b border-gray-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3 py-1 px-2">
              <span className="shrink-0" style={{ color: 'var(--color-primary)' }}>{f.icon}</span>
              <div>
                <p className="font-bold text-slate-800 text-xs leading-tight">{f.title}</p>
                <p className="text-slate-400 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* Deals slider */}
        {deals.length > 0 && <DealsSlider deals={deals} />}

        {/* Shop by Category */}
        {topCats.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Shop by Category</h2>
              <Link to="/products" className="text-xs font-bold uppercase tracking-wide hover:underline" style={{ color: 'var(--color-primary)' }}>
                View All →
              </Link>
            </div>

            {topCats.some((c) => c.image_url) ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                <Link to="/products" className="group flex flex-col items-center gap-2">
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl border-2 border-transparent group-hover:shadow-md transition-all" style={{ '--tw-border-opacity': 1 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    🛍️
                  </div>
                  <span className="text-xs font-semibold text-slate-600 text-center">All</span>
                </Link>
                {topCats.map((cat) => (
                  <Link key={cat.id} to={`/products?category_id=${cat.id}`} className="group flex flex-col items-center gap-2">
                    <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-transparent group-hover:shadow-md transition-all"
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-2xl">🏷️</div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 text-center leading-tight line-clamp-2 px-1">{cat.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex gap-2.5 flex-wrap">
                <Link to="/products"><span className="cat-pill active">All</span></Link>
                {topCats.map((cat) => (
                  <Link key={cat.id} to={`/products?category_id=${cat.id}`}>
                    <span className="cat-pill">{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Featured Products */}
        <section className="mt-12 mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="text-xs font-bold uppercase tracking-wide hover:underline" style={{ color: 'var(--color-primary)' }}>
              View All →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100">
              <p className="text-5xl mb-3">📦</p>
              <p className="font-medium">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        {/* Bottom CTA banner */}
        {products.length > 0 && (
          <section className="mb-14">
            <div
              className="rounded-2xl p-10 text-center text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)` }}
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Explore More</p>
                <h3 className="text-2xl font-extrabold mb-2">Discover Our Full Collection</h3>
                <p className="text-white/75 text-sm mb-6 max-w-sm mx-auto">Browse all our products and find exactly what you're looking for.</p>
                <Link to="/products">
                  <button className="bg-white font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors shadow-lg" style={{ color: 'var(--color-primary)' }}>
                    Browse All Products
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
