import { Trophy, Medal, TrendingUp, Flame } from 'lucide-react';

const leaders = [
  { rank: 1, name: 'Pristia Candra', handle: 'Nameless panda #245', score: 2450, tasks: 48, streak: 12, trend: 'up' },
  { rank: 2, name: 'Alex Chen', handle: 'AlexC #112', score: 2120, tasks: 42, streak: 8, trend: 'up' },
  { rank: 3, name: 'Maria Santos', handle: 'MariS #89', score: 1980, tasks: 39, streak: 5, trend: 'down' },
  { rank: 4, name: 'James Wilson', handle: 'JWilson #156', score: 1840, tasks: 36, streak: 3, trend: 'up' },
  { rank: 5, name: 'Sophie Turner', handle: 'SophieT #78', score: 1720, tasks: 34, streak: 7, trend: 'up' },
  { rank: 6, name: 'Daniel Kim', handle: 'DKim #203', score: 1650, tasks: 31, streak: 4, trend: 'down' },
  { rank: 7, name: 'Emma Watson', handle: 'EmmaW #134', score: 1580, tasks: 29, streak: 2, trend: 'up' },
];

export default function LeaderboardView() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Leaderboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">See how you rank among your team.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[2, 1, 3].map((pos) => {
          const user = leaders.find((l) => l.rank === pos);
          const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
          const colors = { 1: 'bg-primary-500', 2: 'bg-gray-400', 3: 'bg-amber-500' };
          return (
            <div key={pos} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {user.name.charAt(0)}
              </div>
              <div className={`w-20 ${heights[pos]} ${colors[pos]} rounded-t-2xl flex items-start justify-center pt-3`}>
                <span className="text-white font-bold text-lg">#{pos}</span>
              </div>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mt-2 text-center truncate w-20">{user.name.split(' ')[0]}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{user.score}</p>
            </div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="bg-white dark:bg-[#1a1d29] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-colors duration-300">
        {leaders.map((user, i) => (
          <div
            key={user.rank}
            className={`flex items-center gap-4 px-5 py-3.5 ${i !== leaders.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors`}
          >
            <div className={`w-6 text-center text-sm font-bold ${user.rank <= 3 ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>
              {user.rank}
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.handle}</p>
            </div>
            <div className="flex items-center gap-4 text-right shrink-0">
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400 dark:text-gray-500">Tasks</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.tasks}</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400 dark:text-gray-500">Streak</p>
                <div className="flex items-center gap-1 justify-end">
                  <Flame size={12} className="text-orange-500" />
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.streak}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Score</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.score}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-6"></div>
    </div>
  );
}
