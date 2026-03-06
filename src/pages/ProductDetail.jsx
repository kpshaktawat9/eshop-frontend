import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-primary mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-square mb-3">
            {images.length > 0 ? (
              <img src={images[selectedImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl">📦</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    i === selectedImg ? 'border-primary' : 'border-transparent'
                  }`}
                  style={i === selectedImg ? { borderColor: 'var(--color-primary)' } : {}}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <p className="text-sm text-slate-400 mb-1">{product.category.name}</p>
          )}
          <h1 className="text-2xl font-bold text-slate-800 mb-3">{product.name}</h1>

          {/* Price */}
          <div className="text-3xl font-bold text-primary mb-4">
            Rs. {parseFloat(price).toFixed(2)}
          </div>

          {/* Stock */}
          {stock !== null && (
            <p className={`text-sm mb-4 font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? `✓ In Stock${stock < 10 ? ` (${stock} left)` : ''}` : '✗ Out of Stock'}
            </p>
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
                    className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium transition ${
                      selectedAttrs[attr.id] === val.id
                        ? 'text-white border-transparent'
                        : 'border-slate-200 text-slate-600 hover:border-primary'
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
            <span className="text-sm font-semibold text-slate-700">Qty:</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-lg hover:bg-slate-50">−</button>
              <span className="px-4 py-2 font-medium border-x border-slate-200">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-lg hover:bg-slate-50">+</button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || (product.has_variant && !allAttrsSelected)}
            className="btn-primary w-full py-3 text-base mb-3"
          >
            {!inStock
              ? 'Out of Stock'
              : product.has_variant && !allAttrsSelected
              ? 'Select Options'
              : added
              ? '✓ Added to Cart!'
              : 'Add to Cart'}
          </button>

          <button
            onClick={() => { handleAddToCart(); navigate('/cart'); }}
            disabled={!inStock || (product.has_variant && !allAttrsSelected)}
            className="btn-outline w-full py-3 text-base"
          >
            Buy Now
          </button>

          {/* Description */}
          {product.description && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="font-semibold text-slate-700 mb-2">Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
