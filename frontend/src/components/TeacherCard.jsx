import React from 'react';
import './TeacherCard.css';

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80',
];

export default function TeacherCard({ teacher, index = 0 }) {
  const avatar = AVATARS[index % AVATARS.length];
  return (
    <div className="card teacher-card">
      <div className="teacher-img-wrap">
        <img src={avatar} alt={teacher.name} className="teacher-img" />
      </div>
      <div className="teacher-body">
        <h3 className="teacher-name">{teacher.name}</h3>
        <span className="badge badge-orange teacher-spec">{teacher.specialization || 'İngilizce Eğitmeni'}</span>
        <p className="teacher-bio">{teacher.bio}</p>
      </div>
    </div>
  );
}
