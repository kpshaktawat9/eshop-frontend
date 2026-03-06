import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../api/productApi';
import ProductCard from '../components/ui/ProductCard';
import Spinner from '../components/ui/Spinner';
import { useShop } from '../context/ShopContext';

export default function Home() {
  const { shop } = useShop();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    Promise.all([
      getCategories(shop.id),
      getProducts(shop.id, { per_page: 8 }),
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [shop]);

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner size="lg" />
        <p>Loading store...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <section
        className="relative flex items-center justify-center text-white"
        style={{
          minHeight: 320,
          background: shop?.banner_url
            ? `url(${shop.banner_url}) center/cover no-repeat`
            : 'var(--color-primary)',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-6 py-16">
          {shop?.logo_url && (
            <img src={shop.logo_url} alt={shop.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg" />
          )}
          <h1 className="text-4xl font-bold drop-shadow mb-2">{shop?.name}</h1>
          {shop?.meta_description && (
            <p className="text-white/80 text-lg max-w-xl mx-auto">{shop.meta_description}</p>
          )}
          <Link to="/products">
            <button className="btn-primary mt-6 text-base px-8 py-3">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">

        {/* Categories */}
        {categories.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Browse Categories</h2>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/products"
                className="px-5 py-2 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category_id=${cat.id}`}
                  className="px-5 py-2 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="mt-10 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Featured Products</h2>
            <Link to="/products" className="text-sm text-primary font-medium hover:underline">
              View all →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-5xl mb-3">📦</p>
              <p>No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
