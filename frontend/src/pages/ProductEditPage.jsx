import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState({
    name: '',
    image: '',
    category: '',
    price: '',
    description: '',
    stock: '',
    featured: false,
  });
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const fetch = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setForm({
          name: data.name,
          image: data.image,
          category: data.category,
          price: data.price.toString(),
          description: data.description,
          stock: data.stock.toString(),
          featured: data.featured,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (isNew) {
        await API.post('/products', payload);
        toast.success('Product created!');
      } else {
        await API.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8"><Message type="error">{error}</Message></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin/products')}
        className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-4"
      >
        <FiArrowLeft /> Back to Products
      </button>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        {isNew ? 'Add Product' : 'Edit Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL <span className="text-gray-400 font-normal">(leave blank for default)</span>
          </label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g. Electronics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="input-field"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="input-field"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="input-field resize-none"
            placeholder="Product description"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Featured product</span>
        </label>

        <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
          <FiSave /> {saving ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductEditPage;
