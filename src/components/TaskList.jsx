import { useState, useEffect } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { SparklesCore } from '@/components/ui/sparkles';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete, onEdit, onPriorityChange }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center py-20 px-4 text-center min-h-[280px] overflow-hidden">
        {/* Subtle sparkles background in dark mode */}
        {isDark && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SparklesCore
              id="empty-state-sparkles"
              background="transparent"
              minSize={0.3}
              maxSize={1.2}
              particleDensity={60}
              className="w-full h-full"
              particleColor="#6366f1"
              speed={0.8}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${isDark ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
            <ClipboardList size={28} className={`transition-colors ${isDark ? 'text-primary-400' : 'text-gray-300'}`} strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">No tasks yet</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-[240px] leading-relaxed mb-5">
            Add a new task above to start organizing your day.
          </p>
          <button
            onClick={() => document.querySelector('input[placeholder="What needs to be done?"]')?.focus()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            Create your first task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onPriorityChange={onPriorityChange}
        />
      ))}
    </div>
  );
}
