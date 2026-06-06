import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { getCart, getCartTotal } from '../store/cartStore';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
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
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Raymerce_logo.png" alt="Raymerce" className="h-8 w-auto" />
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Raymerce</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
              Home
            </Link>
            <Link to="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setDark(!dark)}
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 text-xl"
            >
              {dark ? <FiSun /> : <FiMoon />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
                    Admin
                  </Link>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">{user.name}</span>
                <button onClick={logout} className="text-gray-600 dark:text-gray-300 hover:text-red-500">
                  <FiLogOut className="text-lg" />
                </button>
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
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-medium">Home</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <button onClick={() => { setDark(!dark); setMenuOpen(false); }} className="text-left text-gray-600 dark:text-gray-300 font-medium">
              {dark ? 'Light Mode' : 'Dark Mode'}
            </button>
            {user ? (
              <>
                {user.isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-medium">Admin</Link>}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-500 font-medium">Logout</button>
              </>
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
