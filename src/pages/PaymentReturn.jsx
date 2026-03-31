import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { trackOrder } from '../api/orderApi';
import Spinner from '../components/ui/Spinner';
import { useShop } from '../context/ShopContext';

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const { shop } = useShop();

  const status      = searchParams.get('status');   // 'success' | 'failed'
  const orderNumber = searchParams.get('order');

  const success = status === 'success';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderNumber);

  useEffect(() => {
    if (!orderNumber || !shop) return;
    trackOrder(shop.id, orderNumber)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderNumber, shop]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">

      {/* Status icon */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        success ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {success ? (
          <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
      </div>

      <h1 className={`text-2xl font-bold mb-2 ${success ? 'text-slate-800' : 'text-red-600'}`}>
        {success ? 'Payment Successful!' : 'Payment Failed'}
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        {success
          ? 'Your order has been confirmed and is being processed.'
          : 'Your payment could not be processed. Please try again.'}
      </p>

      {/* Order summary (if we have the data) */}
      {loading && (
        <div className="flex justify-center mb-6"><Spinner /></div>
      )}

      {order && success && (
        <div className="bg-white rounded-xl border border-slate-100 p-5 text-left mb-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p className="text-xs text-slate-400 mb-1">Order number</p>
          <p className="font-bold text-slate-800 text-base mb-3">#{order.order_number}</p>

          <div className="space-y-1.5 text-sm mb-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-slate-600">
                <span className="truncate">{item.product_name}{item.variant_info ? ` (${item.variant_info})` : ''} ×{item.quantity}</span>
                <span className="shrink-0 font-medium ml-2">Rs. {Number(item.total_price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-sm">
            <span>Total Paid</span>
            <span style={{ color: 'var(--color-primary)' }}>Rs. {Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {success && orderNumber && (
          <Link
            to={`/track-order?number=${orderNumber}`}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            Track Order
          </Link>
        )}
        {!success && (
          <Link to="/checkout" className="btn-primary px-6 py-2.5 text-sm">
            Try Again
          </Link>
        )}
        <Link to="/products" className="btn-secondary px-6 py-2.5 text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
