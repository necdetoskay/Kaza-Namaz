import { useState, type ChangeEvent, type FormEvent, useRef } from 'react';
import { Sparkles, Calculator, Calendar, User, Leaf, Upload, Settings } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { PrayerCounts, UserProfile } from '../types';
import { cn } from '../lib/utils';
import { DataService } from '../services/DataService';
import AdminDashboard from './AdminDashboard';

export default function OnboardingPage() {
  const { completeOnboarding } = useStore();
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL'de settings varsa ayarlara git
  const goToSettings = typeof window !== 'undefined' && window.location.search.includes('settings=true');

  if (goToSettings) {
    return <AdminDashboard />;
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    let val = e.target.value;
    val = val.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    
    if (val.length >= 5) {
      val = `${val.slice(0, 2)}.${val.slice(2, 4)}.${val.slice(4)}`;
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)}.${val.slice(2)}`;
    }
    setter(val);
  };

  const parseDate = (dateStr: string) => {
    const parts = dateStr.split('.');
    if (parts.length !== 3) return new Date('invalid');
    const [day, month, year] = parts;
    if (year.length !== 4) return new Date('invalid');
    return new Date(`${year}-${month}-${day}`);
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

    if (result.success) {
      // Reload the page to reflect restored data
      setTimeout(() => window.location.reload(), 1500);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => setImportMessage(null), 5000);
  };

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    if (!gender || !birthDate || !startDate) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    const birth = parseDate(birthDate);
    const start = parseDate(startDate);
    
    if (isNaN(birth.getTime()) || isNaN(start.getTime())) {
      alert('Lütfen geçerli bir tarih girin (Örn: 15.04.1995).');
      return;
    }
    
    // İslami ergenlik yaşı ortalamaları (Kadın: 12, Erkek: 15)
    const pubertyAge = gender === 'female' ? 12 : 15;
    const pubertyDate = new Date(birth);
    pubertyDate.setFullYear(pubertyDate.getFullYear() + pubertyAge);

    let diffDays = 0;
    // Eğer namaza başlama tarihi ergenlikten sonraysa aradaki farkı hesapla
    if (start > pubertyDate) {
      const diffTime = Math.abs(start.getTime() - pubertyDate.getTime());
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const calculatedPrayers: PrayerCounts = {
      sabah: diffDays,
      ogle: diffDays,
      ikindi: diffDays,
      aksam: diffDays,
      yatsi: diffDays,
      vitir: diffDays, // Hanefi mezhebine göre vitir de kaza edilir
    };

    const profile: UserProfile = {
      gender,
      birthDate: birth.toISOString(),
      startDate: start.toISOString(),
      dailyTarget: 5,
    };

    completeOnboarding(profile, calculatedPrayers);
  };

  return (
    <div className="min-h-[100dvh] bg-surface-container-low flex justify-center sm:py-4">
      <div className="w-full max-w-md bg-background sm:rounded-[2.5rem] sm:h-[calc(100dvh-2rem)] h-[100dvh] relative sm:shadow-2xl flex flex-col overflow-hidden sm:border border-outline-variant/10 selection:bg-primary-fixed-dim">
        {/* Background Abstract Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40" 
             style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(13, 99, 27, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(107, 79, 69, 0.05) 0%, transparent 40%)' }}>
        </div>

        <header className="w-full flex justify-center items-center px-6 h-20 bg-background/60 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary w-8 h-8" />
            <h1 className="font-headline font-extrabold text-2xl tracking-tighter text-primary">Kaza Takibi</h1>
          </div>
          <a
            href="/?settings=true"
            className="ml-auto p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <Settings className="w-6 h-6 text-tertiary" />
          </a>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-12 flex flex-col z-10 no-scrollbar">
          <section className="text-center mb-10 w-full animate-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed mb-6 shadow-sm">
              <Sparkles className="text-primary w-8 h-8" />
            </div>
            <h2 className="font-headline font-bold text-3xl text-on-background tracking-tight leading-tight mb-4 px-4">
              Manevi Yolculuğuna <br/> Hoş Geldin
            </h2>
            <p className="text-tertiary font-medium text-balance leading-relaxed">
              Eksik kalan namazlarını güvenle takip etmen ve telafi etmen için buradayız. Öncelikle senin için küçük bir hesaplama yapalım.
            </p>
          </section>

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

          <div className="w-full bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10 animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <form onSubmit={handleCalculate} className="space-y-8">
              
              {/* Gender Selection */}
              <div className="space-y-4">
                <label className="font-headline font-bold text-sm uppercase tracking-widest text-tertiary ml-1">Cinsiyet</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={cn(
                    "relative flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                    gender === 'male' ? "border-primary bg-primary/5" : "border-transparent bg-surface-container-low hover:bg-surface-container"
                  )}>
                    <input type="radio" name="gender" value="male" className="sr-only" onChange={() => setGender('male')} />
                    <div className="flex flex-col items-center gap-2">
                      <User className={cn("w-8 h-8", gender === 'male' ? "text-primary" : "text-on-surface-variant")} />
                      <span className="font-bold text-on-surface">Erkek</span>
                    </div>
                  </label>
                  
                  <label className={cn(
                    "relative flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                    gender === 'female' ? "border-primary bg-primary/5" : "border-transparent bg-surface-container-low hover:bg-surface-container"
                  )}>
                    <input type="radio" name="gender" value="female" className="sr-only" onChange={() => setGender('female')} />
                    <div className="flex flex-col items-center gap-2">
                      <User className={cn("w-8 h-8", gender === 'female' ? "text-primary" : "text-on-surface-variant")} />
                      <span className="font-bold text-on-surface">Kadın</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-3">
                <label className="font-headline font-bold text-sm uppercase tracking-widest text-tertiary ml-1">Doğum Tarihi</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Calendar className="text-primary w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    placeholder="GG.AA.YYYY"
                    required
                    value={birthDate}
                    onChange={(e) => handleDateChange(e, setBirthDate)}
                    className="w-full bg-surface-container-low h-14 pl-12 pr-4 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-semibold placeholder:text-outline transition-all" 
                  />
                </div>
              </div>

              {/* Prayer Start Date */}
              <div className="space-y-3">
                <label className="font-headline font-bold text-sm uppercase tracking-widest text-tertiary ml-1">Namaza Başlama Tarihi</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Calendar className="text-primary w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    placeholder="GG.AA.YYYY"
                    required
                    value={startDate}
                    onChange={(e) => handleDateChange(e, setStartDate)}
                    className="w-full bg-surface-container-low h-14 pl-12 pr-4 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-semibold placeholder:text-outline transition-all" 
                  />
                </div>
                <p className="text-[10px] text-tertiary/80 ml-1 italic">* Ergenlik sonrası eksik namazlarınızı hesaplamak için gereklidir.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-headline font-bold text-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Borcumu Hesapla
                  <Calculator className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>

          <footer className="mt-8 text-center relative z-10 px-8 animate-in fade-in duration-1000 delay-300">
            {/* Geri Yukle button */}
            <button
              onClick={handleImportClick}
              className="w-full mb-6 h-12 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 border border-outline-variant/20"
            >
              <Upload className="w-5 h-5" />
              <span>Yedeğimi Geri Yükle</span>
            </button>

            <p className="text-tertiary/60 text-xs font-medium leading-relaxed">
              Tüm verileriniz yerel olarak cihazınızda saklanır ve gizliliğiniz bizim için her şeyden önemlidir.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
