import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { getCart, removeFromCart, updateQty, getCartTotal, clearCart } from '../store/cartStore';
import toast from 'react-hot-toast';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState({ subtotal: 0, itemCount: 0 });

  useEffect(() => {
    const update = () => {
      const items = getCart();
      setCart(items);
      setTotal(getCartTotal(items));
    };
    update();
    window.addEventListener('cart-update', update);
    return () => window.removeEventListener('cart-update', update);
  }, []);

  const handleRemove = (id, name) => {
    const updated = removeFromCart(id);
    setCart(updated);
    setTotal(getCartTotal(updated));
    window.dispatchEvent(new Event('cart-update'));
    toast.success(`${name} removed from cart`);
  };

  const handleQty = (id, newQty) => {
    if (newQty < 1) return;
    const updated = updateQty(id, newQty);
    setCart(updated);
    setTotal(getCartTotal(updated));
    window.dispatchEvent(new Event('cart-update'));
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
    setTotal({ subtotal: 0, itemCount: 0 });
    window.dispatchEvent(new Event('cart-update'));
    toast.success('Cart cleared');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="text-6xl text-gray-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started!</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Shopping Cart ({total.itemCount} items)
        </h1>
        <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
          <FiTrash2 /> Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4"
          >
            <Link to={`/product/${item._id}`} className="w-full sm:w-24 h-24 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/product/${item._id}`}>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate hover:text-indigo-600">
                  {item.name}
                </h3>
              </Link>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                ${item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg">
                <button
                  onClick={() => handleQty(item._id, item.qty - 1)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
                >
                  <FiMinus size={14} />
                </button>
                <span className="px-3 text-sm font-medium text-gray-800 dark:text-gray-200">{item.qty}</span>
                <button
                  onClick={() => handleQty(item._id, item.qty + 1)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="font-bold text-gray-800 dark:text-gray-200">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => handleRemove(item._id, item.name)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Subtotal ({total.itemCount} items)</span>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
            ${total.subtotal.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Shipping & taxes calculated at checkout</p>
        <button className="btn-secondary w-full">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default CartPage;
