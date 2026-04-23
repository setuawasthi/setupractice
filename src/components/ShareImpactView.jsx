import { useMemo, useState } from 'react';
import { Award, Twitter, Link2, Download, Check, Flame } from 'lucide-react';

export default function ShareImpactView({ tasks }) {
  const [copied, setCopied] = useState(false);

  const impact = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highPriority = tasks.filter((t) => t.priority === 'High' && t.completed).length;
    return { completed, total, rate, highPriority };
  }, [tasks]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Share My Impact</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">Showcase your productivity and inspire others.</p>
      </div>

      {/* Impact Score Card */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none mb-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">Your Impact Score</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{impact.completed * 50 + impact.highPriority * 100}</h2>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Award size={32} className="text-primary-500" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Completed', value: impact.completed },
            { label: 'Rate', value: impact.rate + '%' },
            { label: 'High Priority', value: impact.highPriority },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none mb-6 transition-colors duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Share Your Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors cursor-pointer">
            <Twitter size={18} />
            <span className="text-sm font-medium">Share on Twitter</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-colors cursor-pointer"
          >
            {copied ? <Check size={18} /> : <Link2 size={18} />}
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer">
            <Download size={18} />
            <span className="text-sm font-medium">Export Stats</span>
          </button>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Weekly Activity</h2>
        <div className="flex items-end justify-between gap-2 h-32">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const heights = [60, 85, 45, 90, 70, 30, 55];
            const isToday = i === 4;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-24">
                  <div
                    className={`w-full max-w-[32px] min-w-[16px] rounded-t-lg transition-all duration-500 ${isToday ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    style={{ height: `${heights[i]}%` }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-6"></div>
    </div>
  );
}
