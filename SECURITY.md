# Kaza-Namaz — Security Audit Report

**Tarih:** 2026-04-26
**Auditor:** Hermes Agent (Security Audit Workflow)
**Proje:** necdetoskay/Kaza-Namaz
**Commit:** `fix/security-audit-2026-04-26`

---

## 🔍 Audit Özeti

| Risk Seviyesi | Bulgu Sayısı |
|----------------|--------------|
| 🔴 Kritik | 1 |
| 🟠 High | 2 |
| 🟡 Medium | 1 |

---

## 📋 Bulgular ve Çözümler

### 🔴 Kritik — Firebase Firestore Security Rules Yok

**Sorun:** Projede `firebase.json`, `firestore.rules` veya `firestore.indexes.json` dosyası bulunamadı. Bu, Firebase Console'da rules'ın muhtemelen "allow read, write: if false;" dışında bir şeyde olduğu anlamına geliyor.

**Durum:** ⚠️ **Elle kontrol edilmeli**

**Kontrol:**
1. [Firebase Console](https://console.firebase.google.com/) → proje → Firestore Database → Rules
2. Rules'ların şu şekilde olduğunu doğrula:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

**Düzeltme:** Firebase Console'da veya `firestore.rules` dosyası oluşturup proje köküne ekleyerek yönet.

---

### 🟠 High — SQLite Veritabanı Şifrelenmemiş

**Sorun:** `DatabaseService.ts` dosyasında şifreleme kullanılmıyor. `@capacitor-community/sqlite` encrypted database desteği sunuyor ama `open()` çağrısında `encryption: true` veya `key` parametresi yok.

**Mevcut Kod (satır 25-28):**
```typescript
sqliteDb = await sqlite.open({
  name: DB_NAME,
  location: 'default'
});
```

**Önerilen Düzeltme:**
```typescript
sqliteDb = await sqlite.open({
  name: DB_NAME,
  location: 'default',
  encryption: true
});
```

**Not:** Şifreleme için kullanıcıdan alınan PIN veya biyometrik auth gerekebilir. Bu bir breaking change olabilir.

**Durum:** ℹ️ **Bilgi notu — sonraki sprint'te değerlendirilebilir**

---

### 🟠 High — Firebase Auth Token Storage Kontrol Edilmeli

**Sorun:** Firebase Authentication kullanılıyor (`@capacitor-firebase/authentication`). Token'ların cihazda nasıl saklandığı kontrol edilmedi.

**Kontrol Edilecek:**
1. `@codetrix-studio/capacitor-google-auth` Capacitor 6'ya bağımlı (Capacitor 8'le uyumsuz — legacy-peer-deps ile çalışıyor)
2. Token'lar Keychain/Keystore'da mı saklanıyor?

**Durum:** ℹ️ **Bilgi notu — Google Auth plugin güncellenmeli**

---

### 🟡 Medium — Gereksiz express Dependency'si ✅ DÜZELTİLDİ

**Sorun:** `express` ve `@types/express` proje kodunda kullanılmıyordu ama package.json'da vardı.

**Çözüm:** `npm uninstall express @types/express --legacy-peer-deps` ile kaldırıldı.

**Kontrol:** `grep -r "express" src/` → sonuç yok (kullanılmıyordu)

**Durum:** ✅ **Düzeltildi**

---

## ✅ Düzeltilen Sorunlar

| # | Sorun | Çözüm | Tarih |
|---|-------|-------|-------|
| 1 | Gereksiz express dependency | `npm uninstall express @types/express` | 2026-04-26 |

---

## ⚠️ Elle Yapılması Gerekenler

1. **Firebase Console'da Firestore Rules kontrol et**
2. **Google Auth plugin'i Capacitor 8 uyumlu olana güncelle veya alternatif bul** (`@codetrix-studio/capacitor-google-auth` Capacitor 6'ya bağımlı)
3. **SQLite encryption sonraki sprint'te değerlendir**

---

## 📁 Eklenen Dosyalar

- `SECURITY.md` — Bu audit raporu

---

## 🔗 İlgili Kaynaklar

- [Firebase Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [@capacitor-community/sqlite Encryption](https://github.com/capacitor-community/sqlite)
- [OWASP Mobile Application Security](https://mas.owasp.org/)
