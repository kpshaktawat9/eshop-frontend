import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const image = product.cover_image_url || null;
  const price = parseFloat(product.base_price).toFixed(2);
  const outOfStock = !product.has_variant && product.stock !== null && product.stock === 0;

  function handleQuickAdd(e) {
    e.preventDefault();
    if (product.has_variant) return;
    if (outOfStock) return;
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      price: parseFloat(product.base_price),
      image,
    });
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-slate-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-slate-50 relative">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-400"
            style={{ transition: 'transform 0.4s ease' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200 text-5xl">📦</div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}

        {/* Hover overlay */}
        {!outOfStock && (
          <div className="product-overlay">
            <span className="bg-white text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              {product.has_variant ? 'Select Options' : 'Quick View'}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        {product.category && (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{product.category.name}</p>
        )}
        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-2.5 leading-snug">{product.name}</h3>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-base" style={{ color: 'var(--color-primary)' }}>Rs. {price}</span>
          </div>
          {!product.has_variant && !outOfStock ? (
            <button
              onClick={handleQuickAdd}
              className="btn-primary text-xs px-3 py-1.5 shrink-0"
            >
              + Add
            </button>
          ) : product.has_variant ? (
            <span className="text-[11px] text-slate-400 font-medium shrink-0">Options →</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
