const reviews = require('../models/reviews');

async function createOrUpdate(req, res) {
  try {
    const { product_id, user_id, rating, title, body } = req.body;
    if (!product_id || !user_id || !rating) return res.status(400).json({ error: 'product_id, user_id, rating required' });
    await reviews.createOrUpdateReview({ product_id, user_id, rating, title, body });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function listByProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    const rows = await reviews.getReviewsByProduct(productId);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function remove(req, res) {
  try {
    const { productId, userId } = req.params;
    await reviews.deleteReview(Number(productId), Number(userId));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { createOrUpdate, listByProduct, remove };