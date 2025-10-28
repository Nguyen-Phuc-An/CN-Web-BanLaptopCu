import React, { useState } from 'react';
import { login, register } from '../services/auth';
import '../styles/AuthModal.css'; 

export default function AuthModal({ mode = 'login', onClose, onAuthSuccess }) {
  const [m, setMode] = useState(mode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (m === 'login') {
        const res = await login({ email, password });
        onAuthSuccess && onAuthSuccess(res);
      } else {
        if (!phone || !address) {
          setError('Phone và Address là bắt buộc khi đăng ký');
          setLoading(false);
          return;
        }
        const res = await register({ email, name, password, phone, address });
        onAuthSuccess && onAuthSuccess(res);
      }
      onClose && onClose();
    } catch (err) {
      setError(err?.error || err?.message || 'Lỗi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-modal">
      <form onSubmit={handleSubmit}>
        <h3>{m === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h3>

        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>

        {m === 'register' && (
          <label>
            Tên
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </label>
        )}

        <label>
          Mật khẩu
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>

        {m === 'register' && (
          <>
            <label>
              Số điện thoại
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required />
            </label>

            <label>
              Địa chỉ
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} required />
            </label>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : (m === 'login' ? 'Đăng nhập' : 'Đăng ký')}
          </button>

          <button type="button" onClick={() => setMode(m === 'login' ? 'register' : 'login')}>
            {m === 'login' ? 'Chuyển sang đăng ký' : 'Chuyển sang đăng nhập'}
          </button>
        </div>
      </form>
    </div>
  );
}