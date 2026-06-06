import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Paginate({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
      range.push(i);
    }
    if (range[0] > 1) {
      range.unshift(1);
      if (range[1] > 2) range.splice(1, 0, '...');
    }
    if (range[range.length - 1] < pages) {
      if (range[range.length - 1] < pages - 1) range.push('...');
      range.push(pages);
    }
    return range;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiChevronLeft />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
              p === page
                ? 'bg-indigo-500 text-white'
                : 'border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

export default Paginate;
