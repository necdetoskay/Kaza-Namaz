import { Leaf, UserCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full z-40 bg-[#fbfbe2]/90 backdrop-blur-lg flex justify-between items-center px-5 h-16 shrink-0 border-b border-outline-variant/5">
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-primary" />
        <h1 className="font-headline font-bold tracking-tight text-lg text-primary">Kaza Takibi</h1>
      </div>
      <div className="flex items-center">
        <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
          <UserCircle className="w-6 h-6 text-tertiary" />
        </button>
      </div>
    </header>
  );
}
