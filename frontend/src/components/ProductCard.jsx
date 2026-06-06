import { Link } from 'react-router-dom';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { addToCart } from '../store/cartStore';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    window.dispatchEvent(new Event('cart-update'));
    toast.success(`${product.name} added to cart`);
  };

  const inStock = product.stock > 0;

  return (
    <div className="card group">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate hover:text-indigo-600 dark:hover:text-indigo-400">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className={`p-2 rounded-full transition-colors duration-200 ${
              inStock
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {inStock ? <FiShoppingCart /> : <FiCheck />}
          </button>
        </div>
        <p className="text-xs mt-1 text-gray-400">
          {inStock ? `${product.stock} in stock` : 'Sold out'}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
