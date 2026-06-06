function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-slate-700" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
