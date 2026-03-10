import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../api/customerApi';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function CustomerRegister() {
  const { shop } = useShop();
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) { navigate('/account/orders'); return null; }

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: null, general: null }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await registerCustomer(shop.id, form);
      login(data.token, data.customer);
      navigate('/account/orders');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  }

  const field = (label, name, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={change}
        placeholder={placeholder}
        className={`input-field ${errors[name] ? 'error' : ''}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
      <div className="w-full max-w-sm">

        {/* Shop branding */}
        {shop && (
          <div className="text-center mb-6">
            {shop.logo_url ? (
              <img src={shop.logo_url} alt={shop.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-white shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl mx-auto mb-2 shadow-md">🏪</div>
            )}
            <p className="text-sm text-slate-500">{shop.name}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 p-8" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.09)' }}>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Create account</h1>
          <p className="text-slate-400 text-sm mb-6">Shop faster with an account</p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {errors.general}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {field('Full Name', 'name', 'text', 'John Doe')}
            {field('Email', 'email', 'email', 'you@example.com')}
            {field('Phone (optional)', 'phone', 'tel', '+91 98765 43210')}
            {field('Password', 'password', 'password', '••••••••')}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading ? <span className="flex justify-center"><Spinner size="sm" /></span> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
