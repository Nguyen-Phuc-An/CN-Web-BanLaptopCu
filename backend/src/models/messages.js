const db = require('../db');

async function sendMessage({ from_user_id, to_user_id, product_id = null, content }) {
  const [res] = await db.query('INSERT INTO messages (from_user_id, to_user_id, product_id, content) VALUES (?, ?, ?, ?)', [from_user_id, to_user_id, product_id, content]);
  return res.insertId;
}

async function listConversation(userA, userB, { limit = 100 } = {}) {
  const [rows] = await db.query(
    `SELECT m.*, fu.name as from_name, tu.name as to_name FROM messages m
     LEFT JOIN users fu ON m.from_user_id = fu.id
     LEFT JOIN users tu ON m.to_user_id = tu.id
     WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)
     ORDER BY created_at ASC LIMIT ?`,
    [userA, userB, userB, userA, Number(limit)]
  );
  return rows;
}

async function markAsRead(messageIds = []) {
  if (!messageIds.length) return false;
  await db.query(`UPDATE messages SET is_read = 1 WHERE id IN (?)`, [messageIds]);
  return true;
}

module.exports = { sendMessage, listConversation, markAsRead };