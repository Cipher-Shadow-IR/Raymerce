import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import InputField from '../components/InputField';
import toast from 'react-hot-toast';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('user-update'));
      toast.success(`Welcome back, ${data.name}!`);
      if (data.isAdmin) navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={FiMail}
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            autoComplete="email"
          />

          <InputField
            icon={FiLock}
            label="Password"
            name="password"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                tabIndex={-1}
              >
                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            }
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;
