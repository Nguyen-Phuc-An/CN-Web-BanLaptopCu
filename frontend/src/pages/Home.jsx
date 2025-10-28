import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/products';
import '../styles/Home.css';

export default function Home() {
  const [products, setProducts] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await getProducts();
        if (mounted) setProducts(rows || []);
      } catch (e) {
        if (mounted) setErr(e.message || 'Lỗi tải sản phẩm');
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (err) return <p className="error">{err}</p>;
  if (products === null) return <p>Đang tải...</p>;
  if (!products.length) return <p>Chưa có sản phẩm.</p>;

  return (
    <section>
      <h3>Sản phẩm mới</h3>
      <div id="products" className="grid">
        {products.map(p => (
          <div className="card" key={p.id}>
            <img src={p.url || '/uploads/products/default.jpg'} alt={p.title} />
            <h4>{p.title}</h4>
            <p>{Number(p.price).toLocaleString('vi-VN')} {p.currency || 'VND'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}