import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackOrder } from '../api/orderApi';
import Spinner from '../components/ui/Spinner';
import { useShop } from '../context/ShopContext';

const STATUS_STEPS = ['pending', 'CONFIRMED', 'processing', 'shipped', 'delivered'];
// const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'];

function statusBadge(status) {
  const map = {
    pending: 'badge-yellow',
    confirmed: 'badge-blue',
    processing: 'badge-blue',
    shipped: 'badge-blue',
    delivered: 'badge-green',
    cancelled: 'badge-red',
  };
  return map[status] || 'badge-gray';
}

export default function OrderTracking() {
  const { shop } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [number, setNumber] = useState(searchParams.get('number') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const n = searchParams.get('number');
    if (n) { setNumber(n); fetchOrder(n); }
  }, []);

  async function fetchOrder(n) {
    if (!shop || !n.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await trackOrder(shop.id, n.trim());
      setOrder(data.data);
    } catch {
      setError('Order not found. Please check the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setSearchParams({ number });
    fetchOrder(number);
  }

  const currentStep = STATUS_STEPS.indexOf(order?.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Track Your Order</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter your order number (e.g. ABCD-1234567890)"
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
        />
        <button type="submit" className="btn-primary px-5">Track</button>
      </form>

      {loading && <div className="flex justify-center"><Spinner size="lg" /></div>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">{error}</div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400">Order Number</p>
                <p className="font-bold font-mono text-slate-800">{order.order_number}</p>
              </div>
              <span className={`badge ${statusBadge(order.status)} capitalize`}>{order.status}</span>
            </div>
          </div>

          {/* Progress */}
          {order.status !== 'cancelled' && (
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const last = i === STATUS_STEPS.length - 1;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={done
                            ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                            : { backgroundColor: '#e2e8f0', color: '#94a3b8' }}
                        >
                          {done ? '✓' : i + 1}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 capitalize text-center">{step}</span>
                      </div>
                      {!last && (
                        <div
                          className="h-0.5 flex-1 mx-1"
                          style={{ backgroundColor: i < currentStep ? 'var(--color-primary)' : '#e2e8f0' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="p-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">Items</p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-slate-600 mb-1">
                <span>
                  {item.product_name}
                  {item.variant_info ? ` (${item.variant_info})` : ''}
                  {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                </span>
                <span>Rs. {parseFloat(item.total_price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            {order.tracking_number && (
              <p className="mt-3 text-sm text-slate-500">Tracking #: <span className="font-mono font-medium">{order.tracking_number}</span></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
