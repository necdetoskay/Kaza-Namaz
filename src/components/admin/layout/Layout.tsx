import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  activeView: string;
  onNavigate: (view: string) => void;
  children: ReactNode;
}

export function Layout({ activeView, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-surface-container-low flex justify-center sm:py-4">
      {/* Mobile App Frame */}
      <div className="w-full max-w-md bg-background sm:rounded-[2.5rem] sm:h-[calc(100dvh-2rem)] h-[100dvh] relative sm:shadow-2xl flex flex-col overflow-hidden sm:border border-outline-variant/10">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-5 pt-6 pb-6 no-scrollbar">
          {children}
        </main>

        <BottomNav activeView={activeView} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
