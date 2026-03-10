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
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Track Your Order</h1>
      <p className="text-slate-400 text-sm mb-7">Enter your order number to see the latest status.</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
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
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. ABCD-1234567890"
            className="input-field pl-9"
          />
        </div>
        <button type="submit" className="btn-primary px-5">Track</button>
      </form>

      {loading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Order Number</p>
              <p className="font-bold font-mono text-slate-800">{order.order_number}</p>
            </div>
            <span className={`badge ${statusBadge(order.status)} capitalize`}>{order.status}</span>
          </div>

          {/* Progress tracker */}
          {order.status !== 'cancelled' && (
            <div className="px-5 py-6 border-b border-slate-100">
              <div className="flex items-center">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const last = i === STATUS_STEPS.length - 1;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`step-dot ${done ? 'done' : 'idle'}`}
                          style={done ? { backgroundColor: 'var(--color-primary)' } : {}}
                        >
                          {done ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1.5 capitalize text-center leading-tight max-w-[3.5rem]">{step}</span>
                      </div>
                      {!last && (
                        <div
                          className="h-0.5 flex-1 mx-1 -mt-5"
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
          <div className="px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Items</p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-slate-600 mb-1.5">
                <span className="flex-1 min-w-0 truncate pr-3">
                  {item.product_name}
                  {item.variant_info ? ` (${item.variant_info})` : ''}
                  {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                </span>
                <span className="font-medium shrink-0">Rs. {parseFloat(item.total_price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            {order.tracking_number && (
              <p className="mt-3 text-sm text-slate-500 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                Tracking #: <span className="font-mono font-semibold text-slate-700">{order.tracking_number}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
