import { Home, BarChart2, BookOpen, Settings, History, Bug } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
    { id: 'history', label: 'Geçmiş', icon: History },
    { id: 'stats', label: 'İstatistik', icon: BarChart2 },
    { id: 'library', label: 'Kütüphane', icon: BookOpen },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  const debugItem = { id: 'debug', label: 'Debug', icon: Bug };

  return (
    <nav className="shrink-0 w-full z-50 flex justify-around items-center px-2 pt-3 pb-5 bg-[#fbfbe2]/90 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-8px_32px_rgba(27,29,14,0.08)] border-t border-outline-variant/10">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center px-1 py-2 transition-all active:scale-90 duration-300",
              isActive 
                ? "bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl px-3 scale-105 shadow-md shadow-primary/20" 
                : "text-tertiary hover:text-primary"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
            <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
          </button>
        );
      })}
      
      {/* Debug Nav Item - Sadece debug modda görünür */}
      {isDebugMode && (
        <button
          key={debugItem.id}
          onClick={() => onNavigate(debugItem.id)}
          className={cn(
            "flex flex-col items-center justify-center px-1 py-2 transition-all active:scale-90 duration-300",
            activeView === debugItem.id
              ? "bg-gradient-to-br from-error to-error/80 text-white rounded-2xl px-3 scale-105 shadow-md shadow-error/20"
              : "text-error/60 hover:text-error"
          )}
        >
          <debugItem.icon className={cn("w-6 h-6 mb-1", activeView === debugItem.id && "fill-current")} />
          <span className="text-[10px] font-semibold tracking-wide">{debugItem.label}</span>
        </button>
      )}
    </nav>
  );
}
