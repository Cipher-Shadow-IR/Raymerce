import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { getCart, getCartTotal, clearCart } from '../store/cartStore';
import API from '../api';
import toast from 'react-hot-toast';

function CheckoutPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState({ subtotal: 0, itemCount: 0 });
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user.token) {
      navigate('/login');
      return;
    }
    const items = getCart();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setCart(items);
    setTotal(getCartTotal(items));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !address || !city || !postalCode || !country) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      }));

      await API.post('/orders', {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        phone,
      });

      clearCart();
      window.dispatchEvent(new Event('cart-update'));
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const shipping = total.subtotal > 100 ? 0 : 10;
  const tax = Number((0.08 * total.subtotal).toFixed(2));
  const grandTotal = Number((total.subtotal + shipping + tax).toFixed(2));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FiUser /> Account
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <FiUser className="text-indigo-500" />
                <span>{user.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <FiMail className="text-indigo-500" />
                <span>{user.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FiMapPin /> Shipping Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                {submitting ? 'Placing Order...' : `Place Order — $${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 sticky top-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FiShoppingBag /> Order Summary ({total.itemCount} items)
            </h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                    <p className="text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-slate-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${total.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t dark:border-slate-700 pt-2 flex justify-between font-bold text-gray-800 dark:text-gray-200 text-base">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
