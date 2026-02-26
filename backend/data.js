const { v4: uuidv4 } = require('uuid');

const admins = [
  { id: 'admin-1', username: 'YSever', password: '213130', name: 'Yönetici' }
];

const courses = [
  {
    id: 'c1',
    name: 'Genel İngilizce',
    description: 'Temel konuşma ve yazma becerilerini geliştirmek isteyen herkes için kapsamlı bir program.',
    level: 'A1-B2',
    image: 'general',
    duration: '6 Ay',
    sessions: '3 Gün/Hafta',
    instructorId: null
  },
  {
    id: 'c2',
    name: 'İş İngilizcesi',
    description: 'Profesyonel iş ortamında etkili iletişim kurmak için gerekli dil becerilerini kazandırır.',
    level: 'B1-C1',
    image: 'business',
    duration: '4 Ay',
    sessions: '2 Gün/Hafta',
    instructorId: null
  },
  {
    id: 'c3',
    name: 'IELTS / TOEFL Hazırlık',
    description: 'Uluslararası sınav sınavlarına yönelik yoğun pratik ve strateji geliştirme programı.',
    level: 'B2-C2',
    image: 'ielts',
    duration: '3 Ay',
    sessions: '5 Gün/Hafta',
    instructorId: null
  },
  {
    id: 'c4',
    name: 'Çocuk İngilizcesi',
    description: 'Oyun tabanlı öğrenme yöntemleriyle çocuklara eğlenceli ve etkili İngilizce eğitimi.',
    level: 'Başlangıç',
    image: 'kids',
    duration: '8 Ay',
    sessions: '2 Gün/Hafta',
    instructorId: null
  }
];

const teachers = [];
const students = [];

const attendance = [];
const grades = [];
const lessonTopics = [];
const announcements = [];
const messages = [];

const siteSettings = {
  heroTitle: 'İngilizceyi',
  heroHighlight: 'Konuşarak Öğren!',
  heroSubtitle: 'Uzman eğitmenler, esnek programlar ve kanıtlanmış yöntemlerle İngilizcenizi bir üst seviyeye taşıyın.',
  heroBadge: "Türkiye'nin En İyi İngilizce Akademisi",
  stat1Value: '2,500+',
  stat1Label: 'Mezun Öğrenci',
  stat2Value: '15+',
  stat2Label: 'Uzman Öğretmen',
  stat3Value: '8',
  stat3Label: 'Yıllık Deneyim',
  ctaTitle: 'Öğrenmeye Bugün Başlayın',
  ctaSubtitle: 'Binlerce öğrencimizin başarı hikayesine siz de katılın.',
  footerEmail: 'info@yigitsakademi.com',
  footerPhone: '+90 555 123 45 67',
  footerAddress: 'İstanbul, Türkiye',
  footerDesc: 'Profesyonel İngilizce eğitimi ile kariyerinizi ve hayatınızı değiştirin. Her seviyeye uygun kurslarımızla öğrenmeye başlayın.',
};

module.exports = {
  admins,
  courses,
  teachers,
  students,
  attendance,
  grades,
  lessonTopics,
  announcements,
  messages,
  siteSettings,
  uuidv4
};
