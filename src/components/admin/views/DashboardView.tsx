import { useState } from 'react';
import { Zap, Sunrise, Sun, SunMedium, Sunset, Moon, Star, Leaf, Infinity, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../../hooks/useStore';
import { PrayerType } from '../../../types';
import { PRAYER_NAMES } from '../../../constants';
import { cn } from '../../../lib/utils';

export function DashboardView() {
  const { data, reducePrayer, undoPrayer } = useStore();
  const [clickAnimations, setClickAnimations] = useState<{id: number, type: PrayerType, amount: number}[]>([]);
  
  const totalRemaining = Object.values(data.prayers).reduce((a, b) => a + b, 0);
  const totalInitial = 720 + 840 + 840 + 820 + 850 + 450; // Mock initial total
  const percentage = Math.max(0, Math.min(100, Math.round(((totalInitial - totalRemaining) / totalInitial) * 100))) || 0;

  const prayerIcons: Record<PrayerType, React.ElementType> = {
    sabah: Sunrise,
    ogle: Sun,
    ikindi: SunMedium,
    aksam: Sunset,
    yatsi: Moon,
    vitir: Star,
  };

  // Calculate today's and yesterday's performance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todaysLogs = data.history?.filter(log => new Date(log.timestamp).getTime() >= today.getTime()) || [];
  const yesterdaysLogs = data.history?.filter(log => {
    const time = new Date(log.timestamp).getTime();
    return time >= yesterday.getTime() && time < today.getTime();
  }) || [];

  const getActualTodayCount = (type?: PrayerType) => {
    return todaysLogs
      .filter(log => type ? log.type === type : true)
      .reduce((sum, log) => sum + log.amount, 0);
  };

  const getProjectedRate = (type?: PrayerType) => {
    const todayCount = getActualTodayCount(type);
    if (todayCount > 0) return todayCount;

    const yesterdayCount = yesterdaysLogs
      .filter(log => type ? log.type === type : true)
      .reduce((sum, log) => sum + log.amount, 0);
      
    return yesterdayCount > 0 ? yesterdayCount : 0;
  };

  const formatEstimatedTime = (remaining: number, dailyRate: number): string | React.ReactNode => {
    if (remaining === 0) return "Tamamlandı";
    if (dailyRate <= 0) return <Infinity className="w-5 h-5 text-tertiary/70" />;
    
    const days = Math.ceil(remaining / dailyRate);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = Math.floor((days % 365) % 30);

    const parts = [];
    if (years > 0) parts.push(`${years} yıl`);
    if (months > 0) parts.push(`${months} ay`);
    if (remainingDays > 0 && parts.length < 2) parts.push(`${remainingDays} gün`); // Show max 2 units for brevity

    return parts.slice(0, 2).join(' ') || "Bugün";
  };

  const totalProjectedRate = getProjectedRate();
  const actualTodayTotal = getActualTodayCount();
  const dailyTarget = data.user.dailyTarget || 5;
  const dailyPercentage = Math.max(0, Math.min(100, Math.round((actualTodayTotal / dailyTarget) * 100)));

  const handlePrayerClick = (type: PrayerType) => {
    reducePrayer(type, 1);
    const id = Date.now();
    setClickAnimations(prev => [...prev, { id, type, amount: 1 }]);
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== id));
    }, 1000);
  };

  const handleUndoClick = (type: PrayerType) => {
    undoPrayer(type, 1);
    const id = Date.now();
    setClickAnimations(prev => [...prev, { id, type, amount: -1 }]);
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== id));
    }, 1000);
  };

  // Toplam kalan vakti yıl, ay, gün cinsinden hesapla (Günde 6 vakit farz/vacip)
  const totalRemainingDays = Math.ceil(totalRemaining / 6);
  const remainingYears = Math.floor(totalRemainingDays / 365);
  const remainingMonths = Math.floor((totalRemainingDays % 365) / 30);
  const remainingDays = Math.floor((totalRemainingDays % 365) % 30);

  const timeString1 = [
    remainingYears > 0 ? `${remainingYears} Yıl` : null,
    remainingMonths > 0 ? `${remainingMonths} Ay` : null
  ].filter(Boolean).join(' ');
  
  const timeString2 = remainingDays > 0 ? `${remainingDays} Gün` : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Progress Hero Section */}
      <section className="text-center flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center mx-auto">
          {/* Circular Progress SVG */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle className="text-surface-container-high" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="16"></circle>
            <circle 
              className="text-primary transition-all duration-1000 ease-out" 
              cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" 
              strokeDasharray="691" 
              strokeDashoffset={691 - (691 * percentage) / 100} 
              strokeLinecap="round" strokeWidth="16"
            ></circle>
          </svg>
          <div className="absolute flex flex-col items-center w-full px-8 text-center">
            <span className="text-tertiary font-medium text-xs tracking-wide mb-1">TOPLAM KALAN</span>
            <motion.div 
              key={totalRemaining}
              initial={{ scale: 1.1, color: '#0d631b' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="flex flex-col items-center justify-center mb-2"
            >
              {totalRemaining === 0 ? (
                <span className="text-2xl font-headline font-extrabold text-on-surface tracking-tighter">Tamamlandı</span>
              ) : (
                <>
                  {timeString1 && (
                    <span className="text-2xl font-headline font-extrabold text-on-surface tracking-tighter leading-tight">
                      {timeString1}
                    </span>
                  )}
                  {timeString2 && (
                    <span className={timeString1 ? "text-sm font-bold text-on-surface-variant mt-0.5" : "text-2xl font-headline font-extrabold text-on-surface tracking-tighter leading-tight"}>
                      {timeString2}
                    </span>
                  )}
                </>
              )}
            </motion.div>
            <div className="bg-primary-fixed px-3 py-1 rounded-full">
              <span className="text-on-primary-fixed-variant font-bold text-xs">%{percentage} Tamamlandı</span>
            </div>
          </div>
        </div>

        {/* Daily Progress Card */}
        <div className="mt-8 bg-surface-container-low p-5 rounded-3xl w-full flex items-center gap-5 border border-outline-variant/15 shadow-sm">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-surface-container-high" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className={cn(
                  "transition-all duration-1000 ease-out",
                  dailyPercentage >= 100 ? "text-secondary" : "text-primary"
                )}
                cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * dailyPercentage) / 100} 
                strokeLinecap="round" strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "text-lg font-bold leading-none",
                dailyPercentage >= 100 ? "text-secondary" : "text-primary"
              )}>{actualTodayTotal}</span>
              <span className="text-[10px] text-outline font-medium border-t border-outline-variant/30 pt-0.5 mt-0.5">/ {dailyTarget}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className={cn("w-4 h-4", dailyPercentage >= 100 ? "text-secondary" : "text-tertiary")} />
              <h3 className="font-bold text-on-surface text-sm">Günlük Hedef</h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
              {dailyPercentage >= 100 
                ? "Tebrikler! Günlük hedefine ulaştın." 
                : `Hedefine ulaşmak için ${dailyTarget - actualTodayTotal} kaza daha kılmalısın.`}
            </p>
            <div className="bg-surface-container rounded-lg px-3 py-2 inline-flex items-center gap-1.5 border border-outline-variant/10">
              <Timer className="w-3.5 h-3.5 text-primary" />
              <p className="text-[11px] font-medium text-on-surface">
                Tahmini Bitiş: <span className="font-bold text-primary">{formatEstimatedTime(totalRemaining, totalProjectedRate)}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Grid */}
      <section className="space-y-4">
        <h2 className="font-headline font-bold text-lg text-on-surface px-1 mb-4">Vakitler</h2>
        <div className="flex flex-col gap-4">
          {(Object.keys(data.prayers) as PrayerType[]).map((type) => {
            const Icon = prayerIcons[type];
            const count = data.prayers[type];
            const actualTodayCount = getActualTodayCount(type);
            const projectedRate = getProjectedRate(type);
            const activeAnimations = clickAnimations.filter(anim => anim.type === type);
            
            return (
              <div key={type} className={cn(
                "p-5 rounded-[2rem] flex flex-col gap-4 border transition-all duration-500",
                actualTodayCount >= 5 ? "bg-gradient-to-br from-primary-fixed to-primary-fixed-dim border-primary/40 shadow-lg shadow-primary/20 scale-[1.02]" :
                actualTodayCount >= 3 ? "bg-primary-fixed/60 border-primary/30 shadow-md shadow-primary/10" :
                actualTodayCount >= 1 ? "bg-primary-fixed/30 border-primary/20 shadow-sm" :
                "bg-surface-container-lowest border-outline-variant/10 shadow-sm hover:shadow-md"
              )}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-surface-container-high p-3 rounded-2xl shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-on-surface font-bold text-lg leading-tight">{PRAYER_NAMES[type]}</h3>
                      <motion.p 
                        key={count}
                        initial={{ y: -5, opacity: 0, color: '#0d631b' }}
                        animate={{ y: 0, opacity: 1, color: 'inherit' }}
                        className="text-tertiary text-sm font-semibold"
                      >
                        {count} Borç
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* Estimated Time Badge on the Right */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/10">
                      {projectedRate > 0 && <Timer className="w-3.5 h-3.5 text-primary" />}
                      <span className="text-xs font-bold text-tertiary flex items-center">
                        {formatEstimatedTime(count, projectedRate)}
                      </span>
                    </div>
                    {actualTodayCount > 0 && (
                      <span className="text-[10px] font-medium text-tertiary/60 mt-1 mr-1">Bugün: +{actualTodayCount}</span>
                    )}
                  </div>
                </div>
                
                <div className="relative flex gap-2 mt-1">
                  <button 
                    onClick={() => handleUndoClick(type)}
                    disabled={actualTodayCount === 0}
                    className="w-14 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-bold py-3.5 rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center shrink-0"
                    title="Yanlış girişi geri al"
                  >
                    <span className="text-lg">-1</span>
                  </button>

                  <button 
                    onClick={() => handlePrayerClick(type)}
                    disabled={count === 0}
                    className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    <span className="text-lg relative z-10">+1</span>
                    <span className="text-sm font-medium opacity-90 relative z-10">Kaza Kıldım</span>
                  </button>

                  {/* Floating +1 / -1 Animation */}
                  <AnimatePresence>
                    {activeAnimations.map(anim => (
                      <motion.div
                        key={anim.id}
                        initial={{ opacity: 1, y: 0, scale: 0.8 }}
                        animate={{ opacity: 0, y: anim.amount > 0 ? -50 : 50, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn(
                          "absolute top-0 pointer-events-none font-black text-3xl drop-shadow-md z-20",
                          anim.amount > 0 ? "left-1/2 -translate-x-1/2 text-primary" : "left-4 text-error"
                        )}
                      >
                        {anim.amount > 0 ? '+1' : '-1'}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="mt-12 bg-gradient-to-br from-primary-container to-primary rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-on-primary-container font-headline font-bold text-lg leading-relaxed mb-2">"Namaz, müminin nurudur."</p>
          <p className="text-primary-fixed/80 text-sm">Borçlarını temizleyerek ruhuna huzur katmaya devam et.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-20">
          <Leaf className="w-48 h-48 text-white" />
        </div>
      </section>
    </div>
  );
}
