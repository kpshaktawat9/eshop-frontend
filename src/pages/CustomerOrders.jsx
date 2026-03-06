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
  }, [shop, isLoggedIn]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
          {customer && <p className="text-slate-500 text-sm">{customer.name} · {customer.email}</p>}
        </div>
        <button onClick={logout} className="text-sm text-red-400 hover:text-red-600">Logout</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">📋</p>
          <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products"><button className="btn-primary px-8 py-2.5">Start Shopping</button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Order Number</p>
                  <p className="font-bold font-mono text-slate-800">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${statusBadge(order.status)} capitalize mb-1 block`}>{order.status}</span>
                  <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4">
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
                <div className="border-t border-slate-100 mt-2 pt-2 flex justify-between font-bold text-sm">
                  <span>Total</span>
                  <span className="text-primary">Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="px-4 pb-4">
                <Link to={`/track-order?number=${order.order_number}`}>
                  <button className="btn-outline text-sm py-2 px-4">Track Order</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
