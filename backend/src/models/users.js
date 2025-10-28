const db = require('../db');

async function createUser({ email, name, passwordHash, role = 'customer', phone = null }) {
  const [res] = await db.query(
    'INSERT INTO users (email, name, password, role, phone) VALUES (?, ?, ?, ?, ?)',
    [email, name, passwordHash, role, phone]
  );
  return res.insertId;
}

async function getUserById(id) {
  const [rows] = await db.query('SELECT id, email, name, role, phone, created_at, updated_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function getUserByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function updateUser(id, { name, passwordHash, role, phone }) {
  const sets = [];
  const vals = [];
  if (name !== undefined) { sets.push('name = ?'); vals.push(name); }
  if (passwordHash !== undefined) { sets.push('password = ?'); vals.push(passwordHash); }
  if (role !== undefined) { sets.push('role = ?'); vals.push(role); }
  if (phone !== undefined) { sets.push('phone = ?'); vals.push(phone); }
  if (!sets.length) return false;
  vals.push(id);
  await db.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, vals);
  return true;
}

async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
  return true;
}

module.exports = { createUser, getUserById, getUserByEmail, updateUser, deleteUser };
