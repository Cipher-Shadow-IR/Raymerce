import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

function Message({ type = 'info', children }) {
  const styles = {
    error: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  };

  const icons = {
    error: <FiAlertCircle />,
    success: <FiCheckCircle />,
    warning: <FiAlertTriangle />,
    info: <FiInfo />,
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${styles[type] || styles.info}`}>
      <span className="text-lg flex-shrink-0">{icons[type]}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export default Message;
