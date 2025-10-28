const db = require('../db');

async function createOrUpdateReview({ product_id, user_id, rating, title = null, body = null }) {
  // upsert: nếu đã có thì update
  const [res] = await db.query(
    `INSERT INTO reviews (product_id, user_id, rating, title, body)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), title = VALUES(title), body = VALUES(body), updated_at = CURRENT_TIMESTAMP`,
    [product_id, user_id, rating, title, body]
  );
  return res.insertId || true;
}

async function getReviewsByProduct(productId) {
  const [rows] = await db.query('SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY created_at DESC', [productId]);
  return rows;
}

async function deleteReview(product_id, user_id) {
  await db.query('DELETE FROM reviews WHERE product_id = ? AND user_id = ?', [product_id, user_id]);
  return true;
}

module.exports = { createOrUpdateReview, getReviewsByProduct, deleteReview };