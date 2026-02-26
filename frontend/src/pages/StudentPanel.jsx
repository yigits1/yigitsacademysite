import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';
import './TeacherPanel.css';
import './StudentPanel.css';

const API = 'http://localhost:5000/api';

const MODULES = [
  { key: 'courses',      label: 'Kurs ve Paketler',   desc: 'Kayıtlı kurs ve sözleşme detayları',  icon: '🏳️',  color: '#22c55e' },
  { key: 'attendance',   label: 'Devamsızlıklarım',   desc: 'Yoklama ve kaçırdıkların',             icon: '📋',  color: '#f97316' },
  { key: 'grades',       label: 'Sınav Sonuçları',    desc: 'Puanlar ve değerlendirmeler',          icon: '📚',  color: '#ef4444' },
  { key: 'topics',       label: 'İşlenen Konular',    desc: 'Derslerde işlenen konular',            icon: '🏠',  color: '#f97316' },
  { key: 'test',         label: 'Test Merkezi',       desc: 'Yayınlanan testleri çöz',              icon: '❓',  color: '#06b6d4' },
  { key: 'announcements',label: 'Duyurular',          desc: 'Kuruma ait ve genel duyurular',        icon: '📢',  color: '#8b5cf6' },
  { key: 'messages',     label: 'Mesajlar',           desc: 'Eğitim danışmanına soru sor',          icon: '💬',  color: '#3b82f6' },
];

const questions = [
  { q: 'What ___ your name?',                              opts: ['is','are','be','am'],                                              correct: 0 },
  { q: 'She ___ to school every day.',                     opts: ['go','goes','going','gone'],                                        correct: 1 },
  { q: 'I have been studying English ___ five years.',     opts: ['since','for','during','from'],                                     correct: 1 },
  { q: 'By the time she arrived, we ___ dinner.',          opts: ['had finished','finished','finish','have finished'],                 correct: 0 },
  { q: 'The report ___ be submitted by Friday.',           opts: ['should','must','can','might'],                                     correct: 1 },
];

export default function StudentPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgForm, setMsgForm] = useState({ toRole: 'admin', toId: '', subject: '', content: '' });
  const [msgSent, setMsgSent] = useState(false);

  // Level test
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [levelScore, setLevelScore] = useState(null);

  useEffect(() => {
    axios.get(`${API}/courses`).then(r => setCourses(r.data)).catch(() => {});
    axios.get(`${API}/teachers`).then(r => setTeachers(r.data)).catch(() => {});
    axios.get(`${API}/students`).then(r => {
      const me = r.data.find(s => s.id === user.id);
      if (me) setStudentData(me);
    }).catch(() => {});
    axios.get(`${API}/announcements`).then(r => setAnnouncements(r.data)).catch(() => {});
    axios.get(`${API}/messages?studentId=${user.id}`).then(r => setMessages(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!studentData) return;
    const fetchClass = async () => {
      const attendAll = [], gradesAll = [], topicsAll = [];
      for (const cid of studentData.enrolledCourses || []) {
        const [a, g, t] = await Promise.all([
          axios.get(`${API}/class?courseId=${cid}&studentId=${studentData.id}`).then(r => r.data).catch(() => []),
          axios.get(`${API}/class/grades?courseId=${cid}&studentId=${studentData.id}`).then(r => r.data).catch(() => []),
          axios.get(`${API}/class/topics?courseId=${cid}`).then(r => r.data).catch(() => []),
        ]);
        attendAll.push(...a); gradesAll.push(...g); topicsAll.push(...t);
      }
      setAttendance(attendAll); setGrades(gradesAll); setTopics(topicsAll);
    };
    fetchClass();
  }, [studentData]);

  const enrolledCourses = courses.filter(c => studentData?.enrolledCourses?.includes(c.id));

  const handleAnswer = (idx) => {
    const na = [...answers, idx];
    if (currentQ + 1 < questions.length) { setAnswers(na); setCurrentQ(currentQ + 1); }
    else { setLevelScore(Math.round((na.filter((a, i) => a === questions[i].correct).length / questions.length) * 100)); }
  };

  const startTest = () => { setCurrentQ(0); setAnswers([]); setLevelScore(null); };
  const levelLabel = levelScore === null ? '' : levelScore < 40 ? 'A1-A2 (Başlangıç)' : levelScore < 70 ? 'B1-B2 (Orta)' : 'C1-C2 (İleri)';

  const getCourseAttendance = (courseId) => {
    const recs = attendance.filter(a => a.courseId === courseId).flatMap(a => a.records.filter(r => r.studentId === studentData?.id));
    const present = recs.filter(r => r.present).length;
    return { total: recs.length, present, pct: recs.length ? Math.round((present / recs.length) * 100) : null };
  };

  const sendMessage = async () => {
    if (!msgForm.subject || !msgForm.content) return;
    const payload = {
      fromRole: 'student', fromId: user.id,
      toRole: msgForm.toRole, toId: msgForm.toId,
      subject: msgForm.subject,
      content: msgForm.content
    };
    await axios.post(`${API}/messages`, payload);
    setMsgSent(true);
    setMsgForm({ toRole: 'admin', toId: '', subject: '', content: '' });
    axios.get(`${API}/messages?studentId=${user.id}`).then(r => setMessages(r.data)).catch(() => {});
    setTimeout(() => setMsgSent(false), 3000);
  };

  // Stats for dashboard
  const allAttRecs = attendance.flatMap(a => a.records.filter(r => r.studentId === studentData?.id));
  const presentCount = allAttRecs.filter(r => r.present).length;
  const unreadAnnouncements = announcements.length;
  const unreadMessages = messages.filter(m => m.reply).length;

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon-sm">YA</span>
          <span>Öğrenci Paneli</span>
        </div>
        <div className="teacher-info-box">
          <p className="teacher-welcome">Hoş geldiniz,</p>
          <p className="teacher-name-display">{user.name}</p>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-item ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
            <span>🏠</span> Ana Panel
          </button>
          {MODULES.map(m => (
            <button key={m.key} className={`sidebar-item ${tab === m.key ? 'active' : ''}`} onClick={() => setTab(m.key)}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-content">

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="panel-title">Merhaba, {user.name}!</h2>

            {/* Quick stats */}
            <div className="stats-grid" style={{ marginBottom: 32 }}>
              <div className="stat-card stat-blue">
                <div className="stat-icon">📚</div>
                <div><strong>{enrolledCourses.length}</strong><p>Kayıtlı Kurs</p></div>
              </div>
              <div className="stat-card stat-green">
                <div className="stat-icon">✅</div>
                <div><strong>{presentCount}/{allAttRecs.length}</strong><p>Yoklama</p></div>
              </div>
              <div className="stat-card stat-orange">
                <div className="stat-icon">📝</div>
                <div><strong>{grades.length}</strong><p>Sınav Notu</p></div>
              </div>
              <div className="stat-card stat-purple">
                <div className="stat-icon">📢</div>
                <div><strong>{unreadAnnouncements}</strong><p>Duyuru</p></div>
              </div>
            </div>

            {/* Module cards grid */}
            <div className="module-grid">
              {MODULES.map(m => (
                <button key={m.key} className="module-card" onClick={() => setTab(m.key)}>
                  <div className="module-card-inner">
                    <div className="module-icon-wrap" style={{ background: m.color }}>
                      <span className="module-icon">{m.icon}</span>
                    </div>
                    <span className="module-arrow">›</span>
                  </div>
                  <h3 className="module-title">{m.label}</h3>
                  <p className="module-desc">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── KURS VE PAKETLER ── */}
        {tab === 'courses' && (
          <div>
            <h2 className="panel-title">Kurs ve Paketler</h2>
            {enrolledCourses.length === 0 ? (
              <p style={{ color: 'var(--gray-600)' }}>Henüz bir kursa kayıtlı değilsiniz.</p>
            ) : (
              <div className="grid-2">
                {enrolledCourses.map(c => {
                  const prog = studentData?.progress?.[c.id] ?? 0;
                  const att = getCourseAttendance(c.id);
                  const cGrades = grades.filter(g => g.courseId === c.id);
                  return (
                    <div key={c.id} className="card" style={{ padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{c.name}</h3>
                        <span className="badge">{c.level}</span>
                      </div>
                      <p style={{ color: 'var(--gray-600)', fontSize: 13.5, marginBottom: 16 }}>{c.description}</p>
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span>İlerleme</span><span style={{ fontWeight: 700 }}>{prog}%</span>
                        </div>
                        <div className="progress-bar-wrap"><div className="progress-bar" style={{ width: `${prog}%` }} /></div>
                      </div>
                      {att.total > 0 && <p style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 10 }}>Devamsızlık: <strong>{att.present}/{att.total}</strong> ({att.pct}% katılım)</p>}
                      {cGrades.length > 0 && <p style={{ fontSize: 13, color: 'var(--gray-600)' }}>Notlar: {cGrades.map(g => `${g.examName}: ${g.grade}`).join(' | ')}</p>}
                      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {c.duration && <span style={{ fontSize: 12, background: 'var(--gray-100)', padding: '4px 10px', borderRadius: 12 }}>📅 {c.duration}</span>}
                        {c.sessions && <span style={{ fontSize: 12, background: 'var(--gray-100)', padding: '4px 10px', borderRadius: 12 }}>🕐 {c.sessions}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── DEVAMSIZLIK ── */}
        {tab === 'attendance' && (
          <div>
            <h2 className="panel-title">Devamsızlıklarım</h2>
            {enrolledCourses.map(c => {
              const att = getCourseAttendance(c.id);
              const dayRecords = attendance.filter(a => a.courseId === c.id);
              return (
                <div key={c.id} style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>{c.name}</h3>
                  {att.total === 0 ? (
                    <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>Henüz yoklama alınmamış.</p>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                        <div className="stat-card stat-green" style={{ padding: '14px 20px', flex: '0 0 auto' }}><strong>{att.present}</strong><p style={{ fontSize: 12 }}>Katıldı</p></div>
                        <div className="stat-card stat-orange" style={{ padding: '14px 20px', flex: '0 0 auto' }}><strong>{att.total - att.present}</strong><p style={{ fontSize: 12 }}>Katılmadı</p></div>
                        <div className="stat-card stat-blue" style={{ padding: '14px 20px', flex: '0 0 auto' }}><strong>{att.pct}%</strong><p style={{ fontSize: 12 }}>Katılım</p></div>
                      </div>
                      <div className="table-wrap">
                        <table>
                          <thead><tr><th>Tarih</th><th>Durum</th></tr></thead>
                          <tbody>
                            {dayRecords.flatMap(a => a.records.filter(r => r.studentId === studentData?.id).map((r, i) => (
                              <tr key={`${a.id}-${i}`}>
                                <td>{a.date}</td>
                                <td><span className={`attend-badge ${r.present ? 'present' : 'absent'}`}>{r.present ? 'Var' : 'Yok'}</span></td>
                              </tr>
                            )))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── SINAV SONUÇLARI ── */}
        {tab === 'grades' && (
          <div>
            <h2 className="panel-title">Sınav Sonuçları</h2>
            {enrolledCourses.map(c => {
              const cGrades = grades.filter(g => g.courseId === c.id);
              const avg = cGrades.length ? Math.round(cGrades.reduce((a, g) => a + Number(g.grade), 0) / cGrades.length) : null;
              return (
                <div key={c.id} style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
                    {c.name}
                    {avg !== null && <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-600)', marginLeft: 12 }}>
                      Ortalama: <strong style={{ color: avg >= 60 ? '#198754' : '#dc3545' }}>{avg}</strong>
                    </span>}
                  </h3>
                  {cGrades.length === 0 ? (
                    <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>Henüz not girilmemiş.</p>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Sınav</th><th>Not</th><th>Durum</th></tr></thead>
                        <tbody>
                          {cGrades.map(g => (
                            <tr key={g.id}>
                              <td>{g.examName}</td>
                              <td><span className={`grade-pill ${Number(g.grade) >= 60 ? 'pass' : 'fail'}`}>{g.grade}</span></td>
                              <td>{Number(g.grade) >= 60 ? '✅ Geçti' : '❌ Kaldı'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── İŞLENEN KONULAR ── */}
        {tab === 'topics' && (
          <div>
            <h2 className="panel-title">İşlenen Konular</h2>
            {enrolledCourses.map(c => {
              const cTopics = topics.filter(t => t.courseId === c.id);
              return (
                <div key={c.id} style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>{c.name}</h3>
                  {cTopics.length === 0 ? (
                    <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>Henüz konu eklenmemiş.</p>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Tarih</th><th>İşlenen Konu</th></tr></thead>
                        <tbody>
                          {[...cTopics].reverse().map(t => (
                            <tr key={t.id}><td>{t.date}</td><td>{t.topic}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TEST MERKEZİ ── */}
        {tab === 'test' && (
          <div>
            <h2 className="panel-title">Test Merkezi</h2>
            <div className="test-center-wrap">
              {levelScore === null ? (
                <div className="test-card">
                  <div className="test-progress-row">
                    <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Soru {currentQ + 1} / {questions.length}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>{Math.round((currentQ / questions.length) * 100)}%</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ marginBottom: 28 }}>
                    <div className="progress-bar" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
                  </div>
                  <p className="test-question">{questions[currentQ].q}</p>
                  <div className="level-options-grid">
                    {questions[currentQ].opts.map((o, i) => (
                      <button key={i} className="level-option-btn" onClick={() => handleAnswer(i)}>{o}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="test-result-card">
                  <div className="score-circle-lg">{levelScore}%</div>
                  <h3 style={{ margin: '20px 0 8px', fontSize: '1.3rem' }}>Seviyeniz: {levelLabel}</h3>
                  <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Tebrikler! Testi tamamladınız.</p>
                  <button className="btn btn-primary" onClick={startTest}>Tekrar Çöz</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DUYURULAR ── */}
        {tab === 'announcements' && (
          <div>
            <h2 className="panel-title">Duyurular</h2>
            {announcements.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: '2.5rem' }}>📢</span>
                <p>Henüz duyuru bulunmuyor.</p>
              </div>
            ) : (
              <div className="announcements-list">
                {announcements.map(a => (
                  <div key={a.id} className="announcement-card">
                    <div className="announcement-header">
                      <h3>{a.title}</h3>
                      <span className="announcement-date">{a.date}</span>
                    </div>
                    <p>{a.content}</p>
                    {a.targetRole !== 'all' && (
                      <span className="badge" style={{ marginTop: 10, display: 'inline-block' }}>{a.targetRole === 'student' ? 'Öğrencilere' : 'Öğretmenlere'}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MESAJLAR ── */}
        {tab === 'messages' && (
          <div>
            <h2 className="panel-title">Mesajlar</h2>
            <div className="message-compose">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Yeni Mesaj Gönder</h3>
              {msgSent && <div className="alert alert-success">Mesajınız gönderildi!</div>}
              <div className="form-group">
                <label>Alıcı Rolü</label>
                <select value={msgForm.toRole} onChange={e => setMsgForm({ ...msgForm, toRole: e.target.value, toId: '' })}>
                  <option value="admin">Yönetici</option>
                  <option value="teacher">Öğretmen</option>
                </select>
              </div>
              {msgForm.toRole === 'teacher' && (
                <div className="form-group">
                  <label>Öğretmen Seç</label>
                  <select value={msgForm.toId} onChange={e => setMsgForm({ ...msgForm, toId: e.target.value })}>
                    <option value="">Seçin</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group"><label>Konu</label><input placeholder="Mesaj konusu..." value={msgForm.subject} onChange={e => setMsgForm({ ...msgForm, subject: e.target.value })} /></div>
              <div className="form-group"><label>Mesaj</label><textarea rows={4} placeholder="Mesajınızı yazın..." value={msgForm.content} onChange={e => setMsgForm({ ...msgForm, content: e.target.value })} /></div>
              <button className="btn btn-primary btn-sm" onClick={sendMessage}>Gönder</button>
            </div>

            {messages.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Mesaj Geçmişi</h3>
                {messages.map(m => (
                  <div key={m.id} className="message-thread">
                    <div className={`message-bubble ${m.fromRole === 'student' ? 'sent' : 'received'}`}>
                      <div className="message-meta">{m.date} — <strong>{m.subject}</strong></div>
                      <p>{m.content}</p>
                    </div>
                    {m.reply && (
                      <div className="message-bubble reply">
                        <div className="message-meta">{m.replyDate} — <strong>{m.fromRole === 'student' ? 'Yönetici' : 'Yönetici'}</strong></div>
                        <p>{m.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
