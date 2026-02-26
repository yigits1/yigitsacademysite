import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API = 'http://localhost:5000/api';

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

export default function AdminPanel() {
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [siteSettings, setSiteSettings] = useState(null);
  const [settingsForm, setSettingsForm] = useState({});

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({ name: '', description: '', level: '', duration: '', sessions: '' });

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', username: '', password: '', enrolledCourses: [] });

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ name: '', username: '', password: '', specialization: '', bio: '', assignedCourses: [] });

  // classes/groups management
  const [showClassModal, setShowClassModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [classForm, setClassForm] = useState({ title: '', courseId: '', teacherId: '', teacherName: '', startDate: '', endDate: '', times: '', description: '' });

  const [announcements, setAnnouncements] = useState([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', targetRole: 'all' });

  const [adminMessages, setAdminMessages] = useState([]);
  const [replyText, setReplyText] = useState({});

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStudent, setProgressStudent] = useState(null);
  const [progressForm, setProgressForm] = useState({});

  // Grades, Attendance, LessonTopics
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [lessonTopics, setLessonTopics] = useState([]);

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editGrade, setEditGrade] = useState(null);
  const [gradeForm, setGradeForm] = useState({ courseId: '', studentId: '', examName: '', grade: '', teacherId: '' });

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editAttendance, setEditAttendance] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({ courseId: '', date: '', teacherId: '', records: [] });

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({ courseId: '', topic: '', description: '', date: '', teacherId: '' });

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const fetchAll = () => {
    axios.get(`${API}/courses`).then(r => setCourses(r.data)).catch(() => {});
    axios.get(`${API}/students`).then(r => setStudents(r.data)).catch(() => {});
    axios.get(`${API}/teachers`).then(r => setTeachers(r.data)).catch(() => {});
    axios.get(`${API}/classes`).then(r => setClasses(r.data)).catch(() => {});
    axios.get(`${API}/applications`).then(r => setApplications(r.data)).catch(() => {});
    axios.get(`${API}/announcements`).then(r => setAnnouncements(r.data)).catch(() => {});
    axios.get(`${API}/messages`).then(r => setAdminMessages(r.data)).catch(() => {});
    axios.get(`${API}/grades`).then(r => setGrades(r.data)).catch(() => {});
    axios.get(`${API}/attendance`).then(r => setAttendance(r.data)).catch(() => {});
    axios.get(`${API}/lessons`).then(r => setLessonTopics(r.data)).catch(() => {});
  };

  const fetchSettings = () => {
    axios.get(`${API}/settings`).then(r => { setSiteSettings(r.data); setSettingsForm(r.data); }).catch(() => {});
  };

  useEffect(() => { fetchAll(); fetchSettings(); }, []);

  const saveSettings = async () => {
    try {
      await axios.put(`${API}/settings`, settingsForm);
      fetchSettings();
      notify('Site ayarları kaydedildi.');
    } catch { notify('Hata oluştu.', 'error'); }
  };

  // --- COURSES ---
  const openAddCourse = () => { setEditCourse(null); setCourseForm({ name: '', description: '', level: '', duration: '', sessions: '' }); setShowCourseModal(true); };
  const openEditCourse = (c) => { setEditCourse(c); setCourseForm({ name: c.name, description: c.description, level: c.level, duration: c.duration || '', sessions: c.sessions || '' }); setShowCourseModal(true); };

  const saveCourse = async () => {
    try {
      if (editCourse) {
        await axios.put(`${API}/courses/${editCourse.id}`, courseForm);
        notify('Kurs güncellendi.');
      } else {
        await axios.post(`${API}/courses`, courseForm);
        notify('Kurs eklendi.');
      }
      setShowCourseModal(false);
      fetchAll();
    } catch { notify('Hata oluştu.', 'error'); }
  };

  const deleteCourse = async (id) => {
    if (!confirm('Bu kursu silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/courses/${id}`);
    notify('Kurs silindi.');
    fetchAll();
  };

  // --- STUDENTS ---
  const openAddStudent = () => { setEditStudent(null); setStudentForm({ name: '', email: '', username: '', password: '', enrolledCourses: [] }); setShowStudentModal(true); };
  const openEditStudent = (s) => { setEditStudent(s); setStudentForm({ name: s.name, email: s.email, username: s.username, password: '', enrolledCourses: s.enrolledCourses }); setShowStudentModal(true); };

  const saveStudent = async () => {
    try {
      const payload = { ...studentForm };
      if (!payload.password) delete payload.password;
      if (editStudent) {
        await axios.put(`${API}/students/${editStudent.id}`, payload);
        notify('Öğrenci güncellendi.');
      } else {
        await axios.post(`${API}/students`, payload);
        notify('Öğrenci eklendi.');
      }
      setShowStudentModal(false);
      fetchAll();
    } catch (e) { notify(e.response?.data?.message || 'Hata oluştu.', 'error'); }
  };

  const deleteStudent = async (id) => {
    if (!confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/students/${id}`);
    notify('Öğrenci silindi.');
    fetchAll();
  };

  const openProgress = (s) => {
    setProgressStudent(s);
    const pf = {};
    (s.enrolledCourses || []).forEach(cid => { pf[cid] = s.progress?.[cid] ?? 0; });
    setProgressForm(pf);
    setShowProgressModal(true);
  };

  const saveProgress = async () => {
    await axios.put(`${API}/students/${progressStudent.id}`, { progress: progressForm });
    notify('İlerleme güncellendi.');
    setShowProgressModal(false);
    fetchAll();
  };

  // --- TEACHERS ---
  const openAddTeacher = () => { setEditTeacher(null); setTeacherForm({ name: '', username: '', password: '', specialization: '', bio: '', assignedCourses: [] }); setShowTeacherModal(true); };
  const openEditTeacher = (t) => { setEditTeacher(t); setTeacherForm({ name: t.name, username: t.username, password: '', specialization: t.specialization, bio: t.bio, assignedCourses: t.assignedCourses || [] }); setShowTeacherModal(true); };

  const saveTeacher = async () => {
    try {
      const payload = { ...teacherForm };
      if (!payload.password) delete payload.password;
      if (editTeacher) {
        await axios.put(`${API}/teachers/${editTeacher.id}`, payload);
        notify('Öğretmen güncellendi.');
      } else {
        await axios.post(`${API}/teachers`, payload);
        notify('Öğretmen eklendi.');
      }
      setShowTeacherModal(false);
      fetchAll();
    } catch (e) { notify(e.response?.data?.message || 'Hata oluştu.', 'error'); }
  };

  const deleteTeacher = async (id) => {
    if (!confirm('Bu öğretmeni silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/teachers/${id}`);
    notify('Öğretmen silindi.');
    fetchAll();
  };

  // --- CLASSES/GROUPS ---
  const openAddClass = () => {
    setEditClass(null);
    setClassForm({ title: '', courseId: '', teacherId: '', teacherName: '', startDate: '', endDate: '', times: '', description: '' });
    setShowClassModal(true);
  };
  const openEditClass = (c) => {
    setEditClass(c);
    setClassForm({
      title: c.title || '',
      courseId: c.courseId || '',
      teacherId: c.teacherId || '',
      teacherName: c.teacherName || '',
      startDate: c.startDate || '',
      endDate: c.endDate || '',
      times: c.times || '',
      description: c.description || ''
    });
    setShowClassModal(true);
  };
  const saveClass = async () => {
    try {
      if (editClass) {
        await axios.put(`${API}/classes/${editClass.id}`, classForm);
        notify('Sınıf/grup güncellendi.');
      } else {
        await axios.post(`${API}/classes`, classForm);
        notify('Sınıf/grup eklendi.');
      }
      setShowClassModal(false);
      fetchAll();
    } catch { notify('Hata oluştu.', 'error'); }
  };
  const deleteClass = async (id) => {
    if (!confirm('Bu sınıfı/grubu silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/classes/${id}`);
    notify('Sınıf/grup silindi.');
    fetchAll();
  };

  // --- APPLICATIONS ---
  const deleteApplication = async (id) => {
    if (!confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/applications/${id}`);
    notify('Başvuru silindi.');
    fetchAll();
  };

  const toggleCourseCheck = (id, list, setList) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  const getCourseNames = (ids) => ids.map(id => courses.find(c => c.id === id)?.name || id).join(', ') || '-';

  // --- ANNOUNCEMENTS ---
  const postAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) return notify('Başlık ve içerik zorunlu.', 'error');
    await axios.post(`${API}/announcements`, announcementForm);
    setAnnouncementForm({ title: '', content: '', targetRole: 'all' });
    notify('Duyuru yayınlandı.');
    fetchAll();
  };
  const deleteAnnouncement = async (id) => {
    await axios.delete(`${API}/announcements/${id}`);
    notify('Duyuru silindi.');
    fetchAll();
  };

  // --- MESSAGES ---
  const sendReply = async (id) => {
    if (!replyText[id]) return;
    await axios.put(`${API}/messages/${id}/reply`, { reply: replyText[id] });
    setReplyText({ ...replyText, [id]: '' });
    notify('Yanıt gönderildi.');
    fetchAll();
  };
  const deleteMessage = async (id) => {
    await axios.delete(`${API}/messages/${id}`);
    fetchAll();
  };

  // --- GRADES ---
  const openAddGrade = () => { setEditGrade(null); setGradeForm({ courseId: '', studentId: '', examName: '', grade: '', teacherId: '' }); setShowGradeModal(true); };
  const openEditGrade = (g) => { setEditGrade(g); setGradeForm({ courseId: g.courseId, studentId: g.studentId, examName: g.examName, grade: g.grade, teacherId: g.teacherId }); setShowGradeModal(true); };

  const saveGrade = async () => {
    try {
      if (editGrade) {
        await axios.put(`${API}/grades/${editGrade.id}`, gradeForm);
        notify('Not güncellendi.');
      } else {
        await axios.post(`${API}/grades`, gradeForm);
        notify('Not eklendi.');
      }
      setShowGradeModal(false);
      fetchAll();
    } catch { notify('Hata oluştu.', 'error'); }
  };

  const deleteGrade = async (id) => {
    if (!confirm('Bu notu silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/grades/${id}`);
    notify('Not silindi.');
    fetchAll();
  };

  // --- ATTENDANCE ---
  const openAddAttendance = () => { setEditAttendance(null); setAttendanceForm({ courseId: '', date: new Date().toISOString().split('T')[0], teacherId: '', records: [] }); setShowAttendanceModal(true); };
  const openEditAttendance = (a) => { setEditAttendance(a); setAttendanceForm({ courseId: a.courseId, date: a.date, teacherId: a.teacherId, records: a.records }); setShowAttendanceModal(true); };

  const saveAttendance = async () => {
    try {
      if (editAttendance) {
        await axios.put(`${API}/attendance/${editAttendance.id}`, attendanceForm);
        notify('Devamsızlık kaydı güncellendi.');
      } else {
        await axios.post(`${API}/attendance`, attendanceForm);
        notify('Devamsızlık kaydı eklendi.');
      }
      setShowAttendanceModal(false);
      fetchAll();
    } catch { notify('Hata oluştu.', 'error'); }
  };

  const deleteAttendance = async (id) => {
    if (!confirm('Bu devamsızlık kaydını silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/attendance/${id}`);
    notify('Devamsızlık kaydı silindi.');
    fetchAll();
  };

  // --- LESSON TOPICS ---
  const openAddLesson = () => { setEditLesson(null); setLessonForm({ courseId: '', topic: '', description: '', date: new Date().toISOString().split('T')[0], teacherId: '' }); setShowLessonModal(true); };
  const openEditLesson = (l) => { setEditLesson(l); setLessonForm({ courseId: l.courseId, topic: l.topic, description: l.description, date: l.date, teacherId: l.teacherId }); setShowLessonModal(true); };

  const saveLesson = async () => {
    try {
      if (editLesson) {
        await axios.put(`${API}/lessons/${editLesson.id}`, lessonForm);
        notify('Ders konusu güncellendi.');
      } else {
        await axios.post(`${API}/lessons`, lessonForm);
        notify('Ders konusu eklendi.');
      }
      setShowLessonModal(false);
      fetchAll();
    } catch { notify('Hata oluştu.', 'error'); }
  };

  const deleteLesson = async (id) => {
    if (!confirm('Bu ders konusunu silmek istediğinizden emin misiniz?')) return;
    await axios.delete(`${API}/lessons/${id}`);
    notify('Ders konusu silindi.');
    fetchAll();
  };

  const downloadReport = (type, id) => {
    window.location.href = `${API}/reports/${type}/${id}`;
  };

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon-sm">YA</span>
          <span>Yönetici Paneli</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { key: 'courses', label: 'Kurslar', icon: '📚' },
            { key: 'students', label: 'Öğrenciler', icon: '🎓' },
            { key: 'teachers', label: 'Öğretmenler', icon: '👨‍🏫' },
            { key: 'classes', label: 'Sınıflar/Grup', icon: '🏫' },
            { key: 'grades', label: 'Notlar', icon: '📊' },
            { key: 'attendance', label: 'Devamsızlık', icon: '📋' },
            { key: 'lessons', label: 'Ders Konuları', icon: '📖' },
            { key: 'applications', label: 'Başvurular', icon: '📝' },
            { key: 'overview', label: 'Genel Bakış', icon: '📊' },
            { key: 'announcements', label: 'Duyurular', icon: '📢' },
            { key: 'messages', label: 'Mesajlar', icon: '💬' },
            { key: 'settings', label: 'Site Ayarları', icon: '⚙️' },
          ].map(item => (
            <button key={item.key} className={`sidebar-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-content">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <h2 className="panel-title">Genel Bakış</h2>
            <div className="stats-grid">
              <div className="stat-card stat-blue">
                <div className="stat-icon">📚</div>
                <div><strong>{courses.length}</strong><p>Toplam Kurs</p></div>
              </div>
              <div className="stat-card stat-green">
                <div className="stat-icon">🎓</div>
                <div><strong>{students.length}</strong><p>Kayıtlı Öğrenci</p></div>
              </div>
              <div className="stat-card stat-orange">
                <div className="stat-icon">👨‍🏫</div>
                <div><strong>{teachers.length}</strong><p>Öğretmen</p></div>
              </div>
              <div className="stat-card stat-purple">
                <div className="stat-icon">📝</div>
                <div><strong>{students.reduce((a, s) => a + (s.enrolledCourses?.length || 0), 0)}</strong><p>Toplam Kayıt</p></div>
              </div>
            </div>

            <h3 style={{ marginBottom: 16, marginTop: 32 }}>Öğrenci İlerleme Özeti</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Öğrenci</th><th>Kayıtlı Kurslar</th><th>Ortalama İlerleme</th></tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const progValues = Object.values(s.progress || {});
                    const avg = progValues.length ? Math.round(progValues.reduce((a, b) => a + b, 0) / progValues.length) : 0;
                    return (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{getCourseNames(s.enrolledCourses || [])}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="progress-bar-wrap" style={{ flex: 1 }}>
                              <div className="progress-bar" style={{ width: `${avg}%` }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{avg}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COURSES */}
        {tab === 'courses' && (
          <div>
            <div className="panel-header">
              <h2 className="panel-title">Kurs Yönetimi</h2>
              <button className="btn btn-primary btn-sm" onClick={openAddCourse}>+ Yeni Kurs Ekle</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Kurs Adı</th><th>Seviye</th><th>Süre</th><th>Seans</th><th>Öğretmen</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td><span className="badge">{c.level}</span></td>
                      <td>{c.duration || '-'}</td>
                      <td>{c.sessions || '-'}</td>
                      <td>{teachers.find(t => t.id === c.instructorId)?.name || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openEditCourse(c)}>Düzenle</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteCourse(c.id)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {tab === 'students' && (
          <div>
            <div className="panel-header">
              <h2 className="panel-title">Öğrenci Yönetimi</h2>
              <button className="btn btn-primary btn-sm" onClick={openAddStudent}>+ Yeni Öğrenci Ekle</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Ad Soyad</th><th>Kullanıcı Adı</th><th>E-posta</th><th>Kurslar</th><th>İlerleme</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const progValues = Object.values(s.progress || {});
                    const avg = progValues.length ? Math.round(progValues.reduce((a, b) => a + b, 0) / progValues.length) : 0;
                    return (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.username}</td>
                        <td>{s.email || '-'}</td>
                        <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getCourseNames(s.enrolledCourses || [])}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                            <div className="progress-bar-wrap" style={{ flex: 1 }}>
                              <div className="progress-bar" style={{ width: `${avg}%` }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>{avg}%</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <button className="btn btn-sm btn-secondary" onClick={() => openEditStudent(s)}>Düzenle</button>
                            <button className="btn btn-sm btn-success" onClick={() => openProgress(s)}>İlerleme</button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(s.id)}>Sil</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEACHERS */}
        {tab === 'teachers' && (
          <div>
            <div className="panel-header">
              <h2 className="panel-title">Öğretmen Yönetimi</h2>
              <button className="btn btn-primary btn-sm" onClick={openAddTeacher}>+ Yeni Öğretmen Ekle</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Ad Soyad</th><th>Kullanıcı Adı</th><th>Uzmanlık</th><th>Atanmış Kurslar</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {teachers.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.username}</td>
                      <td>{t.specialization || '-'}</td>
                      <td>{getCourseNames(t.assignedCourses || [])}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openEditTeacher(t)}>Düzenle</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteTeacher(t.id)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CLASSES */}
        {tab === 'classes' && (
          <div>
            <div className="panel-header">
              <h2 className="panel-title">Sınıflar / Gruplar</h2>
              <button className="btn btn-primary btn-sm" onClick={openAddClass}>+ Yeni Sınıf / Grup</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Başlık</th><th>Kurs</th><th>Öğretmen</th><th>Tarih</th><th>Saatler</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {classes.map(cl => (
                    <tr key={cl.id}>
                      <td><strong>{cl.title}</strong></td>
                      <td>{courses.find(c=>c.id===cl.courseId)?.name||'-'}</td>
                      <td>{cl.teacherName || (teachers.find(t=>t.id===cl.teacherId)?.name)||'-'}</td>
                      <td>{cl.startDate}{cl.endDate?` - ${cl.endDate}`:''}</td>
                      <td>{cl.times || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openEditClass(cl)}>Düzenle</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteClass(cl.id)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        {tab === 'applications' && (
          <div>
            <h2 className="panel-title">Başvurular</h2>
            {applications.length === 0 ? (
              <p style={{ color: 'var(--gray-600)' }}>Hiç başvuru yok.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Ad Soyad</th><th>Telefon</th><th>Mesaj</th><th>Tarih</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {applications.map(a => (
                      <tr key={a.id}>
                        <td>{a.name}</td>
                        <td>{a.phone}</td>
                        <td>{a.message}</td>
                        <td>{a.date}</td>
                        <td><button className="btn btn-sm btn-danger" onClick={() => deleteApplication(a.id)}>Sil</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SITE SETTINGS */}
        {tab === 'settings' && siteSettings && (
          <div>
            <h2 className="panel-title">Site Ayarları</h2>
            <div className="settings-grid">
              <div className="settings-section">
                <h3 className="settings-section-title">Hero Alanı</h3>
                <div className="form-group"><label>Rozet Yazısı</label><input value={settingsForm.heroBadge || ''} onChange={e => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })} /></div>
                <div className="form-group"><label>Başlık (1. Satır)</label><input value={settingsForm.heroTitle || ''} onChange={e => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })} /></div>
                <div className="form-group"><label>Başlık (Vurgulu Kısım)</label><input value={settingsForm.heroHighlight || ''} onChange={e => setSettingsForm({ ...settingsForm, heroHighlight: e.target.value })} /></div>
                <div className="form-group"><label>Alt Başlık</label><textarea rows={2} value={settingsForm.heroSubtitle || ''} onChange={e => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })} /></div>
              </div>

              <div className="settings-section">
                <h3 className="settings-section-title">İstatistikler</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group"><label>İstat 1 - Değer</label><input value={settingsForm.stat1Value || ''} onChange={e => setSettingsForm({ ...settingsForm, stat1Value: e.target.value })} /></div>
                  <div className="form-group"><label>İstat 1 - Etiket</label><input value={settingsForm.stat1Label || ''} onChange={e => setSettingsForm({ ...settingsForm, stat1Label: e.target.value })} /></div>
                  <div className="form-group"><label>İstat 2 - Değer</label><input value={settingsForm.stat2Value || ''} onChange={e => setSettingsForm({ ...settingsForm, stat2Value: e.target.value })} /></div>
                  <div className="form-group"><label>İstat 2 - Etiket</label><input value={settingsForm.stat2Label || ''} onChange={e => setSettingsForm({ ...settingsForm, stat2Label: e.target.value })} /></div>
                  <div className="form-group"><label>İstat 3 - Değer</label><input value={settingsForm.stat3Value || ''} onChange={e => setSettingsForm({ ...settingsForm, stat3Value: e.target.value })} /></div>
                  <div className="form-group"><label>İstat 3 - Etiket</label><input value={settingsForm.stat3Label || ''} onChange={e => setSettingsForm({ ...settingsForm, stat3Label: e.target.value })} /></div>
                </div>
              </div>

              <div className="settings-section">
                <h3 className="settings-section-title">CTA Bölümü</h3>
                <div className="form-group"><label>Başlık</label><input value={settingsForm.ctaTitle || ''} onChange={e => setSettingsForm({ ...settingsForm, ctaTitle: e.target.value })} /></div>
                <div className="form-group"><label>Alt Başlık</label><input value={settingsForm.ctaSubtitle || ''} onChange={e => setSettingsForm({ ...settingsForm, ctaSubtitle: e.target.value })} /></div>
              </div>

              <div className="settings-section">
                <h3 className="settings-section-title">İletişim & Footer</h3>
                <div className="form-group"><label>E-posta</label><input value={settingsForm.footerEmail || ''} onChange={e => setSettingsForm({ ...settingsForm, footerEmail: e.target.value })} /></div>
                <div className="form-group"><label>Telefon</label><input value={settingsForm.footerPhone || ''} onChange={e => setSettingsForm({ ...settingsForm, footerPhone: e.target.value })} /></div>
                <div className="form-group"><label>Adres</label><input value={settingsForm.footerAddress || ''} onChange={e => setSettingsForm({ ...settingsForm, footerAddress: e.target.value })} /></div>
                <div className="form-group"><label>Footer Açıklama</label><textarea rows={2} value={settingsForm.footerDesc || ''} onChange={e => setSettingsForm({ ...settingsForm, footerDesc: e.target.value })} /></div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={saveSettings}>Ayarları Kaydet</button>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab === 'announcements' && (
          <div>
            <h2 className="panel-title">Duyurular</h2>
            <div className="settings-section" style={{ maxWidth: 560, marginBottom: 28 }}>
              <h3 className="settings-section-title">Yeni Duyuru Ekle</h3>
              <div className="form-group"><label>Başlık</label><input placeholder="Duyuru başlığı..." value={announcementForm.title} onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })} /></div>
              <div className="form-group"><label>İçerik</label><textarea rows={3} placeholder="Duyuru içeriği..." value={announcementForm.content} onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })} /></div>
              <div className="form-group">
                <label>Hedef Kitle</label>
                <select value={announcementForm.targetRole} onChange={e => setAnnouncementForm({ ...announcementForm, targetRole: e.target.value })}>
                  <option value="all">Herkese</option>
                  <option value="student">Sadece Öğrenciler</option>
                  <option value="teacher">Sadece Öğretmenler</option>
                </select>
              </div>
              <button className="btn btn-primary btn-sm" onClick={postAnnouncement}>Duyuru Yayınla</button>
            </div>

            {announcements.length === 0 ? (
              <p style={{ color: 'var(--gray-600)' }}>Henüz duyuru yok.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
                {announcements.map(a => (
                  <div key={a.id} className="announcement-admin-card">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ fontSize: '0.97rem' }}>{a.title}</strong>
                        <span className="badge" style={{ fontSize: 11 }}>{a.targetRole === 'all' ? 'Herkese' : a.targetRole === 'student' ? 'Öğrenci' : 'Öğretmen'}</span>
                        <span style={{ fontSize: 12, color: 'var(--gray-600)', marginLeft: 'auto' }}>{a.date}</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: 'var(--gray-600)' }}>{a.content}</p>
                    </div>
                    <button className="btn btn-sm btn-danger" style={{ flexShrink: 0, alignSelf: 'flex-start' }} onClick={() => deleteAnnouncement(a.id)}>Sil</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <div>
            <h2 className="panel-title">Öğrenci Mesajları</h2>
            {adminMessages.length === 0 ? (
              <p style={{ color: 'var(--gray-600)' }}>Henüz mesaj yok.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>
                {adminMessages.map(m => (
                  <div key={m.id} className="settings-section" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <strong>{m.studentName}</strong>
                        <span style={{ fontSize: 12, color: 'var(--gray-600)', marginLeft: 10 }}>{m.date}</span>
                      </div>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteMessage(m.id)}>Sil</button>
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

        {/* GRADES */}
        {tab === 'grades' && (
          <div>
            <div className="panel-header">
              <h2 className="panel-title">Not Yönetimi</h2>
              <button className="btn btn-primary btn-sm" onClick={openAddGrade}>+ Yeni Not Ekle</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Öğrenci</th><th>Kurs</th><th>Sınav Adı</th><th>Not</th><th>Öğretmen</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {grades.map(g => (
                    <tr key={g.id}>
                      <td>{students.find(s => s.id === g.studentId)?.name || '-'}</td>
                      <td>{courses.find(c => c.id === g.courseId)?.name || '-'}</td>
                      <td>{g.examName}</td>
                      <td><strong>{g.grade}/100</strong></td>
                      <td>{teachers.find(t => t.id === g.teacherId)?.name || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openEditGrade(g)}>Düzenle</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteGrade(g.id)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {grades.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 12 }}>Raporlar İndir</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Array.from(new Set(grades.map(g => g.studentId))).map(studentId => {
                    const student = students.find(s => s.id === studentId);
                    return (
                      <button key={studentId} className="btn btn-info btn-sm" onClick={() => downloadReport('grades', studentId)}>
                        📄 {student?.name} - Notlar PDF
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {tab === 'attendance' && (
          <div>
            <div className="panel-header">
              <h2 className="panel-title">Devamsızlık Yönetimi</h2>
              <button className="btn btn-primary btn-sm" onClick={openAddAttendance}>+ Yeni Kayıt Ekle</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Kurs</th><th>Tarih</th><th>Öğretmen</th><th>Öğrenci Sayısı</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {attendance.map(a => (
                    <tr key={a.id}>
                      <td>{courses.find(c => c.id === a.courseId)?.name || '-'}</td>
                      <td>{a.date}</td>
                      <td>{teachers.find(t => t.id === a.teacherId)?.name || '-'}</td>
                      <td>{a.records?.length || 0}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openEditAttendance(a)}>Düzenle</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteAttendance(a.id)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {attendance.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 12 }}>Raporlar İndir</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Array.from(new Set(attendance.flatMap(a => a.records.map(r => r.studentId)))).map(studentId => {
                    const student = students.find(s => s.id === studentId);
                    return (
                      <button key={studentId} className="btn btn-info btn-sm" onClick={() => downloadReport('attendance', studentId)}>
                        📄 {student?.name} - Devamsızlık PDF
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LESSON TOPICS */}
        {tab === 'lessons' && (
          <div>
            <div className="panel-header">
              <h2 className="panel-title">Ders Konuları Yönetimi</h2>
              <button className="btn btn-primary btn-sm" onClick={openAddLesson}>+ Yeni Ders Konusu Ekle</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Kurs</th><th>Konu</th><th>Açıklama</th><th>Tarih</th><th>Öğretmen</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {lessonTopics.map(l => (
                    <tr key={l.id}>
                      <td>{courses.find(c => c.id === l.courseId)?.name || '-'}</td>
                      <td><strong>{l.topic}</strong></td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.description}</td>
                      <td>{l.date}</td>
                      <td>{teachers.find(t => t.id === l.teacherId)?.name || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openEditLesson(l)}>Düzenle</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteLesson(l.id)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* COURSE MODAL */}
      {showCourseModal && (
        <Modal title={editCourse ? 'Kurs Düzenle' : 'Yeni Kurs Ekle'} onClose={() => setShowCourseModal(false)}>
          <div className="form-group"><label>Kurs Adı</label><input value={courseForm.name} onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} /></div>
          <div className="form-group"><label>Açıklama</label><textarea rows={3} value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} /></div>
          <div className="form-group"><label>Seviye</label><input placeholder="A1-B2" value={courseForm.level} onChange={e => setCourseForm({ ...courseForm, level: e.target.value })} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group"><label>Süre</label><input placeholder="6 Ay" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} /></div>
            <div className="form-group"><label>Seans</label><input placeholder="3 Gün/Hafta" value={courseForm.sessions} onChange={e => setCourseForm({ ...courseForm, sessions: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowCourseModal(false)}>İptal</button>
            <button className="btn btn-primary btn-sm" onClick={saveCourse}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* STUDENT MODAL */}
      {showStudentModal && (
        <Modal title={editStudent ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'} onClose={() => setShowStudentModal(false)}>
          <div className="form-group"><label>Ad Soyad</label><input value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} /></div>
          <div className="form-group"><label>E-posta</label><input type="email" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} /></div>
          <div className="form-group"><label>Kullanıcı Adı</label><input value={studentForm.username} onChange={e => setStudentForm({ ...studentForm, username: e.target.value })} disabled={!!editStudent} /></div>
          <div className="form-group"><label>Şifre {editStudent && '(boş bırakırsanız değişmez)'}</label><input type="password" value={studentForm.password} onChange={e => setStudentForm({ ...studentForm, password: e.target.value })} /></div>
          <div className="form-group">
            <label>Kayıtlı Kurslar</label>
            <div className="check-list">
              {courses.map(c => (
                <label key={c.id} className="check-item">
                  <input type="checkbox" checked={studentForm.enrolledCourses.includes(c.id)} onChange={() => toggleCourseCheck(c.id, studentForm.enrolledCourses, v => setStudentForm({ ...studentForm, enrolledCourses: v }))} />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowStudentModal(false)}>İptal</button>
            <button className="btn btn-primary btn-sm" onClick={saveStudent}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* PROGRESS MODAL */}
      {showProgressModal && progressStudent && (
        <Modal title={`${progressStudent.name} - İlerleme Güncelle`} onClose={() => setShowProgressModal(false)}>
          {progressStudent.enrolledCourses.length === 0 ? (
            <p style={{ color: 'var(--gray-600)' }}>Öğrenci hiçbir kursa kayıtlı değil.</p>
          ) : (
            progressStudent.enrolledCourses.map(cid => {
              const course = courses.find(c => c.id === cid);
              return (
                <div key={cid} className="form-group">
                  <label>{course?.name || cid} (%)</label>
                  <input type="number" min={0} max={100} value={progressForm[cid] ?? 0}
                    onChange={e => setProgressForm({ ...progressForm, [cid]: Math.min(100, Math.max(0, Number(e.target.value))) })} />
                  <div className="progress-bar-wrap" style={{ marginTop: 6 }}>
                    <div className="progress-bar" style={{ width: `${progressForm[cid] ?? 0}%` }} />
                  </div>
                </div>
              );
            })
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowProgressModal(false)}>İptal</button>
            <button className="btn btn-success btn-sm" onClick={saveProgress}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* TEACHER MODAL */}
      {showTeacherModal && (
        <Modal title={editTeacher ? 'Öğretmen Düzenle' : 'Yeni Öğretmen Ekle'} onClose={() => setShowTeacherModal(false)}>
          <div className="form-group"><label>Ad Soyad</label><input value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} /></div>
          <div className="form-group"><label>Kullanıcı Adı</label><input value={teacherForm.username} onChange={e => setTeacherForm({ ...teacherForm, username: e.target.value })} disabled={!!editTeacher} /></div>
          <div className="form-group"><label>Şifre {editTeacher && '(boş bırakırsanız değişmez)'}</label><input type="password" value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} /></div>
          <div className="form-group"><label>Uzmanlık</label><input value={teacherForm.specialization} onChange={e => setTeacherForm({ ...teacherForm, specialization: e.target.value })} /></div>
          <div className="form-group"><label>Biyografi</label><textarea rows={2} value={teacherForm.bio} onChange={e => setTeacherForm({ ...teacherForm, bio: e.target.value })} /></div>
          <div className="form-group">
            <label>Atanmış Kurslar</label>
            <div className="check-list">
              {courses.map(c => (
                <label key={c.id} className="check-item">
                  <input type="checkbox" checked={teacherForm.assignedCourses.includes(c.id)} onChange={() => toggleCourseCheck(c.id, teacherForm.assignedCourses, v => setTeacherForm({ ...teacherForm, assignedCourses: v }))} />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowTeacherModal(false)}>İptal</button>
            <button className="btn btn-primary btn-sm" onClick={saveTeacher}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* CLASS MODAL */}
      {showClassModal && (
        <Modal title={editClass ? 'Sınıf/Grup Düzenle' : 'Yeni Sınıf / Grup Ekle'} onClose={() => setShowClassModal(false)}>
          <div className="form-group"><label>Başlık</label><input value={classForm.title} onChange={e => setClassForm({ ...classForm, title: e.target.value })} /></div>
          <div className="form-group"><label>Kurs</label>
            <select value={classForm.courseId} onChange={e => setClassForm({ ...classForm, courseId: e.target.value })}>
              <option value="">Seçin</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Öğretmen</label>
            <select value={classForm.teacherId} onChange={e => { const sel = teachers.find(t=>t.id===e.target.value); setClassForm({ ...classForm, teacherId: e.target.value, teacherName: sel?.name||'' }); }}>
              <option value="">Seçin</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Başlangıç Tarihi</label><input type="date" value={classForm.startDate} onChange={e => setClassForm({ ...classForm, startDate: e.target.value })} /></div>
          <div className="form-group"><label>Bitiş Tarihi</label><input type="date" value={classForm.endDate} onChange={e => setClassForm({ ...classForm, endDate: e.target.value })} /></div>
          <div className="form-group"><label>Saatler</label><input value={classForm.times} onChange={e => setClassForm({ ...classForm, times: e.target.value })} /></div>
          <div className="form-group"><label>Açıklama</label><textarea rows={2} value={classForm.description} onChange={e => setClassForm({ ...classForm, description: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowClassModal(false)}>İptal</button>
            <button className="btn btn-primary btn-sm" onClick={saveClass}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* GRADE MODAL */}
      {showGradeModal && (
        <Modal title={editGrade ? 'Not Düzenle' : 'Yeni Not Ekle'} onClose={() => setShowGradeModal(false)}>
          <div className="form-group"><label>Kurs</label>
            <select value={gradeForm.courseId} onChange={e => setGradeForm({ ...gradeForm, courseId: e.target.value })}>
              <option value="">Seçin</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Öğrenci</label>
            <select value={gradeForm.studentId} onChange={e => setGradeForm({ ...gradeForm, studentId: e.target.value })}>
              <option value="">Seçin</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Sınav Adı</label><input value={gradeForm.examName} onChange={e => setGradeForm({ ...gradeForm, examName: e.target.value })} /></div>
          <div className="form-group"><label>Not (0-100)</label><input type="number" min={0} max={100} value={gradeForm.grade} onChange={e => setGradeForm({ ...gradeForm, grade: e.target.value })} /></div>
          <div className="form-group"><label>Öğretmen</label>
            <select value={gradeForm.teacherId} onChange={e => setGradeForm({ ...gradeForm, teacherId: e.target.value })}>
              <option value="">Seçin</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowGradeModal(false)}>İptal</button>
            <button className="btn btn-primary btn-sm" onClick={saveGrade}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* ATTENDANCE MODAL */}
      {showAttendanceModal && (
        <Modal title={editAttendance ? 'Devamsızlık Kaydını Düzenle' : 'Yeni Devamsızlık Kaydı Ekle'} onClose={() => setShowAttendanceModal(false)}>
          <div className="form-group"><label>Kurs</label>
            <select value={attendanceForm.courseId} onChange={e => setAttendanceForm({ ...attendanceForm, courseId: e.target.value })}>
              <option value="">Seçin</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Tarih</label><input type="date" value={attendanceForm.date} onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })} /></div>
          <div className="form-group"><label>Öğretmen</label>
            <select value={attendanceForm.teacherId} onChange={e => setAttendanceForm({ ...attendanceForm, teacherId: e.target.value })}>
              <option value="">Seçin</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAttendanceModal(false)}>İptal</button>
            <button className="btn btn-primary btn-sm" onClick={saveAttendance}>Kaydet</button>
          </div>
        </Modal>
      )}

      {/* LESSON TOPIC MODAL */}
      {showLessonModal && (
        <Modal title={editLesson ? 'Ders Konusu Düzenle' : 'Yeni Ders Konusu Ekle'} onClose={() => setShowLessonModal(false)}>
          <div className="form-group"><label>Kurs</label>
            <select value={lessonForm.courseId} onChange={e => setLessonForm({ ...lessonForm, courseId: e.target.value })}>
              <option value="">Seçin</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Konu</label><input value={lessonForm.topic} onChange={e => setLessonForm({ ...lessonForm, topic: e.target.value })} /></div>
          <div className="form-group"><label>Açıklama</label><textarea rows={3} value={lessonForm.description} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} /></div>
          <div className="form-group"><label>Tarih</label><input type="date" value={lessonForm.date} onChange={e => setLessonForm({ ...lessonForm, date: e.target.value })} /></div>
          <div className="form-group"><label>Öğretmen</label>
            <select value={lessonForm.teacherId} onChange={e => setLessonForm({ ...lessonForm, teacherId: e.target.value })}>
              <option value="">Seçin</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowLessonModal(false)}>İptal</button>
            <button className="btn btn-primary btn-sm" onClick={saveLesson}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
