import { Link, useLocation, useParams } from 'react-router-dom';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-xl mx-auto px-4 py-14">

      {/* Success header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Order Placed!</h1>
        <p className="text-slate-400 text-sm">Thank you! We'll process your order shortly.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
          <span className="text-sm font-medium text-slate-500">Order Number</span>
          <span className="font-bold text-slate-800 font-mono">{orderNumber}</span>
        </div>

        {order && (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-500">Payment</span>
              <span className="text-sm font-semibold capitalize">{order.payment_method === 'cod' ? '💵 Cash on Delivery' : '💳 Online'}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-500">Status</span>
              <span className="badge badge-yellow capitalize">{order.status}</span>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Items</p>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-slate-600 mb-2">
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
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/track-order?number=${orderNumber}`}>
          <button className="btn-outline px-6 py-2.5 w-full sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Track Order
          </button>
        </Link>
        <Link to="/products">
          <button className="btn-primary px-6 py-2.5 w-full sm:w-auto">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}
