const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function FilterTabs({ current, onChange, counts }) {
  return (
    <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl gap-0.5 transition-colors duration-300">
      {filters.map((filter) => {
        const isActive = current === filter.key;
        const count = counts[filter.key];
        return (
          <button
            key={filter.key}
            onClick={() => onChange(filter.key)}
            className={
              'relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ' +
              (isActive
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50')
            }
          >
            <span className="flex items-center gap-1.5">
              {filter.label}
              <span
                className={
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold transition-colors ' +
                  (isActive ? 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300' : 'bg-gray-200/60 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400')
                }
              >
                {count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
