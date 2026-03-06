import { Link, useLocation, useParams } from 'react-router-dom';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Order Placed!</h1>
      <p className="text-slate-500 mb-6">Thank you for your order. We'll process it shortly.</p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 text-left">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-slate-500">Order Number</span>
          <span className="font-bold text-slate-800 font-mono">{orderNumber}</span>
        </div>

        {order && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-500">Payment</span>
              <span className="text-sm font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-500">Status</span>
              <span className="badge badge-yellow capitalize">{order.status}</span>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Items</p>
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
              <div className="border-t border-slate-100 mt-2 pt-2 flex justify-between font-bold text-slate-800">
                <span>Total</span>
                <span className="text-primary">Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/track-order?number=${orderNumber}`}>
          <button className="btn-outline px-6 py-2.5">Track Order</button>
        </Link>
        <Link to="/products">
          <button className="btn-primary px-6 py-2.5">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}
