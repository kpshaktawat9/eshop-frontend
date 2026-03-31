import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiatePayment } from '../api/paymentApi';
import { placeOrder } from '../api/orderApi';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';

export default function Checkout() {
  const { shop } = useShop();
  const { items, total, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    payment_method: 'cod',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: null }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.phone.trim()) e.phone = 'Phone is required.';
    if (!form.line1.trim()) e.line1 = 'Address line 1 is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        customer: { name: form.name, email: form.email || null, phone: form.phone },
        address: {
          line1: form.line1, line2: form.line2 || null,
          city: form.city, state: form.state || null,
          postal_code: form.postal_code || null, country: form.country,
        },
        payment_method: form.payment_method,
        items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId || null,
          quantity: i.quantity,
        })),
      };

      const { data } = await placeOrder(shop.id, payload);

      if (form.payment_method === 'online') {
        // Initiate gateway payment — will redirect browser to PhonePe / mock page
        clearCart();
        const { data: payData } = await initiatePayment(shop.id, data.order.id);
        window.location.href = payData.gateway_redirect_url;
        return;
      }

      clearCart();
      navigate(`/order-confirmation/${data.order_number}`, { state: { order: data.order } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  }

  const field = (label, name, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={change}
        className={`input-field ${errors[name] ? 'error' : ''}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
        <span>Cart</span>
        <span>›</span>
        <span className="text-slate-600 font-medium">Checkout</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Checkout</h1>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-5 text-sm flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {errors.general}
        </div>
      )}

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left - Form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Customer info */}
          <div className="bg-white rounded-xl p-5 border border-slate-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="step-dot done">1</div>
              <h2 className="font-semibold text-slate-800">Customer Info</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('Full Name', 'name', 'text', true)}
              {field('Phone', 'phone', 'tel', true)}
              {field('Email (optional)', 'email', 'email')}
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-xl p-5 border border-slate-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="step-dot done">2</div>
              <h2 className="font-semibold text-slate-800">Delivery Address</h2>
            </div>
            <div className="space-y-3">
              {field('Address Line 1', 'line1', 'text', true)}
              {field('Address Line 2 (optional)', 'line2')}
              <div className="grid grid-cols-2 gap-3">
                {field('City', 'city', 'text', true)}
                {field('State / Province', 'state')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('Postal Code', 'postal_code')}
                {field('Country', 'country')}
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-xl p-5 border border-slate-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="step-dot done">3</div>
              <h2 className="font-semibold text-slate-800">Payment Method</h2>
            </div>
            <div className="space-y-2">
              {[
                { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives.', icon: '💵' },
                ...(shop?.is_payment_enabled ? [{ value: 'online', label: 'Online Payment', desc: 'Pay securely online.', icon: '💳' }] : []),
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.payment_method === opt.value ? 'bg-blue-50/60' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  style={form.payment_method === opt.value ? { borderColor: 'var(--color-primary)' } : {}}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={opt.value}
                    checked={form.payment_method === opt.value}
                    onChange={change}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{opt.icon} {opt.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div>
          <div className="bg-white rounded-xl p-5 border border-slate-100 sticky top-20" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-slate-800 text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4 max-h-48 overflow-y-auto pr-1">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-slate-600 gap-2">
                  <span className="truncate text-xs">
                    {item.name}
                    {item.variantLabel ? ` (${item.variantLabel})` : ''}
                    {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                  </span>
                  <span className="shrink-0 text-xs font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 space-y-2 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading
                ? <span className="flex justify-center"><Spinner size="sm" /></span>
                : 'Place Order'}
            </button>
            <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Your info is safe &amp; encrypted
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
