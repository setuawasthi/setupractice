import { useState, useMemo, useRef } from 'react';
import { Plus, Clock, Sparkles } from 'lucide-react';
import TaskList from './TaskList';
import FilterTabs from './FilterTabs';

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export default function TodoView({
  tasks,
  onAddTask,
  onDeleteTask,
  onToggleTask,
  onEditTask,
  onChangePriority,
  onClearCompleted,
  onToggleAI,
}) {
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const inputRef = useRef(null);

  const addTask = () => {
    const text = inputValue.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    onAddTask(text, 'Medium');
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case FILTERS.ACTIVE:
        return tasks.filter((t) => !t.completed);
      case FILTERS.COMPLETED:
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const counts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }), [tasks]);

  const activeCount = counts.active;
  const completedCount = counts.completed;
  const hasText = inputValue.trim().length > 0;

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl p-6 mb-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none animate-[fadeIn_0.4s_ease-out] transition-colors duration-300">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Good Morning, Pristia!</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">What do you plan to do today?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['🐼','🐻','🦁','🐱'].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#1a1d29] flex items-center justify-center text-base"
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Odama Studio</p>
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px]">👤</span>
              1.354
            </div>
          </div>
        </div>
      </div>

      {/* Today Task Section */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none animate-[fadeIn_0.4s_ease-out_0.1s_both] transition-colors duration-300">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Today Task</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer">
              <Clock size={15} />
              Focus Mode
            </button>
            <button
              onClick={onToggleAI}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Sparkles size={15} />
              AI Assist
            </button>
          </div>
        </div>

        {/* Task Input Row */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={addTask}
            className={
              'h-10 px-6 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ' +
              (hasText
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm active:scale-[0.97]'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700')
            }
          >
            Finish
          </button>
          <button
            onClick={addTask}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Task
          </button>
          <button className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 text-[10px] font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0">
            i
          </button>
        </div>

        <div className="mb-5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="w-full h-11 pl-4 pr-4 text-sm font-medium text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/60 rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-200/60 dark:focus:ring-primary-800/40 focus:shadow-[0_0_0_1px_rgba(99,102,241,0.1)]"
          />
        </div>

        {/* Filters */}
        {tasks.length > 0 && (
          <div className="mb-4">
            <FilterTabs current={filter} onChange={setFilter} counts={counts} />
          </div>
        )}

        {/* Task List */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-2xl">
          <TaskList
            tasks={filteredTasks}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onPriorityChange={onChangePriority}
          />
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between pt-4 mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
            </span>
            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>

      <div className="h-6"></div>
    </div>
  );
}
