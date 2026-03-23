import { useEffect, type ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CoachTabs from '@/pages/CoachTabs';
import LoginPage from '@/pages/Login';
import ParentTabs from '@/pages/ParentTabs';
import { useAuthStore } from '@/store/auth';
import type { UserRole } from '@/types';

const ROLE_DEFAULT_PATH: Record<UserRole, string> = {
  parent: '/parent/basketball',
  coach: '/coach/training',
};

function ProtectedRoute({ allowRoles, children }: { allowRoles: UserRole[]; children: ReactElement }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowRoles.includes(user.role)) {
    return <Navigate to={ROLE_DEFAULT_PATH[user.role]} replace />;
  }
  return children;
}

function AuthInitializer({ children }: { children: ReactElement }) {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[14%] top-[18%] h-72 w-72 rounded-full bg-gold-400/12 blur-[120px]" />
          <div className="absolute bottom-[18%] right-[10%] h-80 w-80 rounded-full bg-gold-600/12 blur-[140px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.6),transparent)]" />
        </div>

        <div className="glass-luxury flex w-full max-w-md flex-col items-center gap-8 px-10 py-12 text-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border border-gold-400/20 bg-white/[0.02]" />
            <div className="absolute inset-2 rounded-full border border-gold-400/30" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold-300 border-r-gold-500" />
            <div className="absolute inset-[18px] rounded-full bg-[radial-gradient(circle,rgba(255,234,176,0.3),transparent_70%)]" />
            <div className="absolute inset-0 rounded-full bg-gold-400/10 blur-xl" />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--text-3)]">
              Intelligent Motion Engine
            </p>
            <p className="text-2xl font-bold gradient-text">智能加载体态监测数据</p>
            <p className="text-sm leading-6 text-[var(--text-2)]">
              正在初始化动作识别、训练画像与家校协同面板
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold-300" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold-400" style={{ animationDelay: '0.12s' }} />
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold-600" style={{ animationDelay: '0.24s' }} />
          </div>
        </div>
      </div>
    );
  }

  return children;
}

function RedirectByRole() {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_DEFAULT_PATH[user.role]} replace />;
}

export default function App() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  return (
    <AuthInitializer>
      <Routes location={location}>
        <Route path="/login" element={user ? <Navigate to={ROLE_DEFAULT_PATH[user.role]} replace /> : <LoginPage />} />
        <Route
          path="/parent/*"
          element={
            <ProtectedRoute allowRoles={['parent']}>
              <ParentTabs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach/*"
          element={
            <ProtectedRoute allowRoles={['coach']}>
              <CoachTabs />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<RedirectByRole />} />
        <Route path="*" element={<Navigate to={user ? ROLE_DEFAULT_PATH[user.role] : '/login'} replace />} />
      </Routes>
    </AuthInitializer>
  );
}
