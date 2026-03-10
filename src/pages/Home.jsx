import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCarousels, getCategories, getDeals, getProducts } from '../api/productApi';
import DealsSlider from '../components/ui/DealsSlider';
import ImageCarousel from '../components/ui/ImageCarousel';
import ProductCard from '../components/ui/ProductCard';
import Spinner from '../components/ui/Spinner';
import { useShop } from '../context/ShopContext';

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
        <p>Loading store...</p>
      </div>
    );
  }

  // Flatten categories for the chip row (show top-level only)
  const topCats = categories.filter((c) => !c.parent_id);

  return (
    <div>
      {/* ── Carousel or fallback hero ──────────────────────────────────────── */}
      {carousels.length > 0 ? (
        <ImageCarousel slides={carousels} />
      ) : (
        <section
          className="relative flex items-center justify-center text-white"
          style={{
            minHeight: 320,
            background: shop?.banner_url
              ? `url(${shop.banner_url}) center/cover no-repeat`
              : 'var(--color-primary)',
          }}
        >
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
              <button className="btn-primary mt-6 text-base px-8 py-3">Shop Now</button>
            </Link>
          </div>
        </section>
      )}

      <div className="max-w-6xl mx-auto px-4">

        {/* ── Deals slider ────────────────────────────────────────────────── */}
        {deals.length > 0 && <DealsSlider deals={deals} />}

        {/* ── Categories grid with images ─────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Shop by Category</h2>
              <Link to="/products" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                All Products →
              </Link>
            </div>

            {/* Top-level categories as image cards */}
            {topCats.some((c) => c.image_url) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {topCats.map((cat) => (
                  <CategoryCard key={cat.id} cat={cat} />
                ))}
              </div>
            ) : (
              /* Fallback: pill chips */
              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/products"
                  className="px-5 py-2 rounded-full border-2 font-semibold text-sm transition-colors hover:text-white"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--color-primary)'; }}
                >
                  All
                </Link>
                {topCats.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category_id=${cat.id}`}
                    className="px-5 py-2 rounded-full border-2 font-semibold text-sm transition-colors"
                    style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Featured Products ───────────────────────────────────────────── */}
        <section className="mt-10 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Featured Products</h2>
            <Link to="/products" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
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
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CategoryCard({ cat }) {
  return (
    <Link
      to={`/products?category_id=${cat.id}`}
      className="group relative rounded-xl overflow-hidden bg-slate-100 aspect-square block hover:shadow-lg transition-shadow"
    >
      {cat.image_url ? (
        <>
          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">🏷️</div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-bold text-sm drop-shadow leading-tight">{cat.name}</p>
        {cat.children?.length > 0 && (
          <p className="text-white/70 text-xs">{cat.children.length} sub-categories</p>
        )}
      </div>
    </Link>
  );
}
