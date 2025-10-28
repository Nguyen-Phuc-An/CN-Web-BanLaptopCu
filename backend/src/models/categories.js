const db = require('../db');

async function createCategory({ name, slug, parent_id = null }) {
  const [res] = await db.query('INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)', [name, slug, parent_id]);
  return res.insertId;
}

async function getCategoryById(id) {
  const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
}

async function listCategories() {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY parent_id IS NOT NULL, name');
  return rows;
}

async function updateCategory(id, { name, slug, parent_id }) {
  const sets = []; const vals = [];
  if (name !== undefined) { sets.push('name = ?'); vals.push(name); }
  if (slug !== undefined) { sets.push('slug = ?'); vals.push(slug); }
  if (parent_id !== undefined) { sets.push('parent_id = ?'); vals.push(parent_id); }
  if (!sets.length) return false;
  vals.push(id);
  await db.query(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`, vals);
  return true;
}

async function deleteCategory(id) {
  await db.query('DELETE FROM categories WHERE id = ?', [id]);
  return true;
}

module.exports = { createCategory, getCategoryById, listCategories, updateCategory, deleteCategory };