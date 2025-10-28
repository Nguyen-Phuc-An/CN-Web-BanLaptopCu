const db = require('../db');

async function addToWishlist(user_id, product_id) {
  await db.query('INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)', [user_id, product_id]);
  return true;
}

async function removeFromWishlist(user_id, product_id) {
  await db.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
  return true;
}

async function listWishlist(user_id) {
  const [rows] = await db.query('SELECT w.*, p.title, p.price FROM wishlists w JOIN products p ON w.product_id = p.id WHERE w.user_id = ? ORDER BY w.created_at DESC', [user_id]);
  return rows;
}

module.exports = { addToWishlist, removeFromWishlist, listWishlist };