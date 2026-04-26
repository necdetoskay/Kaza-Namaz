import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDB } from '@capacitor-community/sqlite';
import { AppData, UserProfile, PrayerCounts, AppStats, PrayerLog } from '../types';
import { INITIAL_DATA } from '../constants';

const DB_NAME = 'kaza_namaz.db';
const STORAGE_KEY = 'kaza_takibi_data';

let sqliteDb: SQLiteDB | null = null;

export const DatabaseService = {
  /**
   * Veritabanı bağlantısını başlatır ve tabloları oluşturur
   */
  async initialize(): Promise<void> {
    try {
      // Platform kontrolü
      const isMobile = Capacitor.isNativePlatform();

      if (isMobile) {
        // SQLite bağlantısı oluştur
        const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
        
        // Veritabanını aç
        sqliteDb = await sqlite.open({
          name: DB_NAME,
          location: 'default'
        });

        // Tabloları oluştur
        await createTables();
        
        // Migration kontrolü
        await migrateFromLocalStorage();
      } else {
        // Web platformu için LocalStorage kullan
        console.log('Web platform - LocalStorage kullanılıyor');
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  },

  /**
   * Veritabanı açık mı kontrol eder
   */
  isOpen(): boolean {
    return sqliteDb !== null;
  },

  /**
   * Tüm verileri okur
   */
  async getAll(): Promise<AppData> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      return await getAllFromSQLite();
    } else {
      return getFromLocalStorage();
    }
  },

  /**
   * Kullanıcı verisini okur
   */
  async getUser(): Promise<UserProfile> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        const result = await sqliteDb.query('SELECT * FROM user WHERE id = 1');
        if (result.rows && result.rows.length > 0) {
          const row = result.rows.item(0);
          return {
            gender: row.gender,
            birthDate: row.birth_date,
            startDate: row.start_date,
            dailyTarget: row.daily_target
          };
        }
      } catch (error) {
        console.error('User data read failed:', error);
      }
    }
    
    return getFromLocalStorage().user;
  },

  /**
   * Namaz sayaçlarını okur
   */
  async getPrayers(): Promise<PrayerCounts> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        const result = await sqliteDb.query('SELECT * FROM prayers WHERE id = 1');
        if (result.rows && result.rows.length > 0) {
          const row = result.rows.item(0);
          return {
            sabah: row.sabah,
            ogle: row.ogle,
            ikindi: row.ikindi,
            aksam: row.aksam,
            yatsi: row.yatsi,
            vitir: row.vitir
          };
        }
      } catch (error) {
        console.error('Prayers data read failed:', error);
      }
    }
    
    return getFromLocalStorage().prayers;
  },

  /**
   * İstatistikleri okur
   */
  async getStats(): Promise<AppStats> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        const result = await sqliteDb.query('SELECT * FROM stats WHERE id = 1');
        if (result.rows && result.rows.length > 0) {
          const row = result.rows.item(0);
          return {
            streak: row.streak,
            totalCompleted: row.total_completed,
            lastActiveDate: row.last_active_date
          };
        }
      } catch (error) {
        console.error('Stats data read failed:', error);
      }
    }
    
    return getFromLocalStorage().stats;
  },

  /**
   * Geçmişi okur
   */
  async getHistory(): Promise<PrayerLog[]> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        const result = await sqliteDb.query(
          'SELECT * FROM history ORDER BY timestamp DESC LIMIT 1000'
        );
        if (result.rows && result.rows.length > 0) {
          const history: PrayerLog[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            history.push({
              id: row.id,
              timestamp: row.timestamp,
              type: row.type,
              amount: row.amount
            });
          }
          return history;
        }
      } catch (error) {
        console.error('History data read failed:', error);
      }
    }
    
    return getFromLocalStorage().history;
  },

  /**
   * Tüm verileri kaydeder
   */
  async saveAll(data: AppData): Promise<void> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      await saveAllToSQLite(data);
    }
    
    // Her durumda LocalStorage'a da kaydet (fallback)
    saveToLocalStorage(data);
  },

  /**
   * Kullanıcı verisini günceller
   */
  async saveUser(user: UserProfile): Promise<void> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        await sqliteDb.run(
          `INSERT OR REPLACE INTO user (id, gender, birth_date, start_date, daily_target)
           VALUES (1, ?, ?, ?, ?)`,
          [user.gender, user.birthDate, user.startDate, user.dailyTarget]
        );
      } catch (error) {
        console.error('User save failed:', error);
      }
    }
  },

  /**
   * Namaz sayaçlarını günceller
   */
  async savePrayers(prayers: PrayerCounts): Promise<void> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        await sqliteDb.run(
          `INSERT OR REPLACE INTO prayers (id, sabah, ogle, ikindi, aksam, yatsi, vitir)
           VALUES (1, ?, ?, ?, ?, ?, ?)`,
          [prayers.sabah, prayers.ogle, prayers.ikindi, prayers.aksam, prayers.yatsi, prayers.vitir]
        );
      } catch (error) {
        console.error('Prayers save failed:', error);
      }
    }
  },

  /**
   * İstatistikleri günceller
   */
  async saveStats(stats: AppStats): Promise<void> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        await sqliteDb.run(
          `INSERT OR REPLACE INTO stats (id, streak, total_completed, last_active_date)
           VALUES (1, ?, ?, ?)`,
          [stats.streak, stats.totalCompleted, stats.lastActiveDate]
        );
      } catch (error) {
        console.error('Stats save failed:', error);
      }
    }
  },

  /**
   * Geçmişe yeni kayıt ekler
   */
  async addHistoryLog(log: PrayerLog): Promise<void> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        await sqliteDb.run(
          `INSERT INTO history (id, timestamp, type, amount) VALUES (?, ?, ?, ?)`,
          [log.id, log.timestamp, log.type, log.amount]
        );
      } catch (error) {
        console.error('History add failed:', error);
      }
    }
  },

  /**
   * Tüm verileri sıfırlar
   */
  async reset(): Promise<void> {
    const isMobile = Capacitor.isNativePlatform();

    if (isMobile && sqliteDb) {
      try {
        await sqliteDb.run('DELETE FROM history');
        await sqliteDb.run('DELETE FROM user');
        await sqliteDb.run('DELETE FROM prayers');
        await sqliteDb.run('DELETE FROM stats');
        
        // Varsayılan değerleri ekle
        await sqliteDb.run(`INSERT INTO user (id) VALUES (1)`);
        await sqliteDb.run(`INSERT INTO prayers (id) VALUES (1)`);
        await sqliteDb.run(`INSERT INTO stats (id) VALUES (1)`);
      } catch (error) {
        console.error('Reset failed:', error);
      }
    }
    
    localStorage.removeItem(STORAGE_KEY);
  }
};

// ====== Private Functions ======

/**
 * Tabloları oluşturur
 */
async function createTables(): Promise<void> {
  if (!sqliteDb) return;

  try {
    // User tablosu
    await sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY DEFAULT 1,
        gender TEXT,
        birth_date TEXT,
        start_date TEXT,
        daily_target INTEGER DEFAULT 5
      )
    `);

    // Prayers tablosu
    await sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS prayers (
        id INTEGER PRIMARY KEY DEFAULT 1,
        sabah INTEGER DEFAULT 720,
        ogle INTEGER DEFAULT 840,
        ikindi INTEGER DEFAULT 840,
        aksam INTEGER DEFAULT 820,
        yatsi INTEGER DEFAULT 850,
        vitir INTEGER DEFAULT 450
      )
    `);

    // Stats tablosu
    await sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY DEFAULT 1,
        streak INTEGER DEFAULT 0,
        total_completed INTEGER DEFAULT 0,
        last_active_date TEXT
      )
    `);

    // History tablosu
    await sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        type TEXT NOT NULL,
        amount INTEGER NOT NULL
      )
    `);

    // Varsayılan satırları ekle (yoksa)
    await sqliteDb.run(`INSERT OR IGNORE INTO user (id) VALUES (1)`);
    await sqliteDb.run(`INSERT OR IGNORE INTO prayers (id) VALUES (1)`);
    await sqliteDb.run(`INSERT OR IGNORE INTO stats (id) VALUES (1)`);

  } catch (error) {
    console.error('Table creation failed:', error);
    throw error;
  }
}

/**
 * LocalStorage migration — kullanılmıyor, sadece SQLite var
 * @deprecated
 */
async function migrateFromLocalStorage(): Promise<void> {
  // SQLite-only mode — LocalStorage migration yok
  console.log('SQLite-only mode, skipping LocalStorage migration');
}

/**
 * SQLite'dan tüm veriyi okur — sadece SQLite, fallback yok
 */
async function getAllFromSQLite(): Promise<AppData> {
  if (!sqliteDb) {
    console.error('SQLite not initialized');
    return INITIAL_DATA;
  }

  try {
    const user = await DatabaseService.getUser();
    const prayers = await DatabaseService.getPrayers();
    const stats = await DatabaseService.getStats();
    const history = await DatabaseService.getHistory();

    // SQLite boşsa INITIAL_DATA dön — LocalStorage'a bakma
    if (!user || !prayers || !stats) {
      return INITIAL_DATA;
    }

    return { user, prayers, stats, history };
  } catch (error) {
    console.error('getAllFromSQLite failed:', error);
    return INITIAL_DATA;
  }
}

/**
 * SQLite'a tüm veriyi kaydeder
 */
async function saveAllToSQLite(data: AppData): Promise<void> {
  if (!sqliteDb) return;

  try {
    await DatabaseService.saveUser(data.user);
    await DatabaseService.savePrayers(data.prayers);
    await DatabaseService.saveStats(data.stats);
    
    // History'yi temizle ve yeniden ekle
    await sqliteDb.run('DELETE FROM history');
    for (const log of data.history.slice(0, 1000)) {
      await DatabaseService.addHistoryLog(log);
    }
  } catch (error) {
    console.error('saveAllToSQLite failed:', error);
  }
}

/**
 * LocalStorage'dan veri okur
 */
function getFromLocalStorage(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('LocalStorage read failed:', error);
  }
  return INITIAL_DATA;
}

/**
 * LocalStorage'a veri kaydeder
 */
function saveToLocalStorage(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('LocalStorage save failed:', error);
  }
}
