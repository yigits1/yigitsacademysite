import React from 'react';
import './Courses.css';
import './Blog.css';

const posts = [
  {
    id: 1,
    title: 'IELTS Sınavına Nasıl Hazırlanılır?',
    excerpt: 'IELTS sınavında başarılı olmak için izlemeniz gereken adım adım strateji rehberi.',
    date: '15 Ocak 2025',
    category: 'Sınav Hazırlığı',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
  },
  {
    id: 2,
    title: 'İş İngilizcesinde Sık Kullanılan 50 İfade',
    excerpt: 'Profesyonel iş hayatında etkili iletişim için mutlaka bilmeniz gereken İngilizce ifadeler.',
    date: '8 Şubat 2025',
    category: 'İş İngilizcesi',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
  },
  {
    id: 3,
    title: 'Çocuklara İngilizce Öğretmenin 5 Eğlenceli Yolu',
    excerpt: 'Oyun tabanlı yöntemlerle çocukların İngilizceyi sevmesini sağlayın.',
    date: '20 Mart 2025',
    category: 'Çocuk Eğitimi',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
  },
  {
    id: 4,
    title: 'Günlük Hayatta İngilizce Pratik Yapmanın Yolları',
    excerpt: 'Ders dışında da İngilizcenizi geliştirmek için uygulayabileceğiniz pratik yöntemler.',
    date: '5 Nisan 2025',
    category: 'Öğrenme İpuçları',
    img: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80',
  },
];

export default function Blog() {
  return (
    <div className="courses-page">
      <div className="page-hero">
        <div className="container">
          <h1>Blog</h1>
          <p>İngilizce öğrenme ipuçları, sınav stratejileri ve daha fazlası</p>
        </div>
      </div>
      <div className="container section">
        <div className="grid-2">
          {posts.map(p => (
            <div key={p.id} className="card blog-card">
              <div className="blog-img-wrap">
                <img src={p.img} alt={p.title} className="blog-img" />
                <span className="badge">{p.category}</span>
              </div>
              <div className="blog-body">
                <span className="blog-date">{p.date}</span>
                <h3 className="blog-title">{p.title}</h3>
                <p className="blog-excerpt">{p.excerpt}</p>
                <button className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Devamını Oku</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
