function Loader({ size = 'md' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex justify-center items-center py-20">
      <div
        className={`${sizes[size]} border-4 border-gray-200 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin`}
      />
    </div>
  );
}

export default Loader;
