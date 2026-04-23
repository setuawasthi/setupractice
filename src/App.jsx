import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import AIAssistPanel from './components/AIAssistPanel';
import UpgradeModal from './components/UpgradeModal';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

export default function App() {
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup' | 'app'
  const [sessionToken, setSessionToken] = useState(() => {
    try { return localStorage.getItem("bettertasks-session"); } catch { return null; }
  });

  const sessionAndUser = useQuery(
    api.auth.getSessionAndUser,
    sessionToken ? { token: sessionToken } : "skip"
  );

  const user = sessionAndUser?.user || null;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (sessionToken && !isAuthenticated && sessionAndUser !== undefined) {
      // Invalid session, clear it
      localStorage.removeItem("bettertasks-session");
      setSessionToken(null);
    }
  }, [sessionToken, isAuthenticated, sessionAndUser]);

  // Auth flow
  if (!isAuthenticated) {
    return authView === 'login'
      ? <LoginPage onSwitch={() => setAuthView('signup')} />
      : <SignupPage onSwitch={() => setAuthView('login')} />;
  }

  return (
    <AppShell
      user={user}
      onLogout={() => {
        localStorage.removeItem("bettertasks-session");
        setSessionToken(null);
        window.location.reload();
      }}
    />
  );
}

function AppShell({ user, onLogout }) {
  const tasks = useQuery(api.tasks.getTasks) || [];
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('bettertasks-theme') || 'light'; } catch { return 'light'; }
  });
  const [activeView, setActiveView] = useState(() => {
    try { return localStorage.getItem('bettertasks-view') || 'todo'; } catch { return 'todo'; }
  });
  const [aiOpen, setAiOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('bettertasks-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('bettertasks-view', activeView); } catch {}
  }, [activeView]);

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div
      data-theme={theme}
      className="h-screen w-screen flex overflow-hidden bg-[#e5e6e8] dark:bg-[#0f1117] transition-colors duration-300"
    >
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setAiOpen(false);
        }}
        theme={theme}
        onThemeChange={setTheme}
        taskCount={activeCount}
        onUpgradeClick={() => setUpgradeOpen(true)}
        user={user}
        onLogout={onLogout}
      />

      <MainContent
        view={activeView}
        tasks={tasks}
        user={user}
        onToggleAI={() => setAiOpen(!aiOpen)}
      />

      <AIAssistPanel isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
