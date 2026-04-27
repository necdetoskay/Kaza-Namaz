import { StoreProvider } from './contexts/StoreContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useStore } from './hooks/useStore';
import AdminDashboard from './pages/AdminDashboard';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import { DebugPage } from './pages/DebugPage';

const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

function AppRouter() {
  const { user, isLoading: authLoading, isUnauthorized } = useAuth();
  const { data, isLoading: storeLoading } = useStore();

  // Debug mode - direct access
  if (isDebugMode && window.location.pathname === '/debug') {
    return <DebugPage />;
  }

  // Auth loading
  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbe2] text-[#0d631b]">
        Yükleniyor...
      </div>
    );
  }

  // Not logged in or unauthorized
  if (!user || isUnauthorized) {
    return <LoginPage />;
  }

  // Logged in but no profile (first time) or no data at all
  if (!data || !data.user.gender) {
    return <OnboardingPage />;
  }

  // Normal flow - show dashboard
  return <AdminDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppRouter />
      </StoreProvider>
    </AuthProvider>
  );
}
