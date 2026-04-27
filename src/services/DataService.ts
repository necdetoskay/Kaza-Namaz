import { AppData } from '../types';
import { validateAppData } from '../types.validation';
import { DatabaseService } from './DatabaseService';
import { FirebaseSyncService } from './FirebaseSyncService';
import type { User } from '@capacitor-firebase/authentication';

const STORAGE_KEY = 'kaza_takibi_data';
const MAX_HISTORY_ENTRIES = 1000;

export const DataService = {
  /**
   * Veritabanını başlatır ve veriyi çeker.
   * Veri yoksa null döner.
   */
  async initialize(user?: User): Promise<AppData | null> {
    try {
      // SQLite'ı başlat
      await DatabaseService.initialize();
      
      // Önce local veriyi oku
      let localData = await DatabaseService.getAll();
      
      if (user) {
        // Firebase ile senkronize et
        const mergedData = await FirebaseSyncService.mergeData(localData, user);
        
        // Eğer merged data farklıysa SQLite'a kaydet
        if (!localData || JSON.stringify(mergedData) !== JSON.stringify(localData)) {
          await DatabaseService.saveAll(mergedData);
        }
        
        return mergedData;
      }
      
      return localData;
    } catch (error) {
      console.error("Veri okunurken hata oluştu:", error);
      return null;
    }
  },

  /**
   * Verilen datayı kaydeder
   */
  async save(data: AppData, user?: User): Promise<void> {
    try {
      // History limit
      const limitedData = {
        ...data,
        history: data.history?.slice(0, MAX_HISTORY_ENTRIES) ?? []
      };
      
      // SQLite'a kaydet (her zaman)
      await DatabaseService.saveAll(limitedData);
      
      // Firebase'e kaydet (eğer kullanıcı varsa)
      if (user) {
        await FirebaseSyncService.saveUserData(user, limitedData);
      }
    } catch (error) {
      console.error("Veri kaydedilirken hata oluştu.", error);
    }
  },

  /**
   * Tüm verileri sıfırlar
   */
  async reset(user?: User): Promise<AppData> {
    try {
      await DatabaseService.reset();
      
      if (user) {
        // Firebase'den de sil
        await FirebaseSyncService.saveUserData(user, INITIAL_DATA);
      }
    } catch (error) {
      console.error("Reset hatası:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return INITIAL_DATA;
  },

  /**
   * Mevcut veriyi JSON dosyası olarak dışa aktarır.
   */
  exportToFile: async (): Promise<void> => {
    try {
      const data = await DatabaseService.getAll();
      const jsonString = JSON.stringify(data, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
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
   * JSON dosyasından veri içe aktarır.
   */
  importFromFile: async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content) as AppData;
          
          // Basic validation
          if (!parsed.prayers || !parsed.user || !parsed.stats) {
            resolve({ success: false, message: 'Geçersiz yedekleme dosyası.' });
            return;
          }
          
          // Veriyi kaydet
          await DatabaseService.saveAll(parsed);
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
