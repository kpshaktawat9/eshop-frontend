import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

function statusBadge(status) {
  const map = {
    pending: 'badge-yellow', confirmed: 'badge-blue', processing: 'badge-blue',
    shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red',
  };
  return map[status] || 'badge-gray';
}

export default function CustomerOrders() {
  const { shop } = useShop();
  const { isLoggedIn, customer, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!shop) return;
    getMyOrders(shop.id)
      .then((r) => setOrders(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [shop, isLoggedIn, navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
          {customer && (
            <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {customer.name}
              {customer.email && <> · {customer.email}</>}
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-6xl mb-3">📋</p>
          <h3 className="font-semibold text-slate-700 mb-1">No orders yet</h3>
          <p className="text-slate-400 text-sm mb-5">You haven't placed any orders yet.</p>
          <Link to="/products"><button className="btn-primary px-8 py-2.5">Start Shopping</button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Order Number</p>
                  <p className="font-bold font-mono text-slate-800 text-sm">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${statusBadge(order.status)} capitalize mb-1.5 block`}>{order.status}</span>
                  <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="px-5 py-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-slate-600 mb-1.5">
                    <span className="flex-1 min-w-0 truncate pr-3">
                      {item.product_name}
                      {item.variant_info ? <span className="text-slate-400"> ({item.variant_info})</span> : ''}
                      {item.quantity > 1 ? <span className="text-slate-400"> ×{item.quantity}</span> : ''}
                    </span>
                    <span className="font-medium shrink-0">Rs. {parseFloat(item.total_price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-bold text-sm">
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="px-5 pb-4">
                <Link to={`/track-order?number=${order.order_number}`}>
                  <button className="btn-outline text-xs py-2 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    Track Order
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
