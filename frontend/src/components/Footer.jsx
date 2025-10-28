import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Bán Laptop Cũ — Liên hệ: <a href="mailto:info@example.com">info@example.com</a></p>
      </div>
    </footer>
  );
}