const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_DIR = path.join(__dirname, 'db');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);

const DEFAULT_COURSES = [
  { id: 'c1', name: 'Genel İngilizce', description: 'Temel konuşma ve yazma becerilerini geliştirmek isteyen herkes için kapsamlı bir program.', level: 'A1-B2', image: 'general', duration: '6 Ay', sessions: '3 Gün/Hafta', instructorId: null, longDesc: 'Bu kurs, temel İngilizce bilgisinden orta-ileri seviyeye uzanan kapsamlı bir öğrenme yolculuğu sunar. Günlük konuşma, yazma, okuma ve dinleme becerilerini geliştirmeye yönelik aktiviteler içerir.', requirements: 'Ön koşul gerektirmez.', features: ['Küçük grup dersleri', 'Native speaker practice', 'Online materyal erişimi', 'Sertifika'] },
  { id: 'c2', name: 'İş İngilizcesi', description: 'Profesyonel iş ortamında etkili iletişim kurmak için gerekli dil becerilerini kazandırır.', level: 'B1-C1', image: 'business', duration: '4 Ay', sessions: '2 Gün/Hafta', instructorId: null, longDesc: 'İş görüşmeleri, sunum yapma, e-posta yazma ve toplantı yönetimi konularında İngilizce yetkinlik kazandırır.', requirements: 'B1 seviyesi veya üzeri İngilizce bilgisi.', features: ['Business case studies', 'Presentation skills', 'Email & report writing', 'Mock interviews'] },
  { id: 'c3', name: 'IELTS / TOEFL Hazırlık', description: 'Uluslararası sınav sınavlarına yönelik yoğun pratik ve strateji geliştirme programı.', level: 'B2-C2', image: 'ielts', duration: '3 Ay', sessions: '5 Gün/Hafta', instructorId: null, longDesc: 'IELTS ve TOEFL sınavlarının tüm bölümleri (Listening, Reading, Writing, Speaking) için yoğun hazırlık ve deneme sınavları.', requirements: 'B2 seviyesi İngilizce bilgisi.', features: ['Mock sınavlar', 'Band score garantisi', 'Bireysel feedback', '7+ IELTS hedefi'] },
  { id: 'c4', name: 'Çocuk İngilizcesi', description: 'Oyun tabanlı öğrenme yöntemleriyle çocuklara eğlenceli ve etkili İngilizce eğitimi.', level: 'Başlangıç', image: 'kids', duration: '8 Ay', sessions: '2 Gün/Hafta', instructorId: null, longDesc: 'Çocukların doğal öğrenme süreçlerine uygun, oyun ve aktivite tabanlı eğlenceli İngilizce dersleri.', requirements: '6-14 yaş arası çocuklar.', features: ['Oyun tabanlı öğrenme', 'Animasyonlu materyaller', 'Ebeveyn ilerleme raporu', 'Sertifika'] },
];

const DEFAULT_SETTINGS = {
  heroTitle: 'İngilizceyi',
  heroHighlight: 'Konuşarak Öğren!',
  heroSubtitle: 'Uzman eğitmenler, esnek programlar ve kanıtlanmış yöntemlerle İngilizcenizi bir üst seviyeye taşıyın.',
  heroBadge: "Türkiye'nin En İyi İngilizce Akademisi",
  stat1Value: '2,500+', stat1Label: 'Mezun Öğrenci',
  stat2Value: '15+', stat2Label: 'Uzman Öğretmen',
  stat3Value: '8', stat3Label: 'Yıllık Deneyim',
  ctaTitle: 'Öğrenmeye Bugün Başlayın',
  ctaSubtitle: 'Binlerce öğrencimizin başarı hikayesine siz de katılın.',
  footerEmail: 'info@yigitsakademi.com',
  footerPhone: '+90 555 123 45 67',
  footerAddress: 'İstanbul, Türkiye',
  footerDesc: 'Profesyonel İngilizce eğitimi ile kariyerinizi ve hayatınızı değiştirin.',
  feature1Icon: '🎓', feature1Title: 'Sertifikalı Eğitmenler', feature1Desc: 'Cambridge ve CELTA sertifikalı, deneyimli öğretmenler.',
  feature2Icon: '📱', feature2Title: 'Online & Yüz Yüze', feature2Desc: 'Dilediğiniz yerden, dilediğiniz zamanda öğrenin.',
  feature3Icon: '📊', feature3Title: 'Kişisel Gelişim', feature3Desc: 'İlerlemenizi takip edin, hedeflerinize ulaşın.',
  feature4Icon: '🏆', feature4Title: 'Uluslararası Sınavlar', feature4Desc: 'IELTS, TOEFL ve Cambridge hazırlık programları.',
  aboutTitle: 'Hakkımızda',
  aboutText: 'Yiğits Akademi, 2016 yılından bu yana İstanbul\'da kaliteli İngilizce eğitimi sunmaktadır. Uzman kadrosu ve kanıtlanmış yöntemleriyle binlerce öğrencinin hayatını değiştirmiştir.',
  socialFacebook: '#', socialInstagram: '#', socialTwitter: '#', socialYoutube: '#',
  siteTitle: "Yiğit's Akademi",
  primaryColor: '#007BFF',
  accentColor: '#FF6B00',
};

function loadFile(name, defaultValue) {
  const filePath = path.join(DB_DIR, `${name}.json`);
  if (fs.existsSync(filePath)) {
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return defaultValue; }
  }
  return defaultValue;
}

function saveFile(name, data) {
  const filePath = path.join(DB_DIR, `${name}.json`);
  try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); } catch (e) { console.error('Save error:', e.message); }
}

const store = {
  admins:       loadFile('admins',       [{ id: 'admin-1', username: 'YSever', password: '213130', name: 'Yönetici' }]),
  courses:      loadFile('courses',      DEFAULT_COURSES),
  teachers:     loadFile('teachers',     []),
  students:     loadFile('students',     []),
  attendance:   loadFile('attendance',   []),
  grades:       loadFile('grades',       []),
  lessonTopics: loadFile('lessonTopics', []),
  announcements:loadFile('announcements',[]),
  messages:     loadFile('messages',     []),
  applications: loadFile('applications', []),
  classes:      loadFile('classes',      []),
  siteSettings: loadFile('settings',     DEFAULT_SETTINGS),

  save(name) {
    const key = name === 'settings' ? 'siteSettings' : name;
    saveFile(name, this[key]);
  },
  uuidv4,
};

// Merge any new default settings keys that don't exist yet
Object.keys(DEFAULT_SETTINGS).forEach(k => {
  if (store.siteSettings[k] === undefined) store.siteSettings[k] = DEFAULT_SETTINGS[k];
});
store.save('settings');

module.exports = store;
