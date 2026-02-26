import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';
import './TeacherPanel.css';

const API = 'https://yigitsacademysite-production.up.railway.app/api';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function TeacherPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('attendance');
  const [courses, setCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [newMsgForm, setNewMsgForm] = useState({ toRole: 'admin', toId: '', subject: '', content: '' });

  const [attendDate, setAttendDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendRecords, setAttendRecords] = useState({});

  const [gradeForm, setGradeForm] = useState({ studentId: '', examName: '', grade: '' });
  const [topicForm, setTopicForm] = useState({ date: new Date().toISOString().split('T')[0], topic: '', description: '' });

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const refreshMessages = () => {
    axios.get(`${API}/messages?participantRole=teacher&participantId=${user.id}`)
      .then(r => setMessages(r.data)).catch(() => {});
  };

  const sendReply = async (id) => {
    if (!replyText[id]) return;
    await axios.put(`${API}/messages/${id}/reply`, { reply: replyText[id] });
    setReplyText({ ...replyText, [id]: '' });
    notify('Yanıt gönderildi.');
    refreshMessages();
  };

  const sendNewMessage = async () => {
    if (!newMsgForm.subject || !newMsgForm.content) return notify('Tüm alanları doldurun.', 'error');
    await axios.post(`${API}/messages`, {
      fromRole: 'teacher', fromId: user.id,
      toRole: newMsgForm.toRole, toId: newMsgForm.toId,
      subject: newMsgForm.subject, content: newMsgForm.content
    });
    notify('Mesaj gönderildi.');
    setNewMsgForm({ toRole: 'admin', toId: '', subject: '', content: '' });
    refreshMessages();
  };

  useEffect(() => {
    axios.get(`${API}/courses`).then(r => {
      const myCourses = r.data.filter(c => (user.assignedCourses || []).includes(c.id));
      setCourses(myCourses);
      if (myCourses.length > 0) setSelectedCourse(myCourses[0].id);
    }).catch(() => {});
    axios.get(`${API}/students`).then(r => setAllStudents(r.data)).catch(() => {});
    // load messages involving this teacher
    axios.get(`${API}/messages?participantRole=teacher&participantId=${user.id}`)
      .then(r => setMessages(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    axios.get(`${API}/attendance/course/${selectedCourse}`).then(r => setAttendance(r.data)).catch(() => {});
    axios.get(`${API}/grades/course/${selectedCourse}`).then(r => setGrades(r.data)).catch(() => {});
    axios.get(`${API}/lessons/course/${selectedCourse}`).then(r => setTopics(r.data)).catch(() => {});
  }, [selectedCourse]);

  const courseStudents = allStudents.filter(s => s.enrolledCourses?.includes(selectedCourse));

  useEffect(() => {
    const init = {};
    courseStudents.forEach(s => { init[s.id] = true; });
    setAttendRecords(init);
  }, [selectedCourse, allStudents]);

  const saveAttendance = async () => {
    const records = Object.entries(attendRecords).map(([studentId, present]) => ({ studentId, present }));
    await axios.post(`${API}/attendance`, { courseId: selectedCourse, date: attendDate, records, teacherId: user.id });
    notify('Yoklama kaydedildi.');
    axios.get(`${API}/attendance/course/${selectedCourse}`).then(r => setAttendance(r.data)).catch(() => {});
  };

  const saveGrade = async () => {
    if (!gradeForm.studentId || !gradeForm.examName || gradeForm.grade === '') return notify('Tüm alanları doldurun.', 'error');
    await axios.post(`${API}/grades`, { ...gradeForm, courseId: selectedCourse, teacherId: user.id });
    notify('Not kaydedildi.');
    setGradeForm({ studentId: '', examName: '', grade: '' });
    axios.get(`${API}/grades/course/${selectedCourse}`).then(r => setGrades(r.data)).catch(() => {});
  };

  const saveTopic = async () => {
    if (!topicForm.topic) return notify('Konu boş olamaz.', 'error');
    await axios.post(`${API}/lessons`, { ...topicForm, courseId: selectedCourse, teacherId: user.id });
    notify('Konu kaydedildi.');
    setTopicForm({ date: new Date().toISOString().split('T')[0], topic: '', description: '' });
    axios.get(`${API}/lessons/course/${selectedCourse}`).then(r => setTopics(r.data)).catch(() => {});
  };

  const getStudentName = (id) => allStudents.find(s => s.id === id)?.name || id;

  const attendedDates = [...new Set(attendance.map(a => a.date))].sort().reverse();

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon-sm">YA</span>
          <span>Öğretmen Paneli</span>
        </div>
        <div className="teacher-info-box">
          <p className="teacher-welcome">Hoş geldiniz,</p>
          <p className="teacher-name-display">{user.name}</p>
        </div>
        <nav className="sidebar-nav">
          {[
            { key: 'attendance', label: 'Yoklama', icon: '✅' },
            { key: 'grades', label: 'Notlar', icon: '📝' },
            { key: 'topics', label: 'Ders Konuları', icon: '📖' },
            { key: 'history', label: 'Geçmiş Yoklama', icon: '📋' },
            { key: 'messages', label: 'Mesajlar', icon: '💬' },
          ].map(item => (
            <button key={item.key} className={`sidebar-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-content">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="course-selector-bar">
          <label style={{ fontWeight: 700, fontSize: 14, marginRight: 12 }}>Kurs Seç:</label>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ width: 'auto', display: 'inline-block' }}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {courses.length === 0 && <span style={{ color: 'var(--gray-600)', fontSize: 14 }}>Henüz atanmış kursunuz yok.</span>}
        </div>

        {/* ATTENDANCE */}
        {tab === 'attendance' && (
          <div>
            <h2 className="panel-title">Yoklama Al</h2>
            <div className="form-group" style={{ maxWidth: 280 }}>
              <label>Tarih</label>
              <input type="date" value={attendDate} onChange={e => setAttendDate(e.target.value)} />
            </div>
            {courseStudents.length === 0 ? (
              <p style={{ color: 'var(--gray-600)' }}>Bu kursa kayıtlı öğrenci bulunmuyor.</p>
            ) : (
              <>
                <div className="attendance-list">
                  {courseStudents.map(s => (
                    <label key={s.id} className="attend-item">
                      <input
                        type="checkbox"
                        checked={attendRecords[s.id] !== false}
                        onChange={e => setAttendRecords({ ...attendRecords, [s.id]: e.target.checked })}
                      />
                      <span className="attend-name">{s.name}</span>
                      <span className={`attend-badge ${attendRecords[s.id] !== false ? 'present' : 'absent'}`}>
                        {attendRecords[s.id] !== false ? 'Var' : 'Yok'}
                      </span>
                    </label>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={saveAttendance}>
                  Yoklamayı Kaydet
                </button>
              </>
            )}
          </div>
        )}

        {/* GRADES */}
        {tab === 'grades' && (
          <div>
            <h2 className="panel-title">Not Girişi</h2>
            <div className="grade-form">
              <div className="form-group">
                <label>Öğrenci</label>
                <select value={gradeForm.studentId} onChange={e => setGradeForm({ ...gradeForm, studentId: e.target.value })}>
                  <option value="">Seçin</option>
                  {courseStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Sınav Adı</label>
                <input placeholder="Örn: Midterm, Quiz 1" value={gradeForm.examName} onChange={e => setGradeForm({ ...gradeForm, examName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Not (0-100)</label>
                <input type="number" min={0} max={100} value={gradeForm.grade} onChange={e => setGradeForm({ ...gradeForm, grade: e.target.value })} />
              </div>
              <button className="btn btn-success btn-sm" onClick={saveGrade}>Not Ekle / Güncelle</button>
            </div>

            {grades.length > 0 && (
              <>
                <h3 style={{ margin: '24px 0 14px', fontSize: '1.05rem' }}>Kayıtlı Notlar</h3>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Öğrenci</th><th>Sınav</th><th>Not</th></tr></thead>
                    <tbody>
                      {grades.map(g => (
                        <tr key={g.id}>
                          <td>{getStudentName(g.studentId)}</td>
                          <td>{g.examName}</td>
                          <td><span className={`grade-pill ${g.grade >= 60 ? 'pass' : 'fail'}`}>{g.grade}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* TOPICS */}
        {tab === 'topics' && (
          <div>
            <h2 className="panel-title">Ders Konusu Kaydet</h2>
            <div className="grade-form">
              <div className="form-group">
                <label>Tarih</label>
                <input type="date" value={topicForm.date} onChange={e => setTopicForm({ ...topicForm, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Konu Başlığı</label>
                <input placeholder="Örn: Veri Tabanları, Fonksiyonlar..." value={topicForm.topic} onChange={e => setTopicForm({ ...topicForm, topic: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <textarea rows={3} placeholder="Derste işlenen konunun detaylarını yazın..." value={topicForm.description} onChange={e => setTopicForm({ ...topicForm, description: e.target.value })} />
              </div>
              <button className="btn btn-primary btn-sm" onClick={saveTopic}>Konuyu Kaydet</button>
            </div>

            {topics.length > 0 && (
              <>
                <h3 style={{ margin: '24px 0 14px', fontSize: '1.05rem' }}>Konu Listesi</h3>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Tarih</th><th>Konu</th><th>Açıklama</th></tr></thead>
                    <tbody>
                      {[...topics].reverse().map(t => (
                        <tr key={t.id}>
                          <td>{t.date}</td>
                          <td><strong>{t.topic}</strong></td>
                          <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          <div>
            <h2 className="panel-title">Geçmiş Yoklama Kayıtları</h2>
            {attendedDates.length === 0 ? (
              <p style={{ color: 'var(--gray-600)' }}>Henüz yoklama kaydı bulunmuyor.</p>
            ) : (
              attendedDates.map(date => {
                const dayRecords = attendance.filter(a => a.date === date);
                const allRecords = dayRecords.flatMap(a => a.records);
                return (
                  <div key={date} className="history-block">
                    <div className="history-date">{date}</div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Öğrenci</th><th>Durum</th></tr></thead>
                        <tbody>
                          {allRecords.map((r, i) => (
                            <tr key={i}>
                              <td>{getStudentName(r.studentId)}</td>
                              <td><span className={`attend-badge ${r.present ? 'present' : 'absent'}`}>{r.present ? 'Var' : 'Yok'}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <div>
            <h2 className="panel-title">Mesajlar</h2>
            <div style={{ marginBottom: 20 }}>
              <h3>Yeni Mesaj Gönder</h3>
              <div className="form-group">
                <label>Alıcı Rolü</label>
                <select value={newMsgForm.toRole} onChange={e => setNewMsgForm({ ...newMsgForm, toRole: e.target.value, toId: '' })}>
                  <option value="admin">Yönetici</option>
                  <option value="student">Öğrenci</option>
                </select>
              </div>
              {newMsgForm.toRole === 'student' && (
                <div className="form-group">
                  <label>Öğrenci Seç</label>
                  <select value={newMsgForm.toId} onChange={e => setNewMsgForm({ ...newMsgForm, toId: e.target.value })}>
                    <option value="">Seçin</option>
                    {courseStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group"><label>Konu</label><input value={newMsgForm.subject} onChange={e => setNewMsgForm({ ...newMsgForm, subject: e.target.value })} /></div>
              <div className="form-group"><label>Mesaj</label><textarea rows={2} value={newMsgForm.content} onChange={e => setNewMsgForm({ ...newMsgForm, content: e.target.value })} /></div>
              <button className="btn btn-primary btn-sm" onClick={sendNewMessage}>Gönder</button>
            </div>
            {messages.length === 0 ? (
              <p style={{ color: 'var(--gray-600)' }}>Mesajınız yok.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {messages.map(m => (
                  <div key={m.id} className="settings-section" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <strong>{m.fromRole === 'student' ? allStudents.find(s=>s.id===m.fromId)?.name || m.fromId : m.fromRole === 'admin' ? 'Yönetici' : 'Siz'}</strong>
                        <span style={{ fontSize: 12, color: 'var(--gray-600)', marginLeft: 10 }}>{m.date}</span>
                      </div>
                      <button className="btn btn-sm btn-danger" onClick={() => {
                        axios.delete(`${API}/messages/${m.id}`).then(()=>refreshMessages());
                      }}>Sil</button>
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>{m.subject}</p>
                    <p style={{ fontSize: 13.5, color: 'var(--gray-600)', marginBottom: 14, background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 8 }}>{m.content}</p>
                    {m.reply ? (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 13.5 }}>
                        <strong>Yanıtınız ({m.replyDate}):</strong> {m.reply}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input placeholder="Yanıt yaz..." value={replyText[m.id] || ''} onChange={e => setReplyText({ ...replyText, [m.id]: e.target.value })} style={{ flex: 1 }} />
                        <button className="btn btn-success btn-sm" onClick={() => sendReply(m.id)}>Yanıtla</button>
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
