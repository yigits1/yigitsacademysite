import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const COURSE_IMAGES = {
  general: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80',
  business: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
  ielts: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
  kids: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
};

export default function CourseCard({ course, onDetail }) {
  const imgSrc = COURSE_IMAGES[course.image] || COURSE_IMAGES.general;
  return (
    <div className="card course-card">
      <div className="course-img-wrap">
        <img src={imgSrc} alt={course.name} className="course-img" />
        <span className="badge course-level">{course.level}</span>
      </div>
      <div className="course-body">
        <h3 className="course-name">{course.name}</h3>
        <p className="course-desc">{course.description}</p>
        <div className="course-meta">
          {course.duration && <span className="course-meta-item">📅 {course.duration}</span>}
          {course.sessions && <span className="course-meta-item">🕐 {course.sessions}</span>}
        </div>
        <button
          className="btn btn-primary btn-sm"
          style={{ marginTop: 14, width: '100%' }}
          onClick={() => onDetail && onDetail(course)}
        >
          Detaylı Bilgi
        </button>
      </div>
    </div>
  );
}
