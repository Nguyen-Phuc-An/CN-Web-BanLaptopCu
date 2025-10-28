const db = require('../db');

async function createProduct({ seller_id, category_id, title, slug, description, condition, price, currency = 'VND', stock = 1 }) {
  const [res] = await db.query(
    `INSERT INTO products (seller_id, category_id, title, slug, description, \`condition\`, price, currency, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [seller_id, category_id, title, slug, description, condition, price, currency, stock]
  );
  return res.insertId;
}

async function getProductById(id) {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0] || null;
}

async function listProducts({ limit = 50, offset = 0 } = {}) {
  const [rows] = await db.query('SELECT * FROM products ORDER BY posted_at DESC LIMIT ? OFFSET ?', [Number(limit), Number(offset)]);
  return rows;
}

async function updateProduct(id, fields = {}) {
  const sets = []; const vals = [];
  const allowed = ['seller_id','category_id','title','slug','description','condition','price','currency','stock'];
  for (const k of allowed) {
    if (fields[k] !== undefined) { sets.push(`${k} = ?`); vals.push(fields[k]); }
  }
  if (!sets.length) return false;
  vals.push(id);
  await db.query(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`, vals);
  return true;
}

async function deleteProduct(id) {
  await db.query('DELETE FROM products WHERE id = ?', [id]);
  return true;
}

module.exports = { createProduct, getProductById, listProducts, updateProduct, deleteProduct };