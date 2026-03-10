import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12">
          <div className="text-7xl mb-5">🛒</div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-7 text-sm">Looks like you haven't added anything yet.</p>
          <Link to="/products">
            <button className="btn-primary px-8 py-3">Start Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
          <p className="text-slate-400 text-sm mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const key = `${item.productId}-${item.variantId ?? 'none'}`;
            return (
              <div key={key} className="bg-white rounded-xl p-4 border border-slate-100 flex gap-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-slate-200">📦</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate">{item.name}</h3>
                  {item.variantLabel && (
                    <p className="text-xs text-slate-400 mt-0.5">{item.variantLabel}</p>
                  )}
                  <p className="font-bold text-sm mt-1.5" style={{ color: 'var(--color-primary)' }}>
                    Rs. {item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors text-lg leading-none text-slate-600"
                      >−</button>
                      <span className="px-3 py-1.5 text-sm font-semibold border-x border-slate-200 text-slate-800 min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors text-lg leading-none text-slate-600"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="shrink-0 text-right">
                  <p className="font-bold text-slate-800 text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl p-5 border border-slate-100 sticky top-20" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-slate-800 text-lg mb-4">Order Summary</h2>

            <div className="space-y-2.5 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3 text-base"
            >
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            <Link to="/products">
              <button className="btn-outline w-full py-2.5 mt-2.5 text-sm">
                Continue Shopping
              </button>
            </Link>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
