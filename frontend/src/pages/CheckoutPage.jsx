import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { getCart, getCartTotal, clearCart } from '../store/cartStore';
import API from '../api';
import toast from 'react-hot-toast';

const countries = [
  { code: 'US', dial: '+1', name: 'United States', phoneLen: 10, phoneFormat: 'XXX-XXX-XXXX' },
  { code: 'CA', dial: '+1', name: 'Canada', phoneLen: 10, phoneFormat: 'XXX-XXX-XXXX' },
  { code: 'GB', dial: '+44', name: 'United Kingdom', phoneLen: 10, phoneFormat: 'XXXX-XXX-XXX' },
  { code: 'AU', dial: '+61', name: 'Australia', phoneLen: 9, phoneFormat: 'XXX-XXX-XXX' },
  { code: 'IN', dial: '+91', name: 'India', phoneLen: 10, phoneFormat: 'XXXXX-XXXXX' },
  { code: 'DE', dial: '+49', name: 'Germany', phoneLen: 10, phoneFormat: 'XXXX-XXXXXX' },
  { code: 'FR', dial: '+33', name: 'France', phoneLen: 9, phoneFormat: 'XXX-XXX-XXX' },
  { code: 'BR', dial: '+55', name: 'Brazil', phoneLen: 10, phoneFormat: 'XXXXX-XXXX' },
  { code: 'JP', dial: '+81', name: 'Japan', phoneLen: 10, phoneFormat: 'XXX-XXXX-XXX' },
  { code: 'NG', dial: '+234', name: 'Nigeria', phoneLen: 10, phoneFormat: 'XXX-XXX-XXXX' },
  { code: 'AE', dial: '+971', name: 'UAE', phoneLen: 9, phoneFormat: 'XXX-XXX-XXX' },
  { code: 'SG', dial: '+65', name: 'Singapore', phoneLen: 8, phoneFormat: 'XXXX-XXXX' },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState({ subtotal: 0, itemCount: 0 });
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [shippingCountry, setShippingCountry] = useState(countries[0]);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [postalError, setPostalError] = useState('');
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

  const formatPhoneHint = (c) => `e.g. ${c.dial} ${'5'.repeat(c.phoneLen - 1)}${'6'}`;

  const validatePhone = (digits, countryObj) => {
    const cleaned = digits.replace(/\D/g, '');
    if (!cleaned) return '';
    if (cleaned.length !== countryObj.phoneLen) {
      return `Enter exactly ${countryObj.phoneLen} digits for ${countryObj.name} (${countryObj.dial})`;
    }
    return '';
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= selectedCountry.phoneLen) {
      setPhoneDigits(raw);
      setPhoneError(validatePhone(raw, selectedCountry));
    }
  };

  const handlePhoneCountryChange = (e) => {
    const c = countries.find((c) => c.code === e.target.value) || countries[0];
    setSelectedCountry(c);
    const cleaned = phoneDigits.replace(/\D/g, '');
    const trimmed = cleaned.length > c.phoneLen ? cleaned.slice(0, c.phoneLen) : cleaned;
    setPhoneDigits(trimmed);
    setPhoneError(validatePhone(trimmed, c));
  };

  const handlePostalChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPostalCode(val);
    if (val.length > 0 && val.length !== 6) {
      setPostalError('Postal code must be exactly 6 digits');
    } else {
      setPostalError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneErr = validatePhone(phoneDigits, selectedCountry);
    if (phoneErr) {
      setPhoneError(phoneErr);
      toast.error(phoneErr);
      return;
    }
    if (postalCode.length !== 6) {
      setPostalError('Postal code must be exactly 6 digits');
      toast.error('Postal code must be exactly 6 digits');
      return;
    }
    if (!address || !city) {
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

      const fullPhone = `${selectedCountry.dial} ${phoneDigits}`;

      const { data } = await API.post('/orders', {
        orderItems,
        shippingAddress: { address, city, postalCode, country: shippingCountry.name },
        phone: fullPhone,
      });

      clearCart();
      window.dispatchEvent(new Event('cart-update'));
      toast.success('Order placed successfully!');
      navigate('/order/success', { state: { order: data } });
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FiPhone className="text-indigo-500" /> Phone Number
                </label>
                <div className="flex border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-200">
                  <select
                    value={selectedCountry.code}
                    onChange={handlePhoneCountryChange}
                    className="bg-transparent border-0 text-gray-900 dark:text-white text-sm py-2 pl-3 pr-1 outline-none appearance-none cursor-pointer flex-shrink-0 min-w-[70px] dark:bg-slate-700"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code} className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                        {c.dial} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="w-px bg-gray-300 dark:bg-slate-600 flex-shrink-0" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={phoneDigits}
                    onChange={handlePhoneChange}
                    placeholder={formatPhoneHint(selectedCountry)}
                    className="flex-1 bg-transparent border-0 text-gray-900 dark:text-white text-sm py-2 pr-3 pl-3 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>
                {phoneError ? (
                  <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                ) : phoneDigits.length > 0 && phoneDigits.length < selectedCountry.phoneLen ? (
                  <p className="text-xs text-amber-500 mt-1">
                    {phoneDigits.length} / {selectedCountry.phoneLen} digits entered
                  </p>
                ) : phoneDigits.length === selectedCountry.phoneLen ? (
                  <p className="text-xs text-green-500 mt-1">
                    {selectedCountry.dial} {phoneDigits} — looks good
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <FiMapPin className="text-indigo-500" /> Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="input-field"
                  required
                />
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
                    inputMode="numeric"
                    value={postalCode}
                    onChange={handlePostalChange}
                    placeholder="6-digit code"
                    className="input-field"
                    required
                    maxLength={6}
                  />
                  {postalError && (
                    <p className="text-xs text-red-500 mt-1">{postalError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <select
                  value={shippingCountry.code}
                  onChange={(e) => {
                    const c = countries.find((c) => c.code === e.target.value) || countries[0];
                    setShippingCountry(c);
                  }}
                  className="input-field"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code} className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
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
