import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiMapPin, FiPhone, FiDollarSign, FiHome, FiShoppingBag } from 'react-icons/fi';

function OrderSuccessPage() {
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="text-6xl text-gray-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No order data</h2>
        <p className="text-gray-400 mb-6">Looks like you haven't placed an order yet.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2"><FiHome /> Go Home</Link>
      </div>
    );
  }

  const orderTotal = order.totalPrice || 0;
  const orderId = order._id?.slice(-8).toUpperCase() || 'N/A';
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 text-center mb-6">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle className="text-3xl text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">Order Placed!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Thank you! Your order is confirmed.</p>
        <p className="mt-3 inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
          #{orderId}
        </p>
        {createdAt && <p className="text-xs text-gray-400 mt-2">{createdAt}</p>}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <FiPackage /> Items
        </h2>
        <div className="space-y-3">
          {order.orderItems?.map((item, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 dark:text-gray-200 font-medium truncate">{item.name}</p>
                <p className="text-gray-400">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t dark:border-slate-700 mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>${(order.itemsPrice || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax</span>
            <span>${(order.taxPrice || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200 text-base border-t dark:border-slate-700 pt-1.5">
            <span>Total</span>
            <span className="text-indigo-600 dark:text-indigo-400">${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <FiMapPin /> Shipping
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p className="flex items-start gap-2">
            <FiMapPin className="mt-0.5 text-indigo-500 flex-shrink-0" />
            <span>
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <FiPhone className="text-indigo-500 flex-shrink-0" />
            <span>{order.phone || 'N/A'}</span>
          </p>
          <p className="flex items-center gap-2">
            <FiDollarSign className="text-indigo-500 flex-shrink-0" />
            <span>{order.paymentMethod || 'Cash on Delivery'}</span>
          </p>
        </div>
      </div>

      <div className="text-center space-x-4">
        <Link to="/" className="btn-primary inline-flex items-center gap-2"><FiHome /> Continue Shopping</Link>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
