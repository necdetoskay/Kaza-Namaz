import { useState } from 'react';
import { useStore } from '../../../hooks/useStore';
import { Save, RefreshCw } from 'lucide-react';

export function SettingsView() {
  const { data, updateDailyTarget, resetData } = useStore();
  const [target, setTarget] = useState(data.user.dailyTarget.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const num = parseInt(target, 10);
    if (!isNaN(num) && num > 0) {
      updateDailyTarget(num);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-1">
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-background">Profil & Ayarlar</h2>
        <p className="text-tertiary font-medium">Uygulama tercihlerini yönet.</p>
      </section>

      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10 space-y-6">
        <div>
          <h3 className="font-bold text-lg text-on-surface mb-4">Günlük Hedef</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="number" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full sm:flex-1 bg-surface-container-low h-14 px-4 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-semibold transition-all"
            />
            <button 
              onClick={handleSave}
              className="w-full sm:w-auto bg-primary text-on-primary px-6 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors active:scale-95 shrink-0"
            >
              <Save className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap">{saved ? 'Kaydedildi' : 'Kaydet'}</span>
            </button>
          </div>
          <p className="text-xs text-tertiary mt-2">Günlük kılmayı hedeflediğiniz kaza namazı vakit sayısı.</p>
        </div>

        <hr className="border-outline-variant/20" />

        <div>
          <h3 className="font-bold text-lg text-error mb-4">Tehlikeli Alan</h3>
          <button 
            onClick={() => {
              if (window.confirm('Tüm verileriniz sıfırlanacak. Emin misiniz?')) {
                resetData();
              }
            }}
            className="w-full bg-error/10 text-error h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-error/20 transition-colors active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Tüm Verileri Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}
