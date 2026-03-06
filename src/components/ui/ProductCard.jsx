import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const image = product.cover_image_url || null;
  const price = parseFloat(product.base_price).toFixed(2);

  function handleQuickAdd(e) {
    e.preventDefault();
    if (product.has_variant) return; // navigate to detail for variant selection
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
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-slate-100 relative">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">📦</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-slate-400 mb-1">{product.category.name}</p>
        )}
        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-base">Rs. {price}</span>
          {product.has_variant ? (
            <span className="text-xs text-slate-400">Select options →</span>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="btn-primary text-xs px-3 py-1"
            >
              Add to Cart
            </button>
          )}
        </div>
        {!product.has_variant && product.stock !== null && product.stock === 0 && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
