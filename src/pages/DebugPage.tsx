import { useState } from 'react';
import { Bug, Plus, RotateCcw, Trash2, Zap, AlertTriangle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { DataService } from '../services/DataService';
import { PrayerType } from '../types';
import { PRAYER_NAMES } from '../constants';
import { cn } from '../lib/utils';

const PRAYER_TYPES: PrayerType[] = ['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi', 'vitir'];

export function DebugPage() {
  const { data, setData } = useStore();
  const [testAmount, setTestAmount] = useState(10);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerType>('sabah');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Hızlı Veri Enjeksiyonu
  const handleAddTestData = () => {
    if (testAmount <= 0) {
      showMessage('error', 'Miktar 0\'dan büyük olmalı');
      return;
    }

    const newHistory = [...(data.history || [])];
    const now = new Date();

    for (let i = 0; i < testAmount; i++) {
      const randomPrayer = PRAYER_TYPES[Math.floor(Math.random() * PRAYER_TYPES.length)];
      newHistory.push({
        id: `debug-${Date.now()}-${i}`,
        timestamp: now.toISOString(),
        type: randomPrayer,
        amount: 1,
      });
    }

    setData({
      ...data,
      history: newHistory.slice(-1000), // MAX_HISTORY_ENTRIES
      prayers: {
        ...data.prayers,
        [selectedPrayer]: Math.max(0, data.prayers[selectedPrayer] - testAmount),
      },
      stats: {
        ...data.stats,
        totalCompleted: data.stats.totalCompleted + testAmount,
        lastActiveDate: now.toISOString(),
      },
    });

    showMessage('success', `${testAmount} test verisi eklendi (${selectedPrayer})`);
  };

  // Veri Sıfırlama
  const handleResetAll = () => {
    if (window.confirm('⚠️ Tüm verileri sıfırlamak istediğine emin misin? Bu işlem geri alınamaz!')) {
      const reset = DataService.reset();
      setData(reset);
      showMessage('success', 'Tüm veriler sıfırlandı');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('⚠️ History silinecek. Emin misin?')) {
      setData({
        ...data,
        history: [],
      });
      showMessage('success', 'History temizlendi');
    }
  };

  // Stress Test
  const handleStressTest = () => {
    const count = 1000;
    const newHistory = [...(data.history || [])];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const randomPrayer = PRAYER_TYPES[Math.floor(Math.random() * PRAYER_TYPES.length)];
      newHistory.push({
        id: `stress-${Date.now()}-${i}`,
        timestamp: new Date(now.getTime() - i * 60000).toISOString(), // 1 dakika arayla
        type: randomPrayer,
        amount: 1,
      });
    }

    const start = performance.now();
    setData({
      ...data,
      history: newHistory.slice(-1000),
    });
    const end = performance.now();

    showMessage('success', `1000 log eklendi (${(end - start).toFixed(2)}ms)`);
  };

  const totalHistory = data.history?.length || 0;
  const historyLimit = 1000;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section className="flex items-center gap-3">
        <div className="bg-error/10 p-3 rounded-2xl">
          <Bug className="w-6 h-6 text-error" />
        </div>
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-background">Debug Panel</h2>
          <p className="text-tertiary text-sm font-medium">Test ve geliştirme araçları</p>
        </div>
      </section>

      {/* Message */}
      {message && (
        <div className={cn(
          "fixed top-4 right-4 left-4 md:left-auto md:w-80 p-4 rounded-2xl shadow-lg z-50 animate-in slide-in-from-top duration-300",
          message.type === 'success' ? "bg-secondary text-white" : "bg-error text-white"
        )}>
          {message.text}
        </div>
      )}

      {/* State Viewer */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/10">
        <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Mevcut State
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-high rounded-xl p-4">
            <p className="text-xs text-tertiary font-medium mb-1">Toplam Borç</p>
            <p className="text-2xl font-bold text-on-surface">
              {Object.values(data.prayers).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          
          <div className="bg-surface-container-high rounded-xl p-4">
            <p className="text-xs text-tertiary font-medium mb-1">History Log</p>
            <p className="text-2xl font-bold text-on-surface">
              {totalHistory} <span className="text-sm text-tertiary">/ {historyLimit}</span>
            </p>
          </div>
          
          <div className="bg-surface-container-high rounded-xl p-4">
            <p className="text-xs text-tertiary font-medium mb-1">Streak</p>
            <p className="text-2xl font-bold text-on-surface">{data.stats.streak}</p>
          </div>

          <div className="bg-surface-container-high rounded-xl p-4">
            <p className="text-xs text-tertiary font-medium mb-1">Total Completed</p>
            <p className="text-2xl font-bold text-on-surface">{data.stats.totalCompleted}</p>
          </div>

          <div className="bg-surface-container-high rounded-xl p-4">
            <p className="text-xs text-tertiary font-medium mb-1">Günlük Hedef</p>
            <p className="text-2xl font-bold text-on-surface">{data.user.dailyTarget}</p>
          </div>
        </div>

        {/* Prayer Counts */}
        <div className="mt-4 pt-4 border-t border-outline-variant/20">
          <p className="text-xs text-tertiary font-medium mb-2">Vakit Borçları</p>
          <div className="flex flex-wrap gap-2">
            {PRAYER_TYPES.map((type) => (
              <div key={type} className="bg-surface-container rounded-lg px-3 py-1.5 text-xs">
                <span className="text-tertiary">{PRAYER_NAMES[type]}: </span>
                <span className="font-bold text-on-surface">{data.prayers[type]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Inject */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/10">
        <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Hızlı Veri Enjeksiyonu
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs text-tertiary font-medium mb-1 block">Miktar</label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
            />
          </div>
          
          <div className="flex-1">
            <label className="text-xs text-tertiary font-medium mb-1 block">Vakit</label>
            <select
              value={selectedPrayer}
              onChange={(e) => setSelectedPrayer(e.target.value as PrayerType)}
              className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PRAYER_TYPES.map((type) => (
                <option key={type} value={type}>{PRAYER_NAMES[type]}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleAddTestData}
              className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
            >
              Test Verisi Ekle
            </button>
          </div>
        </div>
      </section>

      {/* Reset Controls */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/10">
        <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-error" />
          Veri Sıfırlama
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleResetAll}
            className="flex-1 bg-error/10 hover:bg-error/20 text-error font-bold py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Tüm Verileri Sıfırla
          </button>
          
          <button
            onClick={handleClearHistory}
            className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            History'yi Temizle
          </button>
        </div>
      </section>

      {/* Stress Test */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/10">
        <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Stress Test
        </h3>
        
        <button
          onClick={handleStressTest}
          className="w-full bg-warning/10 hover:bg-warning/20 text-warning font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
        >
          1000 Log Ekle (Performance Test)
        </button>
        
        <p className="text-xs text-tertiary mt-2">
          MAX_HISTORY_ENTRIES (1000) limitini test eder. History 1000 kaydı aştığında eski kayıtlar silinir.
        </p>
      </section>
    </div>
  );
}
