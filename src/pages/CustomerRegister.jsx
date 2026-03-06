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

  const field = (label, name, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Create account</h1>
          <p className="text-slate-500 text-sm mb-6">Shop faster with an account</p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">{errors.general}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {field('Full Name', 'name')}
            {field('Email', 'email', 'email')}
            {field('Phone (optional)', 'phone', 'tel')}
            {field('Password', 'password', 'password')}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <span className="flex justify-center"><Spinner size="sm" /></span> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
