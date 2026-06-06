import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-bold text-indigo-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <FiHome /> Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
