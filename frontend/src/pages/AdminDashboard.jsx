import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import { FiPackage, FiGrid, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/products?pageSize=1000');
        const allProducts = data.products;
        const categories = [...new Set(allProducts.map((p) => p.category))];
        const lowStockItems = allProducts.filter((p) => p.stock > 0 && p.stock <= 10);

        setStats({
          totalProducts: data.total,
          totalCategories: categories.length,
          lowStock: lowStockItems.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader size="lg" />;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-indigo-500' },
    { label: 'Categories', value: stats.totalCategories, icon: FiGrid, color: 'bg-amber-500' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: FiAlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/products"
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Manage Products</h3>
              <p className="text-sm text-gray-500 mt-1">Add, edit, or remove products</p>
            </div>
            <FiArrowRight className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all text-xl" />
          </div>
        </Link>

        <Link
          to="/"
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">View Store</h3>
              <p className="text-sm text-gray-500 mt-1">Browse the front-end store</p>
            </div>
            <FiArrowRight className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all text-xl" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
