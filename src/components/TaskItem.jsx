import { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Pencil, ChevronDown } from 'lucide-react';

const priorityConfig = {
  High: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', dot: 'bg-amber-500', border: 'border-amber-100 dark:border-amber-900/50' },
  Medium: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', dot: 'bg-blue-500', border: 'border-blue-100 dark:border-blue-900/50' },
  Low: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', dot: 'bg-emerald-500', border: 'border-emerald-100 dark:border-emerald-900/50' },
};

export default function TaskItem({ task, onToggle, onDelete, onEdit, onPriorityChange, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowPriorityMenu(false);
      }
    }
    if (showPriorityMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPriorityMenu]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task._id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const priority = task.priority || 'Medium';
  const pStyle = priorityConfig[priority];

  return (
    <div
      className="group flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-[#1a1d29] border-b border-gray-50 dark:border-gray-800/60 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/30"
      style={{ animationDelay: index * 30 + 'ms' }}
    >
      <button
        onClick={() => onToggle(task._id)}
        className={
          'flex-shrink-0 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ' +
          (task.completed
            ? 'bg-primary-500 border-primary-500 text-white'
            : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-[#1a1d29] hover:border-primary-400 dark:hover:border-primary-500')
        }
      >
        <Check
          size={11}
          strokeWidth={3}
          className={'transition-transform duration-200 ' + (task.completed ? 'scale-100' : 'scale-0')}
        />
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5 outline-none ring-2 ring-primary-200/50 dark:ring-primary-800/40 transition-all"
          />
        ) : (
          <span
            className={
              'text-sm font-medium leading-relaxed block truncate transition-all duration-300 ' +
              (task.completed ? 'text-gray-400 dark:text-gray-600 line-through decoration-gray-300 dark:decoration-gray-600 decoration-2' : 'text-gray-700 dark:text-gray-300')
            }
          >
            {task.text}
          </span>
        )}
      </div>

      {/* Priority Tag */}
      <div className="relative z-[100]" ref={menuRef}>
        <button
          onClick={() => setShowPriorityMenu(!showPriorityMenu)}
          className={
            'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ' +
            pStyle.bg + ' ' + pStyle.color + ' ' + pStyle.border
          }
        >
          <span className={'w-1.5 h-1.5 rounded-full ' + pStyle.dot}></span>
          {priority}
          <ChevronDown size={10} className="opacity-60" />
        </button>
        {showPriorityMenu && (
          <div className="absolute right-0 top-full mt-1.5 bg-white dark:bg-[#252836] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 py-1 z-[200] min-w-[120px] overflow-hidden">
            {['High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  onPriorityChange(task._id, p);
                  setShowPriorityMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors cursor-pointer"
              >
                <span className={'w-2 h-2 rounded-full shrink-0 ' + priorityConfig[p].dot}></span>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50/60 dark:hover:bg-primary-900/20 transition-colors cursor-pointer"
          >
            <Pencil size={13} strokeWidth={2} />
          </button>
        )}
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
