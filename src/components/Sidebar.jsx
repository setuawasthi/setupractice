import { useState } from 'react';
import {
  CheckSquare,
  Trophy,
  BarChart3,
  Layout,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Sun,
  Moon,
  ArrowUpRight,
  Zap,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { key: 'todo', icon: CheckSquare, label: 'To-do' },
  { key: 'impact', icon: Trophy, label: 'Share My Impact', badge: 'OFF' },
  { key: 'analytics', icon: BarChart3, label: 'Analytics' },
  { key: 'leaderboard', icon: Layout, label: 'Leaderboard' },
];

const projects = [
  { icon: '🔥', label: 'Odama Website' },
  { icon: '🏀', label: 'Dribbble' },
];

const personalProjects = [
  { icon: '📁', label: 'Portfolio Redesign' },
];

export default function Sidebar({ activeView, onViewChange, theme, onThemeChange, taskCount, onUpgradeClick, user, onLogout }) {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [personalOpen, setPersonalOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userName = user?.name || 'Pristia Candra';
  const userEmail = user?.email || '';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="w-[260px] h-screen bg-white dark:bg-[#161922] rounded-r-2xl flex flex-col p-5 shrink-0 shadow-[1px_0_3px_rgba(0,0,0,0.03)] transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
            <CheckSquare size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">BetterTasks</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors cursor-pointer">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Main Menu */}
      <div className="mb-5">
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">
          Main Menu
        </h3>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                className={
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ' +
                  (isActive
                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200')
                }
              >
                <item.icon size={18} strokeWidth={2} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.key === 'todo' && taskCount > 0 && (
                  <span className="text-[10px] font-semibold text-white bg-primary-500 px-2 py-0.5 rounded-full">
                    {taskCount}
                  </span>
                )}
                {item.badge && item.key !== 'todo' && (
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Lists */}
      <div className="mb-5 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
            Lists
          </h3>
          <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-500 transition-colors cursor-pointer">
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Projects */}
        <div className="mb-1">
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            {projectsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="flex-1 text-left">Projects</span>
            <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
              <Plus size={12} className="text-gray-400 hover:text-gray-600" />
              <Trash2 size={12} className="text-gray-400 hover:text-red-500" />
            </div>
          </button>
          {projectsOpen && (
            <div className="ml-6 mt-0.5 space-y-0.5">
              {projects.map((p) => (
                <button
                  key={p.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <span className="text-base leading-none">{p.icon}</span>
                  <span className="text-left">{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Personal Project */}
        <div>
          <button
            onClick={() => setPersonalOpen(!personalOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            {personalOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="flex-1 text-left">Personal Project</span>
            <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
              <Plus size={12} className="text-gray-400 hover:text-gray-600" />
              <Trash2 size={12} className="text-gray-400 hover:text-red-500" />
            </div>
          </button>
          {personalOpen && (
            <div className="ml-6 mt-0.5 space-y-0.5">
              {personalProjects.map((p) => (
                <button
                  key={p.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <span className="text-base leading-none">{p.icon}</span>
                  <span className="text-left">{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Card */}
      <div className="bg-primary-500 rounded-2xl p-4 mb-4 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-sm font-semibold mb-1">Upgrade plan</h4>
          <p className="text-xs text-primary-100 leading-relaxed mb-3">
            Unlock your personal to-do workspace, share your impact with multiple people and much more.
          </p>
          <button
            onClick={onUpgradeClick}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-500 hover:scale-105 transition-transform cursor-pointer"
          >
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="space-y-0.5 mb-4">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer">
          <Zap size={18} strokeWidth={2} />
          <span>Invites</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer">
          <Layout size={18} strokeWidth={2} />
          <span>FAQs</span>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4 transition-colors">
        <button
          onClick={() => onThemeChange('light')}
          className={
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ' +
            (theme === 'light'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200')
          }
        >
          <Sun size={14} />
          Light
        </button>
        <button
          onClick={() => onThemeChange('dark')}
          className={
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ' +
            (theme === 'dark'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200')
          }
        >
          <Moon size={14} />
          Dark
        </button>
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-300 text-sm font-semibold shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{userEmail || 'Nameless panda #112'}</p>
          </div>
          <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
        </button>

        {showProfileMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#252836] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 py-1 z-50 overflow-hidden">
            <button
              onClick={() => { onLogout(); setShowProfileMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
