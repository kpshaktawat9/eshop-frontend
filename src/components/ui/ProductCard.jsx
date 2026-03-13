import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const image = product.cover_image_url || null;
  const price = parseFloat(product.base_price).toFixed(2);
  const outOfStock = !product.has_variant && product.stock !== null && product.stock === 0;

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (product.has_variant || outOfStock) return;
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      price: parseFloat(product.base_price),
      image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '120%' }}>
        <div className="absolute inset-0">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-200 text-5xl bg-gray-50">📦</div>
          )}

          {/* Out of stock ribbon */}
          {outOfStock && (
            <div className="oos-ribbon">Out of Stock</div>
          )}

          {/* Heart wishlist icon (visual) */}
          <div className="product-wish">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-600 hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>

          {/* Slide-up Add to Bag bar */}
          {!outOfStock && (
            <div
              className="product-add-bar"
              onClick={handleQuickAdd}
            >
              {justAdded ? (
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Added!
                </span>
              ) : product.has_variant ? (
                'Select Options'
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Add to Bag
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        {product.category && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{product.category.name}</p>
        )}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between gap-1">
          <span className="font-extrabold text-slate-900 text-sm">Rs. {price}</span>
          {product.has_variant && !outOfStock && (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              Options
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
