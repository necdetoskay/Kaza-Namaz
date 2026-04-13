import { AppData } from '../types';
import { INITIAL_DATA } from '../constants';

const STORAGE_KEY = 'kaza_takibi_data';

export const DataService = {
  /**
   * LocalStorage'dan veriyi çeker. Eğer veri yoksa INITIAL_DATA'yı yazar ve onu döner.
   * (Lazy Initialization)
   */
  getOrInit: (): AppData => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData) as AppData;
      }
      
      // Veri yoksa başlangıç verilerini yaz
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
  }
};
