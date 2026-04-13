import { StoreProvider } from './contexts/StoreContext';
import { useStore } from './hooks/useStore';
import AdminDashboard from './pages/AdminDashboard';
import OnboardingPage from './pages/OnboardingPage';

function AppRouter() {
  const { data } = useStore();
  
  // Eğer kullanıcının cinsiyet bilgisi yoksa (ilk giriş), Onboarding ekranını göster
  if (!data.user.gender) {
    return <OnboardingPage />;
  }

  // Bilgiler tamamsa ana panele yönlendir
  return <AdminDashboard />;
}

export default function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  );
}
