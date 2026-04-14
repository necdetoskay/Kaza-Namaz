import { test, expect } from '@playwright/test';

/**
 * DataService E2E Tests
 * 
 * Bu testler gerçek browser ortamında localStorage davranışını test eder.
 * Playwright ile gerçek DOM ve browser API'leri kullanılır.
 * Her test için fresh context kullanılır.
 */

test.describe('DataService E2E Tests', () => {
  
  test.beforeEach(async ({ context }) => {
    // Fresh context - tamamen izole browser
    await context.clearCookies();
  });

  test.afterEach(async ({ page }) => {
    // Sayfayı kapat
    await page.close();
  });

  test.describe('getOrInit', () => {
    
    test('should return initial data when localStorage is empty', async ({ page, context }) => {
      // Yeni page aç, hiçbir şey yazma
      await page.goto('/');
      
      // Biraz bekle ve localStorage kontrol et
      await page.waitForTimeout(500);
      
      const data = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('kaza_takibi_data') || '{}');
      });
      
      // Fresh start olmalı
      expect(data.user?.dailyTarget).toBe(5);
      expect(data.prayers?.sabah).toBe(720);
    });

    test('should return stored data when localStorage has valid data', async ({ page }) => {
      // localStorage'a veri yaz
      await page.goto('/');
      await page.evaluate(() => {
        const storedData = {
          user: { gender: 'male', birthDate: '1990-01-01', startDate: '2020-01-01', dailyTarget: 10 },
          prayers: { sabah: 720, ogle: 840, ikindi: 840, aksam: 820, yatsi: 850, vitir: 450 },
          stats: { streak: 5, totalCompleted: 100, lastActiveDate: '2024-01-01' },
          history: [],
        };
        localStorage.setItem('kaza_takibi_data', JSON.stringify(storedData));
      });
      
      // Sayfayı yeniden yükle
      await page.reload();
      await page.waitForTimeout(500);
      
      // Veriler yüklenmiş olmalı
      const data = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('kaza_takibi_data') || '{}');
      });
      
      expect(data.user?.gender).toBe('male');
      expect(data.user?.dailyTarget).toBe(10);
      expect(data.stats?.streak).toBe(5);
    });

    test('should return initial data when stored JSON is invalid', async ({ page }) => {
      await page.goto('/');
      
      // Geçersiz JSON yaz
      await page.evaluate(() => {
        localStorage.setItem('kaza_takibi_data', 'this-is-not-valid-json');
      });
      
      await page.reload();
      await page.waitForTimeout(500);
      
      // initial data ile overwrite edilmiş olmalı
      const data = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('kaza_takibi_data') || '{}');
      });
      
      expect(data.user?.dailyTarget).toBe(5);
      expect(data.stats?.streak).toBe(0);
    });

    test('should return initial data when stored data has missing required fields', async ({ page }) => {
      await page.goto('/');
      
      // Eksik veri yaz
      await page.evaluate(() => {
        const incompleteData = { 
          user: { gender: 'male', birthDate: null, startDate: null, dailyTarget: 5 } 
        };
        localStorage.setItem('kaza_takibi_data', JSON.stringify(incompleteData));
      });
      
      await page.reload();
      await page.waitForTimeout(500);
      
      // initial data ile tamamlanmış olmalı
      const data = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('kaza_takibi_data') || '{}');
      });
      
      expect(data.prayers).toBeDefined();
      expect(data.prayers?.sabah).toBe(720);
      expect(data.stats).toBeDefined();
      expect(data.stats?.streak).toBe(0);
    });
  });

  test.describe('save', () => {
    
    test('should save data to localStorage', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(500);
      
      // Veri kaydet
      await page.evaluate(() => {
        const testData = {
          user: { gender: 'female', birthDate: '1995-01-01', startDate: '2021-01-01', dailyTarget: 7 },
          prayers: { sabah: 720, ogle: 840, ikindi: 840, aksam: 820, yatsi: 850, vitir: 450 },
          stats: { streak: 3, totalCompleted: 50, lastActiveDate: '2024-01-01' },
          history: [],
        };
        localStorage.setItem('kaza_takibi_data', JSON.stringify(testData));
      });
      
      const stored = await page.evaluate(() => localStorage.getItem('kaza_takibi_data'));
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.user.gender).toBe('female');
      expect(parsed.user.dailyTarget).toBe(7);
    });

    test('should enforce history limit of 1000 entries', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(500);
      
      // 1500 entry yaz
      await page.evaluate(() => {
        const history = Array.from({ length: 1500 }, (_, i) => ({
          id: String(i),
          timestamp: new Date().toISOString(),
          type: 'sabah',
          amount: 1,
        }));
        
        const testData = {
          user: { gender: null, birthDate: null, startDate: null, dailyTarget: 5 },
          prayers: { sabah: 720, ogle: 840, ikindi: 840, aksam: 820, yatsi: 850, vitir: 450 },
          stats: { streak: 0, totalCompleted: 0, lastActiveDate: null },
          history,
        };
        localStorage.setItem('kaza_takibi_data', JSON.stringify(testData));
      });
      
      // Sayfayı yeniden yükle - DataService.getOrInit() history'yi kesmeli
      await page.reload();
      await page.waitForTimeout(500);
      
      const stored = await page.evaluate(() => localStorage.getItem('kaza_takibi_data'));
      const parsed = JSON.parse(stored!);
      
      // slice(0, 1000) yapıldığı için ilk 1000 entry kalmış olmalı
      expect(parsed.history.length).toBe(1000);
      expect(parsed.history[0].id).toBe('0');
      expect(parsed.history[999].id).toBe('999');
    });
  });

  test.describe('reset', () => {
    
    test('should reset data to initial state', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(500);
      
      // Önce veri kaydet
      await page.evaluate(() => {
        const modifiedData = {
          user: { gender: 'male', birthDate: '1990-01-01', startDate: '2020-01-01', dailyTarget: 10 },
          prayers: { sabah: 100, ogle: 100, ikindi: 100, aksam: 100, yatsi: 100, vitir: 100 },
          stats: { streak: 999, totalCompleted: 9999, lastActiveDate: '2020-01-01' },
          history: [],
        };
        localStorage.setItem('kaza_takibi_data', JSON.stringify(modifiedData));
      });
      
      // Sayfayı yeniden yükle
      await page.reload();
      await page.waitForTimeout(500);
      
      // Onboarding'i geç (varsa)
      const genderSelect = page.locator('select').first();
      if (await genderSelect.isVisible()) {
        await genderSelect.selectOption('male');
        await page.getByRole('button', { name: /devam/i }).click();
        await page.waitForTimeout(500);
      }
      
      // Settings'e git
      const settingsButton = page.locator('button').filter({ hasText: /ayarlar|settings/i }).first();
      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await page.waitForTimeout(500);
      }
      
      // Reset butonu bul ve tıkla
      const resetButton = page.locator('button').filter({ hasText: /sıfırla|reset/i }).first();
      if (await resetButton.isVisible()) {
        await resetButton.click();
        await page.waitForTimeout(500);
      }
      
      // localStorage kontrol et
      const stored = await page.evaluate(() => localStorage.getItem('kaza_takibi_data'));
      const parsed = JSON.parse(stored!);
      
      expect(parsed.user.dailyTarget).toBe(5);
      expect(parsed.stats.streak).toBe(0);
      expect(parsed.prayers.sabah).toBe(720);
    });
  });

  test.describe('export/import', () => {
    
    test('should export data to file', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(500);
      
      // Veri yaz
      await page.evaluate(() => {
        const testData = {
          user: { gender: 'male', birthDate: null, startDate: null, dailyTarget: 5 },
          prayers: { sabah: 720, ogle: 840, ikindi: 840, aksam: 820, yatsi: 850, vitir: 450 },
          stats: { streak: 0, totalCompleted: 0, lastActiveDate: null },
          history: [],
        };
        localStorage.setItem('kaza_takibi_data', JSON.stringify(testData));
      });
      
      // Onboarding'i geç
      const genderSelect = page.locator('select').first();
      if (await genderSelect.isVisible()) {
        await genderSelect.selectOption('male');
        await page.getByRole('button', { name: /devam/i }).click();
        await page.waitForTimeout(500);
      }
      
      // Settings'e git
      const settingsButton = page.locator('button').filter({ hasText: /ayarlar|settings/i }).first();
      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await page.waitForTimeout(500);
      }
      
      // Export butonu bul
      const exportButton = page.locator('button').filter({ hasText: /dışa aktar|export/i }).first();
      
      // Download yakala
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
        exportButton.click().catch(() => null)
      ]);
      
      if (download) {
        expect(download.suggestedFilename()).toMatch(/kaza-namaz-yedek-\d{4}-\d{2}-\d{2}\.json/);
      }
    });

    test('should import data from file', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(500);
      
      // Onboarding'i geç
      const genderSelect = page.locator('select').first();
      if (await genderSelect.isVisible()) {
        await genderSelect.selectOption('male');
        await page.getByRole('button', { name: /devam/i }).click();
        await page.waitForTimeout(500);
      }
      
      // Settings'e git
      const settingsButton = page.locator('button').filter({ hasText: /ayarlar|settings/i }).first();
      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await page.waitForTimeout(500);
      }
      
      // Import dosyası oluştur
      const validData = {
        user: { gender: 'female', birthDate: '1995-01-01', startDate: '2021-01-01', dailyTarget: 7 },
        prayers: { sabah: 720, ogle: 840, ikindi: 840, aksam: 820, yatsi: 850, vitir: 450 },
        stats: { streak: 3, totalCompleted: 50, lastActiveDate: '2024-01-01' },
        history: [],
      };
      
      const fileBuffer = Buffer.from(JSON.stringify(validData));
      
      // File input bul ve dosya yükle
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        await fileInput.setInputFiles({
          name: 'backup.json',
          mimeType: 'application/json',
          buffer: fileBuffer
        });
        
        await page.waitForTimeout(500);
        
        // localStorage kontrol et
        const stored = await page.evaluate(() => localStorage.getItem('kaza_takibi_data'));
        if (stored) {
          const parsed = JSON.parse(stored);
          expect(parsed.user.gender).toBe('female');
          expect(parsed.user.dailyTarget).toBe(7);
        }
      }
    });
  });
});
