import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Header({ onOpenAuth, onLogout }) {
  const { token } = useContext(AuthContext);

  function getUserLabel() {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return `#${payload.id} (${payload.role})`;
    } catch {
      return 'Đã đăng nhập';
    }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <h1 className="brand">Bán Laptop Cũ</h1>
        <nav className="nav">
          {token ? (
            <>
              <span className="user-info">{getUserLabel()}</span>
              <button className="btn" onClick={onLogout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => onOpenAuth('login')}>Đăng nhập</button>
              <button className="btn" onClick={() => onOpenAuth('register')}>Đăng ký</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}