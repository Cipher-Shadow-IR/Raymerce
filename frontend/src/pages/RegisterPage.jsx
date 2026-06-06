import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import InputField from '../components/InputField';
import toast from 'react-hot-toast';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('user-update'));
      toast.success(`Welcome, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={FiUser}
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            required
            autoComplete="name"
          />

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
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password (min 6 chars)"
            required
            minLength={6}
            autoComplete="new-password"
          />

          <InputField
            icon={FiLock}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
            minLength={6}
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
