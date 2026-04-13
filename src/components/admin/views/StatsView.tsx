import { Flame, Award, CheckCircle, CalendarSync, Star } from 'lucide-react';
import { useStore } from '../../../hooks/useStore';

export function StatsView() {
  const { data } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-1">
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-background">İstatistikler</h2>
        <p className="text-tertiary font-medium">Ruhsal yolculuğundaki gelişimini takip et.</p>
      </section>

      {/* Bento Grid: Main Stats */}
      <div className="flex flex-col gap-4">
        {/* Streak Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 flex items-center justify-between shadow-sm border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Flame className="w-32 h-32 text-on-surface" />
          </div>
          <div className="space-y-1 relative z-10">
            <p className="text-tertiary text-sm font-semibold uppercase tracking-wider">En Uzun Seri</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold font-headline text-primary">{data.stats.streak}</span>
              <span className="text-lg font-bold text-primary-container">Gün</span>
            </div>
          </div>
          <div className="bg-primary-fixed rounded-2xl p-3 relative z-10">
            <Award className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Total Prayer Summary */}
        <div className="bg-surface-container-high rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/10">
          <p className="text-tertiary text-sm font-semibold uppercase tracking-wider">Toplam Kılınan</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-12 w-1.5 bg-primary rounded-full"></div>
            <div>
              <span className="text-4xl font-extrabold font-headline text-on-surface">{data.stats.totalCompleted}</span>
              <p className="text-xs text-on-surface-variant font-medium">Vakit Namaz Tamamlandı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Performance Chart */}
      <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-xl font-bold text-on-background">Haftalık Performans</h3>
          <div className="bg-surface-container-low px-3 py-1 rounded-full text-xs font-bold text-primary">Bu Hafta</div>
        </div>
        <div className="flex items-end justify-between h-48 gap-2">
          {/* Mock Chart Bars */}
          {[
            { day: 'Pzt', h: '60%', active: false },
            { day: 'Sal', h: '45%', active: false },
            { day: 'Çar', h: '90%', active: true },
            { day: 'Per', h: '75%', active: false },
            { day: 'Cum', h: '40%', active: false },
            { day: 'Cmt', h: '55%', active: false },
            { day: 'Paz', h: '30%', active: false },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div 
                className={`w-full rounded-t-xl transition-all duration-300 ${item.active ? 'bg-primary-container' : 'bg-primary-fixed-dim group-hover:bg-primary'}`} 
                style={{ height: item.h }}
              ></div>
              <span className={`mt-3 text-[10px] font-bold uppercase tracking-tighter ${item.active ? 'text-primary' : 'text-tertiary'}`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Badges Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl font-bold text-on-background">Kazanılan Rozetler</h3>
          <button className="text-primary font-bold text-sm hover:opacity-70 transition-opacity">Tümünü Gör</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-container rounded-2xl p-4 flex flex-col items-center text-center space-y-2 border border-outline-variant/15">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center">
              <Star className="w-6 h-6 text-on-tertiary-fixed-variant" />
            </div>
            <p className="text-[11px] font-bold leading-tight text-on-surface">İlk Adım</p>
          </div>
          <div className="bg-surface-container-highest rounded-2xl p-4 flex flex-col items-center text-center space-y-2 border border-outline-variant/15">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-[11px] font-bold leading-tight text-on-surface">100 Tamamlandı</p>
          </div>
          <div className="bg-surface-container rounded-2xl p-4 flex flex-col items-center text-center space-y-2 border border-outline-variant/15">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
              <CalendarSync className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-[11px] font-bold leading-tight text-on-surface">Haftalık Devam</p>
          </div>
        </div>
      </section>

      {/* Quote Card */}
      <div className="bg-tertiary-fixed-dim/30 rounded-3xl p-6 border border-tertiary-fixed italic text-on-tertiary-fixed-variant text-sm text-center leading-relaxed">
        "Sabır, başarının anahtarıdır. Küçük adımlar, büyük zaferlerin habercisidir."
      </div>
    </div>
  );
}
