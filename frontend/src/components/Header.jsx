import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo-link">
          <span className="logo-icon">YA</span>
          <span className="logo-text">
            <strong>Yiğit's</strong> Akademi
          </span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
          <span /><span /><span />
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link>
          <Link to="/courses" className="nav-link" onClick={() => setMenuOpen(false)}>Kurslar</Link>
          <Link to="/teachers" className="nav-link" onClick={() => setMenuOpen(false)}>Öğretmenler</Link>
          <Link to="/blog" className="nav-link" onClick={() => setMenuOpen(false)}>Blog</Link>
          {user ? (
            <div className="nav-user">
              <Link to="/dashboard" className="nav-link nav-dashboard" onClick={() => setMenuOpen(false)}>
                Panel ({user.name})
              </Link>
              <button className="btn btn-sm btn-danger" onClick={handleLogout}>Çıkış</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="btn btn-sm btn-primary">Giriş Yap</button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
