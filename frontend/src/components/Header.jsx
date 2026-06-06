import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSun, FiMoon, FiGrid, FiBarChart2, FiExternalLink, FiUsers, FiList } from 'react-icons/fi';
import { getCart, getCartTotal } from '../store/cartStore';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');
  const userMenuRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch { setUser(null); }
    };
    window.addEventListener('user-update', syncUser);
    return () => window.removeEventListener('user-update', syncUser);
  }, []);

  useEffect(() => {
    const update = () => {
      const cart = getCart();
      const { itemCount } = getCartTotal(cart);
      setCartCount(itemCount);
    };
    update();
    window.addEventListener('storage', update);
    window.addEventListener('cart-update', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('cart-update', update);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const logout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user-update'));
    setUserMenuOpen(false);
    navigate('/login');
  };

  const isAdmin = user?.isAdmin;

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2">
            <img src="/Raymerce_logo.png" alt="Raymerce" className="h-8 w-auto" />
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Raymerce</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {isAdmin ? (
              <>
                <Link to="/" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
                  <FiExternalLink size={14} /> View Store
                </Link>
                <Link to="/admin/products" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
                  <FiGrid size={14} /> Products
                </Link>
                <Link to="/admin/users" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
                  <FiUsers size={14} /> Users
                </Link>
                <Link to="/admin/purchase-logs" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
                  <FiList size={14} /> Purchase Logs
                </Link>
                <Link to="/admin" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
                  <FiBarChart2 size={14} /> Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Home</Link>
                <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <FiShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <button
              onClick={() => setDark(!dark)}
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 text-xl"
            >
              {dark ? <FiSun /> : <FiMoon />}
            </button>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-gray-200 dark:border-slate-600 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-600">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"
                      >
                        <FiBarChart2 size={14} /> Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-slate-600"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                <FiUser className="text-xl" />
              </Link>
            )}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 dark:text-gray-300 text-2xl"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t dark:border-slate-700 px-4 pb-4">
          <div className="flex flex-col gap-3 pt-3">
            {user && (
              <div className="flex items-center gap-3 px-2 py-2 border-b border-gray-100 dark:border-slate-700 mb-1">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            )}

            {isAdmin ? (
              <>
                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                  <FiExternalLink size={16} /> View Store
                </Link>
                <Link to="/admin/products" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                  <FiGrid size={16} /> Products
                </Link>
                <Link to="/admin/users" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                  <FiUsers size={16} /> Users
                </Link>
                <Link to="/admin/purchase-logs" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                  <FiList size={16} /> Purchase Logs
                </Link>
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                  <FiBarChart2 size={16} /> Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-medium">Home</Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              </>
            )}

            <button onClick={() => { setDark(!dark); setMenuOpen(false); }} className="text-left text-gray-600 dark:text-gray-300 font-medium">
              {dark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-500 font-medium">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-medium">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
