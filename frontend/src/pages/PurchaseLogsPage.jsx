import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { FiArrowLeft, FiPackage, FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';

function PurchaseLogsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/purchase-logs?pageNumber=${page}&pageSize=15`);
      setOrders(data.orders);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-2">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Purchase Logs</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total orders</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : orders.length === 0 ? (
        <Message type="info">No orders yet.</Message>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Items</th>
                    <th className="text-center p-4">Date</th>
                    <th className="text-right p-4">Total</th>
                    <th className="text-center p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiUser size={12} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {order.user?.name || 'Deleted User'}
                            </p>
                            <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          {order.orderItems?.slice(0, 3).map((item, i) => (
                            <span key={i} className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[220px]">
                              {item.name} × {item.qty}
                            </span>
                          ))}
                          {order.orderItems?.length > 3 && (
                            <span className="text-xs text-gray-400">+{order.orderItems.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <FiCalendar size={12} />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-800 dark:text-gray-200">
                        <div className="flex items-center justify-end gap-1">
                          <FiDollarSign size={12} className="text-gray-400" />
                          <span>${order.totalPrice?.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.isDelivered
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          <FiPackage size={11} />
                          {order.isDelivered ? 'Delivered' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Paginate page={page} pages={pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default PurchaseLogsPage;
