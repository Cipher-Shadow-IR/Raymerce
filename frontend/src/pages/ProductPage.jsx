import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { addToCart } from '../store/cartStore';
import toast from 'react-hot-toast';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    window.dispatchEvent(new Event('cart-update'));
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><Message type="error">{error}</Message></div>;
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-indigo-600 mb-6">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{product.name}</h1>

          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            ${product.price.toFixed(2)}
          </div>

          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                inStock
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}
            >
              {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {product.description}
          </p>

          {inStock && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
                >
                  <FiMinus />
                </button>
                <span className="px-4 font-medium text-gray-800 dark:text-gray-200">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
                >
                  <FiPlus />
                </button>
              </div>

              <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}

          {product.createdAt && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Added on {new Date(product.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
