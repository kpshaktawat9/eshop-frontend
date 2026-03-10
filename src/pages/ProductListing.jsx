import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../api/productApi';
import ProductCard from '../components/ui/ProductCard';
import Spinner from '../components/ui/Spinner';
import { useShop } from '../context/ShopContext';

export default function ProductListing() {
  const { shop } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category_id') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if (!shop) return;
    getCategories(shop.id).then((r) => setCategories(r.data.data || []));
  }, [shop]);

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    getProducts(shop.id, { search, category_id: categoryId || undefined, page, per_page: 12 })
      .then((r) => {
        setProducts(r.data.data || []);
        setMeta(r.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [shop, search, categoryId, page]);

  function setParam(key, val) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set(key, val); else next.delete(key);
      next.delete('page');
      return next;
    });
  }

  function goPage(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', p);
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const selectedCat = categories.find((c) => String(c.id) === String(categoryId));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <span>Home</span>
          <span>›</span>
          <span className="text-slate-600 font-medium">
            {selectedCat ? selectedCat.name : 'All Products'}
          </span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-slate-800">
            {selectedCat ? selectedCat.name : 'All Products'}
          </h1>
          {!loading && meta && (
            <span className="text-sm text-slate-400">
              {meta.total ?? products.length} products
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={search}
              onKeyDown={(e) => { if (e.key === 'Enter') setParam('search', e.target.value); }}
              onBlur={(e) => setParam('search', e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <select
              value={categoryId}
              onChange={(e) => setParam('category_id', e.target.value)}
              className="input-field pl-9 pr-8 sm:w-52 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {(search || categoryId) && (
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition whitespace-nowrap"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Active category pills */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setParam('category_id', '')}
              className={`cat-pill text-xs py-1 px-3 ${!categoryId ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setParam('category_id', String(c.id))}
                className={`cat-pill text-xs py-1 px-3 ${String(c.id) === String(categoryId) ? 'active' : ''}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-5xl mb-3">🔍</p>
          <p className="font-medium text-slate-600 mb-1">No products found</p>
          <p className="text-sm text-slate-400 mb-5">Try adjusting your search or filters</p>
          <button onClick={() => setSearchParams({})} className="btn-outline text-sm">Clear all filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => page > 1 && goPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ‹ Prev
              </button>
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goPage(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                    p === meta.current_page
                      ? 'text-white border-transparent shadow'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                  style={p === meta.current_page ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => page < meta.last_page && goPage(page + 1)}
                disabled={page >= meta.last_page}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
