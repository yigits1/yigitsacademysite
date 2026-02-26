import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import TeacherCard from '../components/TeacherCard';
import './Home.css';

const API = 'http://localhost:5000/api';

const COURSE_IMAGES = {
  general: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80',
  business: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
  ielts: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
  kids: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
};

export { COURSE_IMAGES, API };

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
};

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [levelScore, setLevelScore] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = [
    { q: 'What ___ your name?', opts: ['is', 'are', 'be', 'am'], correct: 0 },
    { q: 'She ___ to school every day.', opts: ['go', 'goes', 'going', 'gone'], correct: 1 },
    { q: 'I have been studying English ___ five years.', opts: ['since', 'for', 'during', 'from'], correct: 1 },
    { q: 'By the time she arrived, we ___ dinner.', opts: ['had finished', 'finished', 'finish', 'have finished'], correct: 0 },
    { q: 'The report ___ be submitted by Friday.', opts: ['should', 'must', 'can', 'might'], correct: 1 },
  ];

  useEffect(() => {
    axios.get(`${API}/courses`).then(r => setCourses(r.data.slice(0, 4))).catch(() => {});
    axios.get(`${API}/teachers`).then(r => setTeachers(r.data.slice(0, 3))).catch(() => {});
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const handleAnswer = (idx) => {
    const newAnswers = [...answers, idx];
    if (currentQ + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
    } else {
      const score = newAnswers.filter((a, i) => a === questions[i].correct).length;
      setLevelScore(Math.round((score / questions.length) * 100));
    }
  };

  const levelLabel = levelScore === null ? '' :
    levelScore < 40 ? 'A1-A2 (Başlangıç)' :
    levelScore < 70 ? 'B1-B2 (Orta)' : 'C1-C2 (İleri)';

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">{settings.heroBadge}</span>
            <h1>{settings.heroTitle}<br /><span className="hero-highlight">{settings.heroHighlight}</span></h1>
            <p className="hero-sub">{settings.heroSubtitle}</p>
            <div className="hero-actions">
              <Link to="/courses">
                <button className="btn btn-orange btn-lg">Hemen Başla</button>
              </Link>
              <button className="btn btn-outline-white btn-lg" onClick={() => { setShowLevelModal(true); setCurrentQ(0); setAnswers([]); setLevelScore(null); }}>
                Seviye Testini Çöz
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>{settings.stat1Value}</strong><span>{settings.stat1Label}</span></div>
              <div className="stat"><strong>{settings.stat2Value}</strong><span>{settings.stat2Label}</span></div>
              <div className="stat"><strong>{settings.stat3Value}</strong><span>{settings.stat3Label}</span></div>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80" alt="Öğrenciler" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '🎓', title: 'Sertifikalı Eğitmenler', desc: 'Cambridge ve CELTA sertifikalı, deneyimli öğretmenler.' },
              { icon: '📱', title: 'Online & Yüz Yüze', desc: 'Dilediğiniz yerden, dilediğiniz zamanda öğrenin.' },
              { icon: '📊', title: 'Kişisel Gelişim', desc: 'İlerlemenizi takip edin, hedeflerinize ulaşın.' },
              { icon: '🏆', title: 'Uluslararası Sınavlar', desc: 'IELTS, TOEFL ve Cambridge hazırlık programları.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="section bg-gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popüler Kurslarımız</h2>
            <p className="section-sub">Her seviye ve hedefe uygun programlarla İngilizcenizi geliştirin.</p>
          </div>
          <div className="grid-3">
            {courses.map(c => <CourseCard key={c.id} course={c} image={COURSE_IMAGES[c.image] || COURSE_IMAGES.general} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/courses"><button className="btn btn-primary">Tüm Kursları Gör</button></Link>
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      {teachers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Öğretmenlerimiz</h2>
              <p className="section-sub">Alanında uzman, deneyimli eğitmenlerimizle tanışın.</p>
            </div>
            <div className="grid-3">
              {teachers.map((t, i) => <TeacherCard key={t.id} teacher={t} index={i} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <Link to="/teachers"><button className="btn btn-outline">Tüm Öğretmenleri Gör</button></Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>{settings.ctaTitle}</h2>
          <p>{settings.ctaSubtitle}</p>
          <Link to="/login"><button className="btn btn-orange btn-lg">Ücretsiz Kayıt Ol</button></Link>
        </div>
      </section>

      {/* LEVEL TEST MODAL */}
      {showLevelModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLevelModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Seviye Testi</h3>
              <button className="modal-close" onClick={() => setShowLevelModal(false)}>×</button>
            </div>
            {levelScore === null ? (
              <>
                <p style={{ marginBottom: 16, color: 'var(--gray-600)', fontSize: 14 }}>
                  Soru {currentQ + 1} / {questions.length}
                </p>
                <div className="progress-bar-wrap" style={{ marginBottom: 24 }}>
                  <div className="progress-bar" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
                </div>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 20 }}>{questions[currentQ].q}</p>
                <div className="level-options">
                  {questions[currentQ].opts.map((o, i) => (
                    <button key={i} className="level-option" onClick={() => handleAnswer(i)}>{o}</button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div className="score-circle">{levelScore}%</div>
                <h4 style={{ margin: '16px 0 8px', fontSize: '1.2rem' }}>Seviyeniz: {levelLabel}</h4>
                <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>
                  Size uygun kurslar için aşağıya göz atabilirsiniz.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/courses"><button className="btn btn-primary" onClick={() => setShowLevelModal(false)}>Kursları İncele</button></Link>
                  <button className="btn btn-outline" onClick={() => { setCurrentQ(0); setAnswers([]); setLevelScore(null); }}>Tekrar Çöz</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
