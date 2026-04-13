import { useState } from 'react';
import { Search, Sparkles, Gavel, BookOpen, Droplets, UserRound, Plane, ChevronRight, Edit3, AlertCircle, Car, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function LibraryView() {
  const [activeArticle, setActiveArticle] = useState<{title: string, content: React.ReactNode} | null>(null);

  const articles = {
    niyet: {
      title: "5 Vakit Kaza Niyeti",
      content: "Kaza namazlarına niyet ederken 'Niyet ettim Allah rızası için üzerimde olan ve henüz kılmadığım ilk sabah/öğle/ikindi/akşam/yatsı namazının farzını kılmaya' şeklinde niyet edilebilir. Hanefi mezhebine göre kaza namazlarında vakit belirtmek şart değildir, 'üzerimdeki ilk kaza namazına' demek yeterlidir."
    },
    hukum: {
      title: "Unutulan Namaz Hükmü",
      content: "Bir namazı unutarak veya uyuyakalarak vaktinde kılamayan kimse, hatırladığı veya uyandığı zaman o namazı kaza etmelidir. Hz. Peygamber (s.a.s.) 'Kim bir namazı unutur veya uyuyakalırsa, hatırladığında onu kılsın. Onun kefareti ancak budur.' buyurmuştur."
    },
    seferilik: {
      title: "Seferilikte Kaza Hesaplama",
      content: "Seferi (yolcu) iken kazaya kalan 4 rekatlı farz namazlar, mukim (yerleşik) olunduğunda da 2 rekat olarak kaza edilir. Aynı şekilde mukim iken kazaya kalan 4 rekatlı namazlar, seferi iken kaza edilmek istendiğinde 4 rekat olarak kılınır. Yani namaz ne zaman kazaya kaldıysa o anki duruma göre kaza edilir."
    }
  };

  const categories = {
    hukumler: {
      title: "Hükümler",
      content: "Kaza namazlarının fıkhi hükümleri, farziyeti ve kılınış şekilleri hakkında genel kurallar. Vaktinde kılınamayan her farz namazın ve vacip olan vitir namazının kazası farz/vaciptir."
    },
    farzlar: {
      title: "Namazın Farzları",
      content: (
        <div className="space-y-4">
          <p>Namazın farzları 12'dir. Bunların 6'sı dışında (şartları), 6'sı içindedir (rükünleri).</p>
          
          <div>
            <h4 className="font-bold text-on-surface mb-1">Dışındaki Farzlar (Şartları)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hadesten Taharet:</strong> Abdest veya boy abdesti almak.</li>
              <li><strong>Necasetten Taharet:</strong> Bedenin, elbisenin ve namaz kılınacak yerin temiz olması.</li>
              <li><strong>Setr-i Avret:</strong> Örtülmesi gereken yerleri örtmek.</li>
              <li><strong>İstikbal-i Kıble:</strong> Namaz kılarken kıbleye (Kâbe'ye) yönelmek.</li>
              <li><strong>Vakit:</strong> Kılınacak namazın vaktinin girmiş olması (Kaza namazlarında sadece kerahet vaktinde olmamak şartı aranır).</li>
              <li><strong>Niyet:</strong> Hangi namazı kıldığını bilmek ve kalben niyet etmek.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-on-surface mb-1">İçindeki Farzlar (Rükünleri)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>İftitah Tekbiri:</strong> Namaza "Allahu Ekber" diyerek başlamak.</li>
              <li><strong>Kıyam:</strong> Namazda ayakta durmak.</li>
              <li><strong>Kıraat:</strong> Namazda Kur'an'dan bir miktar okumak.</li>
              <li><strong>Rükû:</strong> Elleri dizlere koyarak eğilmek.</li>
              <li><strong>Secde:</strong> Alın, burun, eller, dizler ve ayakları yere koymak.</li>
              <li><strong>Kade-i Ahîre:</strong> Namazın sonunda "Ettehiyyatü" duasını okuyacak kadar oturmak.</li>
            </ul>
          </div>
        </div>
      )
    },
    abdest: {
      title: "Abdestin Farzları",
      content: (
        <div className="space-y-4">
          <p>Hanefi mezhebine göre abdestin farzları 4'tür. Bunlardan biri bile eksik olursa abdest geçersiz olur:</p>
          <ul className="list-decimal pl-5 space-y-2">
            <li><strong>Yüzü yıkamak:</strong> Saç bitiminden çene altına ve kulak yumuşaklarına kadar yüzün tamamını bir kere yıkamak.</li>
            <li><strong>Elleri yıkamak:</strong> Elleri, dirseklerle beraber (dirsekler dahil) bir kere yıkamak.</li>
            <li><strong>Başı mesh etmek:</strong> Başın dörtte birini ıslak elle silmek (mesh etmek).</li>
            <li><strong>Ayakları yıkamak:</strong> Ayakları, topuk kemikleriyle beraber (topuklar dahil) bir kere yıkamak.</li>
          </ul>
          <p className="text-xs text-outline italic mt-2">* Şafii mezhebinde bunlara ek olarak "Niyet etmek" ve "Tertip (sıraya uymak)" de farzdır.</p>
        </div>
      )
    },
    kadin: {
      title: "Kadınlara Özel Haller",
      content: "Kadınların özel hallerinde (hayız ve nifas) kılmadıkları namazlar kazaya kalmaz, bu namazlardan muaf tutulurlar. Bu günlere ait namazların kazası gerekmez."
    },
    seferilik: {
      title: "Seferilik (Yolculuk)",
      content: "Seferi iken kazaya kalan 4 rekatlık farzlar 2 rekat, mukim iken kazaya kalanlar seferi iken kılındığında 4 rekat olarak kaza edilir. İtibar namazın kazaya kaldığı vakte göredir."
    },
    farz32: {
      title: "32 Farz",
      content: (
        <div className="space-y-4">
          <p className="font-medium text-sm">İslam dininin temel esaslarını özetleyen 32 farz şunlardır:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <h4 className="font-bold text-primary mb-2 border-b border-outline-variant/10 pb-1">İmanın Şartları (6)</h4>
              <ol className="list-decimal pl-4 space-y-1 text-sm">
                <li>Allah'ın varlığına ve birliğine inanmak</li>
                <li>Meleklere inanmak</li>
                <li>Kitaplara inanmak</li>
                <li>Peygamberlere inanmak</li>
                <li>Ahiret gününe inanmak</li>
                <li>Kadere inanmak</li>
              </ol>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <h4 className="font-bold text-secondary mb-2 border-b border-outline-variant/10 pb-1">İslam'ın Şartları (5)</h4>
              <ol className="list-decimal pl-4 space-y-1 text-sm">
                <li>Kelime-i Şehadet getirmek</li>
                <li>Namaz kılmak</li>
                <li>Oruç tutmak</li>
                <li>Zekat vermek</li>
                <li>Hacca gitmek</li>
              </ol>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <h4 className="font-bold text-tertiary mb-2 border-b border-outline-variant/10 pb-1">Namazın Farzları (12)</h4>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li><strong>Dışındakiler:</strong> Hadesten taharet, Necasetten taharet, Setr-i avret, İstikbal-i kıble, Vakit, Niyet</li>
                <li><strong>İçindekiler:</strong> İftitah tekbiri, Kıyam, Kıraat, Rükû, Secde, Kade-i ahîre</li>
              </ul>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <h4 className="font-bold text-on-surface mb-2 border-b border-outline-variant/10 pb-1">Temizlik Farzları (9)</h4>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li><strong>Abdestin (4):</strong> Yüz, Eller, Baş, Ayaklar</li>
                <li><strong>Guslün (3):</strong> Ağız, Burun, Bütün vücut</li>
                <li><strong>Teyemmümün (2):</strong> Niyet, İki darp ve mesh</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    farz54: {
      title: "54 Farz",
      content: (
        <div className="space-y-4">
          <p className="font-medium text-sm">Müslümanların dikkat etmesi gereken temel 54 farzın öne çıkanları:</p>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 max-h-64 overflow-y-auto custom-scrollbar">
            <ul className="list-decimal pl-5 space-y-1 text-sm">
              <li>Allah'ı bir bilip zikretmek</li>
              <li>Helalinden yiyip içmek</li>
              <li>Abdest almak</li>
              <li>Beş vakit namaz kılmak</li>
              <li>Cünüplükten gusül abdesti almak</li>
              <li>Rızkın Allah'tan olduğuna inanmak</li>
              <li>Helal ve temiz elbise giymek</li>
              <li>Hakk'a tevekkül etmek</li>
              <li>Kanaat etmek</li>
              <li>Nimetlerine şükretmek</li>
              <li>Kazaya (Allah'ın hükmüne) razı olmak</li>
              <li>Belalara sabretmek</li>
              <li>Günahlara tövbe etmek</li>
              <li>İhlaslı olmak</li>
              <li>İslam düşmanlarını düşman bilmek</li>
              <li>Kur'an'ı rehber edinmek</li>
              <li>Ölüme hazırlıklı olmak</li>
              <li>İyiliği emredip kötülükten sakındırmak</li>
              <li>Gıybet etmemek</li>
              <li>Ana babaya iyilik etmek</li>
              <li>Akrabayı ziyaret etmek</li>
              <li>Emanete hıyanet etmemek</li>
              <li>Dini sınırları muhafaza etmek</li>
              <li>Zekat vermek</li>
              <li>Günahları terk etmek</li>
            </ul>
          </div>
        </div>
      )
    },
    kisaSureler: {
      title: "Kaza İçin Kısa Sureler",
      content: (
        <div className="space-y-4">
          <p className="font-medium text-sm">Kaza namazlarını daha hızlı kılabilmek için Fatiha'dan sonra Kur'an'ın en kısa surelerini okuyabilirsiniz. Bir rekatta zamm-ı sure olarak en az 3 kısa ayet okumak farzdır.</p>
          <div className="space-y-3">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-primary">1. Kevser Suresi</h4>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">En Kısa (3 Ayet)</span>
              </div>
              <p className="text-sm italic text-on-surface-variant mb-1">"İnnâ a'taynâkel kevser. Fesalli lirabbike venhar. İnnê şâni-eke hüvel'ebter."</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-secondary">2. İhlas Suresi</h4>
                <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-full">4 Ayet</span>
              </div>
              <p className="text-sm italic text-on-surface-variant mb-1">"Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad."</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-tertiary">3. Asr Suresi</h4>
                <span className="text-xs font-bold bg-tertiary/10 text-tertiary px-2 py-1 rounded-full">3 Ayet</span>
              </div>
              <p className="text-sm italic text-on-surface-variant mb-1">"Vel'asr. İnnel'insâne lefî husr. İllâllezîne âmenû ve amilûssâlihâti ve tevâsav bilhakki ve tevâsav bissabr."</p>
            </div>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 flex gap-2 items-start mt-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface font-medium">
              <strong>Pratik İpucu:</strong> Kaza namazı kılarken her rekatta aynı kısa sureyi (örneğin hep Kevser Suresi'ni) okumak caizdir. Kaza borcunu hızlıca eritmek için bu pratik yöntem kullanılabilir.
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
        <input 
          className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface placeholder-outline/70 transition-all text-sm" 
          placeholder="Hızlı referans ara (örn. Abdest, Farzlar)..." 
          type="text"
        />
      </div>

      <section>
        <div className="bg-surface-container-lowest border-l-4 border-secondary rounded-r-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-secondary w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-secondary">Günün Ayeti</span>
          </div>
          <p className="text-sm font-medium leading-tight text-on-surface mb-1">
            "Sabrederek ve namaz kılarak (Allah’tan) yardım dileyin. Şüphesiz namaz, Allah’a saygı duyanlardan başkasına ağır gelir."
          </p>
          <span className="text-[11px] font-bold text-outline uppercase tracking-tighter">Bakara, 45</span>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-outline">Hızlı Kategoriler</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setActiveArticle(categories.hukumler)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-xs font-bold whitespace-nowrap shadow-sm shadow-primary/20 active:scale-95 transition-transform"
          >
            <Gavel className="w-4 h-4" /> Hükümler
          </button>
          <button 
            onClick={() => setActiveArticle(categories.farzlar)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform"
          >
            <BookOpen className="w-4 h-4" /> Farzlar
          </button>
          <button 
            onClick={() => setActiveArticle(categories.abdest)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform"
          >
            <Droplets className="w-4 h-4" /> Abdest
          </button>
          <button 
            onClick={() => setActiveArticle(categories.kadin)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform"
          >
            <UserRound className="w-4 h-4" /> Kadın
          </button>
          <button 
            onClick={() => setActiveArticle(categories.seferilik)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform"
          >
            <Plane className="w-4 h-4" /> Seferilik
          </button>
          <button 
            onClick={() => setActiveArticle(categories.farz32)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform"
          >
            <BookOpen className="w-4 h-4" /> 32 Farz
          </button>
          <button 
            onClick={() => setActiveArticle(categories.farz54)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform"
          >
            <BookOpen className="w-4 h-4" /> 54 Farz
          </button>
          <button 
            onClick={() => setActiveArticle(categories.kisaSureler)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-on-primary-container border border-primary/30 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Kısa Sureler
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-outline">Akademik Kaynaklar</h2>
        
        <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden" open>
          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low transition-colors list-none">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              <span className="font-bold text-sm">Fıkıh ve Niyet Esasları</span>
            </div>
          </summary>
          <div className="px-4 pb-4 space-y-3 border-t border-outline-variant/10 pt-3">
            <div 
              onClick={() => setActiveArticle(articles.niyet)}
              className="flex items-center gap-4 py-2 cursor-pointer border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low rounded-lg px-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Edit3 className="text-primary w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-on-surface leading-tight truncate">5 Vakit Kaza Niyeti</h4>
                <p className="text-[11px] text-outline font-medium">4 dk • Hanefi/Şafii</p>
              </div>
              <ChevronRight className="text-outline/40 w-5 h-5" />
            </div>
            <div 
              onClick={() => setActiveArticle(articles.hukum)}
              className="flex items-center gap-4 py-2 cursor-pointer border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low rounded-lg px-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <AlertCircle className="text-primary w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-on-surface leading-tight truncate">Unutulan Namaz Hükmü</h4>
                <p className="text-[11px] text-outline font-medium">3 dk • Genel Bilgi</p>
              </div>
              <ChevronRight className="text-outline/40 w-5 h-5" />
            </div>
          </div>
        </details>

        <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low transition-colors list-none">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
              <span className="font-bold text-sm">Yolculuk ve İstisnai Durumlar</span>
            </div>
          </summary>
          <div className="px-4 pb-4 space-y-3 border-t border-outline-variant/10 pt-3">
            <div 
              onClick={() => setActiveArticle(articles.seferilik)}
              className="flex items-center gap-4 py-2 cursor-pointer hover:bg-surface-container-low rounded-lg px-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                <Car className="text-secondary w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-on-surface leading-tight truncate">Seferilikte Kaza Hesaplama</h4>
                <p className="text-[11px] text-outline font-medium">6 dk • Seferilik</p>
              </div>
              <ChevronRight className="text-outline/40 w-5 h-5" />
            </div>
          </div>
        </details>
      </section>

      {/* Article Modal */}
      <AnimatePresence>
        {activeArticle && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-6 z-50 shadow-2xl border border-outline-variant/20"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline font-bold text-xl text-on-surface pr-8">{activeArticle.title}</h3>
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="p-2 bg-surface-container-low hover:bg-surface-container-high rounded-full transition-colors absolute right-4 top-4"
                >
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <div className="prose prose-sm text-on-surface-variant leading-relaxed">
                <p>{activeArticle.content}</p>
              </div>
              <button 
                onClick={() => setActiveArticle(null)}
                className="w-full mt-6 bg-primary text-on-primary font-bold py-3.5 rounded-2xl active:scale-95 transition-transform"
              >
                Anladım
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
