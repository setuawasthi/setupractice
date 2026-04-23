import { useMemo } from 'react';
import { CheckCircle2, Circle, TrendingUp, Target } from 'lucide-react';

export default function AnalyticsView({ tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byPriority = {
      High: tasks.filter((t) => t.priority === 'High').length,
      Medium: tasks.filter((t) => t.priority === 'Medium').length,
      Low: tasks.filter((t) => t.priority === 'Low').length,
    };

    return { total, completed, active, rate, byPriority };
  }, [tasks]);

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: Target, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Active', value: stats.active, icon: Circle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Completion Rate', value: stats.rate + '%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  ];

  const maxPriority = Math.max(stats.byPriority.High, stats.byPriority.Medium, stats.byPriority.Low, 1);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Analytics</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">Track your productivity and task completion.</p>
      </div>

      {/* Stat Cards - 4 equal columns */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-[#1a1d29] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.color} strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0.5">{card.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none mb-6 transition-colors duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">Tasks by Priority</h2>
        <div className="space-y-4">
          {[
            { label: 'High', count: stats.byPriority.High, color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
            { label: 'Medium', count: stats.byPriority.Medium, color: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400' },
            { label: 'Low', count: stats.byPriority.Low, color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
          ].map((p) => (
            <div key={p.label}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${p.text}`}>{p.label} Priority</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{p.count}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${p.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(p.count / maxPriority) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No tasks yet. Start by adding some in the To-do section.</p>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${task.completed ? 'bg-emerald-500' : 'bg-primary-500'}`} />
                <span className={`text-sm flex-1 ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                  {task.text}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{task.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-6"></div>
    </div>
  );
}
