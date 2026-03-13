import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../api/productApi';
import Spinner from '../components/ui/Spinner';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const { shop } = useShop();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!shop) return;
    getProduct(shop.id, slug)
      .then((r) => setProduct(r.data.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [shop, slug, navigate]);

  // Find matching variant based on selected attribute values
  const matchedVariant = useMemo(() => {
    if (!product?.has_variant || !product.variants) return null;
    const selectedIds = Object.values(selectedAttrs).map(Number);
    if (selectedIds.length === 0) return null;

    return product.variants.find((v) => {
      const variantIds = v.attribute_values.map((av) => av.attribute_value_id);
      return selectedIds.every((id) => variantIds.includes(id)) && selectedIds.length === variantIds.length;
    }) || null;
  }, [product, selectedAttrs]);

  const price = matchedVariant?.price ?? product?.base_price;
  const stock = product?.has_variant
    ? (matchedVariant?.stock_quantity ?? null)
    : product?.stock_quantity;
  const inStock = stock === null || stock > 0;

  const images = useMemo(() => {
    if (matchedVariant?.images?.length) return matchedVariant.images;
    return product?.images?.length ? product.images : [];
  }, [product, matchedVariant]);

  function handleAddToCart() {
    if (!inStock) return;

    const image = images[0] || null;
    const variantLabel = matchedVariant
      ? matchedVariant.attribute_values.map((av) => `${av.attribute_name}: ${av.value}`).join(', ')
      : null;

    addItem({
      productId: product.id,
      variantId: matchedVariant?.id ?? null,
      name: product.name,
      price: parseFloat(price),
      image,
      variantLabel,
      quantity: qty,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function selectAttr(attrId, valueId) {
    setSelectedAttrs((prev) => ({ ...prev, [attrId]: valueId }));
  }

  if (loading) return <div className="page-loader"><Spinner size="lg" /></div>;
  if (!product) return null;

  const allAttrsSelected = !product.has_variant || (
    product.attributes.length > 0 &&
    product.attributes.every((a) => selectedAttrs[a.id])
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <span>›</span>
        <Link to="/products" className="hover:text-slate-600 transition-colors">Products</Link>
        {product.category && (
          <>
            <span>›</span>
            <Link to={`/products?category_id=${product.category.id}`} className="hover:text-slate-600 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="text-slate-600 font-medium truncate max-w-[180px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Images — Myntra-style: vertical thumbnail strip on left, main image on right */}
        <div className="flex gap-3">
          {images.length > 1 && (
            <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    i === selectedImg ? 'shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={i === selectedImg ? { borderColor: 'var(--color-primary)' } : {}}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div
              className="rounded-2xl overflow-hidden bg-white aspect-square border border-slate-100"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
            >
              {images.length > 0 ? (
                <img src={images[selectedImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200 text-7xl">📦</div>
              )}
            </div>
            {/* Mobile thumbnails below main image */}
            {images.length > 1 && (
              <div className="flex sm:hidden gap-2 mt-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImg ? 'shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={i === selectedImg ? { borderColor: 'var(--color-primary)' } : {}}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <Link
              to={`/products?category_id=${product.category.id}`}
              className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors mb-3"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-slate-800 mb-3 leading-tight">{product.name}</h1>

          {/* Price */}
          <div
            className="text-3xl font-extrabold mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            Rs. {parseFloat(price).toFixed(2)}
          </div>

          {/* Stock */}
          {stock !== null && (
            <div className={`inline-flex items-center gap-1.5 text-sm mb-4 font-medium px-3 py-1 rounded-full ${
              inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              {inStock ? `In Stock${stock < 10 ? ` — only ${stock} left` : ''}` : 'Out of Stock'}
            </div>
          )}

          {/* Variant selectors */}
          {product.attributes?.map((attr) => (
            <div key={attr.id} className="mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">{attr.name}</p>
              <div className="flex flex-wrap gap-2">
                {attr.values.map((val) => (
                  <button
                    key={val.id}
                    onClick={() => selectAttr(attr.id, val.id)}
                    className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                      selectedAttrs[attr.id] === val.id
                        ? 'text-white shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}
                    style={
                      selectedAttrs[attr.id] === val.id
                        ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
                        : {}
                    }
                  >
                    {val.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-semibold text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2.5 text-lg hover:bg-slate-50 transition-colors font-medium text-slate-600"
              >−</button>
              <span className="px-5 py-2.5 font-semibold border-x border-slate-200 text-slate-800 min-w-[2.5rem] text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3.5 py-2.5 text-lg hover:bg-slate-50 transition-colors font-medium text-slate-600"
              >+</button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || (product.has_variant && !allAttrsSelected)}
            className="btn-primary w-full py-3.5 text-base mb-3"
          >
            {!inStock
              ? 'Out of Stock'
              : product.has_variant && !allAttrsSelected
              ? 'Select Options First'
              : added
              ? '✓ Added to Cart!'
              : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Add to Cart
                </>
              )}
          </button>

          <button
            onClick={() => { handleAddToCart(); navigate('/cart'); }}
            disabled={!inStock || (product.has_variant && !allAttrsSelected)}
            className="btn-outline w-full py-3.5 text-base"
          >
            Buy Now
          </button>

          {/* Trust badges */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: 'Free Delivery' },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: 'Secure Payment' },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>, text: 'Easy Returns' },
            ].map((b) => (
              <div key={b.text} className="text-xs text-slate-500">
                <span className="block mb-1 text-slate-400">{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h3 className="font-semibold text-slate-700 mb-2">Product Description</h3>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
