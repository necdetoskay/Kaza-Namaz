import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { useStore } from '../../../hooks/useStore';
import { Save, RefreshCw, Download, Upload, Database, CheckCircle, XCircle } from 'lucide-react';
import { DataService } from '../../../services/DataService';
import { DatabaseService } from '../../../services/DatabaseService';

export function SettingsView() {
  const { data, updateDailyTarget, resetData } = useStore();
  const [target, setTarget] = useState(data.user.dailyTarget.toString());
  const [saved, setSaved] = useState(false);
  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const [sqliteStatus, setSqliteStatus] = useState<{ok: boolean; message: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // SQLite durumunu kontrol et
  useEffect(() => {
    const checkSQLite = async () => {
      try {
        await DatabaseService.initialize();
        const isOpen = DatabaseService.isOpen();
        if (isOpen) {
          setSqliteStatus({ ok: true, message: 'SQLite çalışıyor' });
        } else {
          setSqliteStatus({ ok: false, message: 'SQLite bağlantısı açılamadı' });
        }
      } catch (e) {
        setSqliteStatus({ ok: false, message: 'SQLite hatası: ' + String(e) });
      }
    };
    checkSQLite();
  }, []);

  const handleSave = () => {
    const num = parseInt(target, 10);
    if (!isNaN(num) && num > 0) {
      updateDailyTarget(num);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleExport = () => {
    DataService.exportToFile();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await DataService.importFromFile(file);
    setImportMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Clear message after 5 seconds
    setTimeout(() => setImportMessage(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-1">
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-background">Profil & Ayarlar</h2>
        <p className="text-tertiary font-medium">Uygulama tercihlerini yönet.</p>
      </section>

      {/* SQLite Durumu */}
      {sqliteStatus && (
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${
          sqliteStatus.ok ? 'bg-secondary/10' : 'bg-error/10'
        }`}>
          {sqliteStatus.ok ? (
            <CheckCircle className="w-6 h-6 text-secondary" />
          ) : (
            <XCircle className="w-6 h-6 text-error" />
          )}
          <div>
            <p className={`font-bold ${sqliteStatus.ok ? 'text-secondary' : 'text-error'}`}>
              SQLite Durumu
            </p>
            <p className="text-sm opacity-80">{sqliteStatus.message}</p>
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10 space-y-6">
        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Import result message */}
        {importMessage && (
          <div className={`p-3 rounded-xl text-sm font-medium ${
            importMessage.type === 'success' 
              ? 'bg-secondary/10 text-secondary' 
              : 'bg-error/10 text-error'
          }`}>
            {importMessage.text}
          </div>
        )}

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

        {/* Yedekleme Alanı */}
        <div>
          <h3 className="font-bold text-lg text-on-surface mb-4">Yedekleme</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleExport}
              className="flex-1 bg-primary/10 text-primary h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>Yedekle</span>
            </button>
            <button 
              onClick={handleImportClick}
              className="flex-1 bg-surface-container hover:bg-surface-container-high h-14 rounded-2xl font-bold flex items-center justify-center gap-2 text-on-surface transition-colors active:scale-95 border border-outline-variant/20"
            >
              <Upload className="w-5 h-5" />
              <span>Geri Yükle</span>
            </button>
          </div>
          <p className="text-xs text-tertiary mt-2">Yedeğinizi JSON dosyası olarak kaydedin. Geri yüklemek için dosyayı seçin.</p>
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
