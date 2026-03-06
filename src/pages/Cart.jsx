import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-6">Add some products to get started.</p>
        <Link to="/products"><button className="btn-primary px-8 py-2.5">Shop Now</button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600">Clear all</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const key = `${item.productId}-${item.variantId ?? 'none'}`;
            return (
              <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{item.name}</h3>
                  {item.variantLabel && <p className="text-xs text-slate-400">{item.variantLabel}</p>}
                  <p className="text-primary font-bold text-sm mt-1">Rs. {item.price.toFixed(2)}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2.5 py-1 hover:bg-slate-50 text-lg"
                      >−</button>
                      <span className="px-3 py-1 text-sm border-x border-slate-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-slate-50 text-lg"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="shrink-0 text-right">
                  <p className="font-bold text-slate-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 sticky top-20">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3 text-base">
              Proceed to Checkout
            </button>
            <Link to="/products">
              <button className="btn-outline w-full py-2.5 mt-2 text-sm">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
