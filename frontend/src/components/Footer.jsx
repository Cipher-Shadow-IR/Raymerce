import { FiPackage, FiHeart } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-3">
              <FiPackage />
              <span>Raymerce Store</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Your premium e-commerce destination for quality products at great prices.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</a></li>
              <li><a href="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400">Cart</a></li>
              <li><a href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Account</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>support@raymerce.com</li>
              <li>1-800-REMiRIND</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="border-t dark:border-slate-700 mt-6 pt-6 text-center text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
          <span>&copy; {new Date().getFullYear()} Raymerce Store. Made with</span>
          <FiHeart className="text-red-500" />
          <span>by Team Raymerce</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
