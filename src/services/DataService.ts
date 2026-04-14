import { AppData } from '../types';
import { INITIAL_DATA } from '../constants';
import { validateAppData } from '../types.validation';

const STORAGE_KEY = 'kaza_takibi_data';
const MAX_HISTORY_ENTRIES = 1000;

export const DataService = {
  /**
   * LocalStorage'dan veriyi çeker. Eğer veri yoksa INITIAL_DATA'yı yazar ve onu döner.
   * (Lazy Initialization)
   */
  getOrInit: (): AppData => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const validated = validateAppData(parsed);
        if (validated) {
          return validated;
        }
        console.warn('Invalid data in localStorage, using initial data');
      }
      
      // Veri yoksa veya geçersizse başlangıç verilerini yaz
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    } catch (error) {
      console.error("Veri okunurken hata oluştu, varsayılan veri kullanılıyor.", error);
      return INITIAL_DATA;
    }
  },

  /**
   * Verilen datayı LocalStorage'a kaydeder.
   */
  save: (data: AppData): void => {
    try {
      // Enforce history limit - keep most recent entries
      const limitedData = {
        ...data,
        history: data.history?.slice(0, MAX_HISTORY_ENTRIES) ?? []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedData));
    } catch (error) {
      console.error("Veri kaydedilirken hata oluştu.", error);
    }
  },

  /**
   * Tüm verileri sıfırlar (Test veya ayarlar için)
   */
  reset: (): AppData => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  },

  /**
   * Mevcut veriyi JSON dosyası olarak dışa aktarır.
   */
  exportToFile: (): void => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        alert('Dışa aktarılacak veri bulunamadı.');
        return;
      }
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().split('T')[0];
      const filename = `kaza-namaz-yedek-${date}.json`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Dışa aktarma hatası:', error);
      alert('Veri dışa aktarılamadı.');
    }
  },

  /**
   * JSON dosyasından veri içe aktarır ve localStorage'a kaydeder.
   */
  importFromFile: (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content) as AppData;
          
          // Basic validation
          if (!parsed.prayers || !parsed.user || !parsed.stats) {
            resolve({ success: false, message: 'Geçersiz yedekleme dosyası.' });
            return;
          }
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          resolve({ success: true, message: 'Veriler başarıyla geri yüklendi. Sayfayı yenileyin.' });
        } catch {
          resolve({ success: false, message: 'Dosya okunamadı veya bozuk.' });
        }
      };
      
      reader.onerror = () => {
        resolve({ success: false, message: 'Dosya okunamadı.' });
      };
      
      reader.readAsText(file);
    });
  }
};
