import { useState } from 'react';
import { Layout } from '../components/admin/layout/Layout';
import { DashboardView } from '../components/admin/views/DashboardView';
import { HistoryView } from '../components/admin/views/HistoryView';
import { StatsView } from '../components/admin/views/StatsView';
import { LibraryView } from '../components/admin/views/LibraryView';
import { SettingsView } from '../components/admin/views/SettingsView';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'history':
        return <HistoryView />;
      case 'stats':
        return <StatsView />;
      case 'library':
        return <LibraryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {renderView()}
    </Layout>
  );
}
