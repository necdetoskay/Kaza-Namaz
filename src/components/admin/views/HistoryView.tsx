import { History, CalendarDays, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../../hooks/useStore';
import { PRAYER_NAMES } from '../../../constants';
import { PrayerLog } from '../../../types';

export function HistoryView() {
  const { data } = useStore();
  const history = data.history || [];

  // Kayıtları tarihe göre grupla
  const groupedHistory = history.reduce((acc, log) => {
    const dateObj = new Date(log.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    if (dateObj.toDateString() === today.toDateString()) {
      dateKey = 'Bugün';
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      dateKey = 'Dün';
    }

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, PrayerLog[]>);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-1">
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-background">Geçmiş</h2>
        <p className="text-tertiary font-medium">Kıldığın kaza namazlarının zaman çizelgesi.</p>
      </section>

      {history.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-12 flex flex-col items-center text-center shadow-sm border border-outline-variant/10">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
            <History className="w-10 h-10 text-outline" />
          </div>
          <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Henüz Kayıt Yok</h3>
          <p className="text-tertiary text-sm max-w-xs">
            Kaza namazı kıldıkça ve Ana Sayfa'dan ekledikçe kayıtların burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([date, logs]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-2 text-tertiary">
                <CalendarDays className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">{date}</h3>
              </div>
              
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/10 space-y-6">
                {logs.map((log, index) => (
                  <div key={log.id} className="relative flex items-start gap-4 group">
                    {/* Timeline Line */}
                    {index !== logs.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-[-24px] w-0.5 bg-surface-container-high group-hover:bg-primary/20 transition-colors"></div>
                    )}
                    
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 z-10 border border-primary/20">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-2 pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-on-surface text-lg leading-none">
                          {PRAYER_NAMES[log.type]} Namazı
                        </h4>
                        <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">
                          +{log.amount} Vakit
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 text-tertiary text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
