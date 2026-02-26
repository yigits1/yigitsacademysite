import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherCard from '../components/TeacherCard';
import './Courses.css';

const API = 'https://yigitsacademysite-production.up.railway.app/api';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/teachers`)
      .then(r => setTeachers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="courses-page">
      <div className="page-hero">
        <div className="container">
          <h1>Öğretmenlerimiz</h1>
          <p>Deneyimli ve sertifikalı eğitmenlerimizle tanışın</p>
        </div>
      </div>
      <div className="container section">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Yükleniyor...</p>
          </div>
        ) : teachers.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>Henüz öğretmen eklenmemiş.</p>
        ) : (
          <div className="grid-3">
            {teachers.map((t, i) => <TeacherCard key={t.id} teacher={t} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
