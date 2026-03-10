import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer } from '../api/customerApi';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function CustomerLogin() {
  const { shop } = useShop();
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) { navigate('/account/orders'); return null; }

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    try {
      const { data } = await loginCustomer(shop.id, form);
      login(data.token, data.customer);
      navigate('/account/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
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
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={change}
                autoComplete="email"
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={change}
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading ? <span className="flex justify-center"><Spinner size="sm" /></span> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
