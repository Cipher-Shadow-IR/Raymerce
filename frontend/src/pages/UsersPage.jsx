import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FiUsers, FiTrash2, FiArrowLeft, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User removed');
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-2">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Users</h1>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-center p-4">Role</th>
                  <th className="text-center p-4">Joined</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FiMail size={12} />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          <FiShield size={11} /> Admin
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Customer</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center gap-1.5">
                        <FiCalendar size={12} />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {!user.isAdmin && (
                        deleteId === user._id ? (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleDelete(user._id)} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Confirm</button>
                            <button onClick={() => setDeleteId(null)} className="px-2 py-1 bg-gray-200 dark:bg-slate-600 text-xs rounded hover:bg-gray-300">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteId(user._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <FiTrash2 />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
