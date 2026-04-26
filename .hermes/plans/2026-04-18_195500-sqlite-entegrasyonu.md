# Plan: SQLite Entegrasyonu — Kaza Namaz

## 🎯 Hedef
LocalStorage yerine **Capacitor SQLite** plugin kullanarak veri kalıcılığını sağlamak. Mevcut veri otomatik migrate edilecek.

---

## 📦 Kullanılacak Plugin

```
@capacitor-community/sqlite
```

---

## 📊 Mevcut Durum

| Özellik | Değer |
|---------|-------|
| **Storage** | LocalStorage (`kaza_takibi_data`) |
| **Veri Modeli** | `AppData` (user, prayers, stats, history) |
| **İşlemler** | CRUD (create, read, update, delete) |

---

## 🗄️ Önerilen Veritabanı Yapısı

### Tablo: `user`
```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY DEFAULT 1,
  gender TEXT,
  birth_date TEXT,
  start_date TEXT,
  daily_target INTEGER DEFAULT 5
);
```

### Tablo: `prayers`
```sql
CREATE TABLE prayers (
  id INTEGER PRIMARY KEY DEFAULT 1,
  sabah INTEGER DEFAULT 720,
  ogle INTEGER DEFAULT 840,
  ikindi INTEGER DEFAULT 840,
  aksam INTEGER DEFAULT 820,
  yatsi INTEGER DEFAULT 850,
  vitir INTEGER DEFAULT 450
);
```

### Tablo: `stats`
```sql
CREATE TABLE stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  streak INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  last_active_date TEXT
);
```

### Tablo: `history`
```sql
CREATE TABLE history (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL
);
```

---

## 📁 Dosya Değişiklikleri

### 1. Yeni Dosya: `src/services/DatabaseService.ts`
- SQLite bağlantısı ve CRUD işlemleri
- Tablo oluşturma (initialize)
- Migration mantığı

### 2. Güncellenecek: `src/services/DataService.ts`
- Mevcut metodlar korunur
- İç işlemler SQLite'a yönlendirilir
- LocalStorage referansı kaldırılır

### 3. Güncellenecek: `src/contexts/StoreContext.tsx`
- `DataService.getOrInit()` → `DatabaseService.initialize()`
- `DataService.save()` → `DatabaseService.saveAll()`

### 4. Güncellenecek: `src/types.ts`
- Yeni tipler eklenebilir (opsiyonel)

### 5. Güncellenecek: `package.json`
- `@capacitor-community/sqlite` eklenir

---

## 🔄 Migration Stratejisi

### Adım 1: Plugin Kurulumu
```bash
npm install @capacitor-community/sqlite
```

### Adım 2: DatabaseService Oluşturma
- `open()` — veritabanı bağlantısı
- `initialize()` — tabloları oluştur
- `migrateFromLocalStorage()` — eski veriyi taşı

### Adım 3: Veri Okuma
1. SQLite'dan dene
2. Boşsa LocalStorage'a bak
3. LocalStorage'ta varsa SQLite'a taşı
4. Hiçbiri yoksa varsayılan değerler

### Adım 4: Veri Yazma
- Her değişiklikte hem SQLite güncelle
- `save()` metodu içinde `INSERT OR REPLACE`

### Adım 5: LocalStorage Temizliği
- Migration başarılıysa LocalStorage key silinir
- Sadece ilk açılışta çalışır

---

## ⚠️ Riskler ve Çözümler

| Risk | Çözüm |
|------|-------|
| Plugin çalışmazsa | Fallback: LocalStorage devreder |
| Migration başarısız olursa | Try-catch ile log, devam eder |
| Veri kaybı | Migration öncesi LocalStorage yedeklenir |

---

## ✅ Doğrulama Adımları

1. **Kurulum testi:**
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Emülatör testi:**
   - Uygulama açılır
   - Hoşgeldin ekranı yerine ana dashboard görünür
   - Veriler korunur

3. **Veri bütünlüğü:**
   - Yeni namaz kıl → SQLite'a kaydedilir
   - Uygulamayı kapat → aç → veri hala var

---

## 📋 Todo Listesi

- [ ] `@capacitor-community/sqlite` kurulumu
- [ ] `DatabaseService.ts` oluşturma
- [ ] Tablo oluşturma (initialize)
- [ ] Migration fonksiyonu
- [ ] `DataService.ts` güncelleme
- [ ] `StoreContext.tsx` güncelleme
- [ ] Build + APK üretimi
- [ ] Emülatörde test

---

## ⏱️ Tahmini Süre

~30-45 dakika

---

## ❓ Açık Sorular

1. **LocalStorage'taki veri silinsin mi?** (Migration sonrası)
2. **history tablosu için limit olsun mu?** (Şu an 1000 var)

