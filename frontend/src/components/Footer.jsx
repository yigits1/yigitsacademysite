import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Footer.css';

const API = 'https://yigitsacademysite-production.up.railway.app/api';

export default function Footer() {
  const [s, setS] = useState({
    footerDesc: 'Profesyonel İngilizce eğitimi ile kariyerinizi ve hayatınızı değiştirin. Her seviyeye uygun kurslarımızla öğrenmeye başlayın.',
    footerEmail: 'info@yigitsakademi.com',
    footerPhone: '+90 555 123 45 67',
    footerAddress: 'İstanbul, Türkiye',
  });

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setS(r.data)).catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">YA</span>
            <span><strong>Yiğit's</strong> Akademi</span>
          </div>
          <p className="footer-desc">{s.footerDesc}</p>
          <div className="footer-social">
            <a href="#" className="social-btn" aria-label="Facebook">f</a>
            <a href="#" className="social-btn" aria-label="Instagram">in</a>
            <a href="#" className="social-btn" aria-label="Twitter">t</a>
            <a href="#" className="social-btn" aria-label="YouTube">yt</a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Hızlı Bağlantılar</h4>
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/courses">Kurslar</Link></li>
            <li><Link to="/teachers">Öğretmenler</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Kurslar</h4>
          <ul>
            <li><Link to="/courses">Genel İngilizce</Link></li>
            <li><Link to="/courses">İş İngilizcesi</Link></li>
            <li><Link to="/courses">IELTS / TOEFL</Link></li>
            <li><Link to="/courses">Çocuk İngilizcesi</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>İletişim</h4>
          <ul>
            <li>{s.footerEmail}</li>
            <li>{s.footerPhone}</li>
            <li>{s.footerAddress}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Yiğit's Akademi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
