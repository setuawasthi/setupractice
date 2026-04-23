import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import TodoView from './TodoView';
import AnalyticsView from './AnalyticsView';
import LeaderboardView from './LeaderboardView';
import ShareImpactView from './ShareImpactView';

export default function MainContent({
  view,
  tasks,
  user,
  onToggleAI,
}) {
  const addTask = useMutation(api.tasks.addTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const toggleTask = useMutation(api.tasks.toggleTask);
  const editTask = useMutation(api.tasks.editTask);
  const changePriority = useMutation(api.tasks.changePriority);
  const clearCompleted = useMutation(api.tasks.clearCompleted);

  return (
    <div className="flex-1 h-screen overflow-hidden">
      {view === 'todo' && (
        <TodoView
          tasks={tasks}
          user={user}
          onAddTask={(text, priority) => addTask({ text, priority })}
          onDeleteTask={(id) => deleteTask({ id })}
          onToggleTask={(id) => toggleTask({ id })}
          onEditTask={(id, text) => editTask({ id, text })}
          onChangePriority={(id, priority) => changePriority({ id, priority })}
          onClearCompleted={() => clearCompleted()}
          onToggleAI={onToggleAI}
        />
      )}
      {view === 'analytics' && <AnalyticsView tasks={tasks} />}
      {view === 'leaderboard' && <LeaderboardView />}
      {view === 'impact' && <ShareImpactView tasks={tasks} />}
    </div>
  );
}
