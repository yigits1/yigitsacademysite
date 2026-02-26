import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const API = 'https://yigitsacademysite-production.up.railway.app/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', message: '' });
  const [regSuccess, setRegSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { ...form, role });
      if (res.data.success) {
        login(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = { admin: 'Yönetici', teacher: 'Öğretmen', student: 'Öğrenci' };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon-sm">YA</span>
            <h2>Yiğit's Akademi</h2>
          </div>
          <p>Hesabınıza giriş yapın</p>
        </div>

        <div className="role-tabs">
          {['student', 'teacher', 'admin'].map(r => (
            <button
              key={r}
              className={`role-tab ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
              type="button"
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>

        {showRegister ? (
          <form onSubmit={async e => {
            e.preventDefault();
            setRegSuccess('');
            try {
              await axios.post(`${API}/applications`, regForm);
              setRegSuccess('Başvurunuz alındı. En kısa sürede dönüş yapılacaktır.');
              setRegForm({ name: '', phone: '', message: '' });
            } catch (err) {
              setError('Başvuru gönderilemedi. Lütfen tekrar deneyin.');
            }
          }}>
            {error && <div className="alert alert-error">{error}</div>}
            {regSuccess && <div className="alert alert-success">{regSuccess}</div>}
            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                value={regForm.name}
                onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input
                type="text"
                value={regForm.phone}
                onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Mesaj</label>
              <textarea
                value={regForm.message}
                onChange={e => setRegForm({ ...regForm, message: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Başvur
            </button>
            <div className="form-footer">
              <button type="button" className="btn-link" onClick={() => setShowRegister(false)}>
                Giriş yap
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <input
                type="text"
                placeholder="Kullanıcı adınızı girin"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <input
                type="password"
                placeholder="Şifrenizi girin"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
            {role === 'student' && (
              <div className="form-footer">
                <button type="button" className="btn-link" onClick={() => setShowRegister(true)}>
                  Kayıt Ol
                </button>
              </div>
            )}
          </form>
        )}


      </div>
    </div>
  );
}
