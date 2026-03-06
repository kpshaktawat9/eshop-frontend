import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={change}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
          errors[name] ? 'border-red-400' : 'border-slate-200'
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Checkout</h1>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left - Form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Customer info */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4">Customer Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('Full Name', 'name', 'text', true)}
              {field('Phone', 'phone', 'tel', true)}
              {field('Email (optional)', 'email', 'email')}
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4">Delivery Address</h2>
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
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4">Payment Method</h2>
            <div className="space-y-2">
              {[
                { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives.' },
                ...(shop?.is_payment_enabled ? [{ value: 'online', label: '💳 Online Payment', desc: 'Pay securely online.' }] : []),
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                    form.payment_method === opt.value ? 'border-primary bg-blue-50/50' : 'border-slate-200'
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
                    <p className="font-medium text-slate-800 text-sm">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 sticky top-20">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-slate-600">
                  <span className="truncate max-w-[160px]">
                    {item.name}
                    {item.variantLabel ? ` (${item.variantLabel})` : ''}
                    {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                  </span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? <span className="flex justify-center"><Spinner size="sm" /></span> : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
