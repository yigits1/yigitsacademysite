import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import './Courses.css';

const API = https://yigitsacademysite-production.up.railway.app/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [detailCourse, setDetailCourse] = useState(null);

  useEffect(() => {
    axios.get(`${API}/courses`)
      .then(r => setCourses(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="courses-page">
      <div className="page-hero">
        <div className="container">
          <h1>Kurslarımız</h1>
          <p>Her seviye ve hedefe uygun İngilizce programları</p>
        </div>
      </div>
      <div className="container section">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Kurslar yükleniyor...</p>
          </div>
        ) : courses.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>Henüz kurs bulunmuyor.</p>
        ) : (
          <div className="grid-3">
            {courses.map(c => <CourseCard key={c.id} course={c} onDetail={course => { setDetailCourse(course); setShowDetail(true); }} />)}
          </div>
        )}
      </div>
      {showDetail && detailCourse && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowDetail(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{detailCourse.name}</h3>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Açıklama:</strong> {detailCourse.longDesc || detailCourse.description}</p>
              {detailCourse.requirements && <p><strong>Gereksinimler:</strong> {detailCourse.requirements}</p>}
              {detailCourse.features && (
                <><strong>Özellikler:</strong>
                <ul>{detailCourse.features.map((f,i)=><li key={i}>{f}</li>)}</ul></>
              )}
              {detailCourse.duration && <p><strong>Süre:</strong> {detailCourse.duration}</p>}
              {detailCourse.sessions && <p><strong>Seans:</strong> {detailCourse.sessions}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
