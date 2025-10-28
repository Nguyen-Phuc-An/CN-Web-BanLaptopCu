const orders = require('../models/orders');

async function create(req, res) {
  try {
    const payload = req.body; // { user_id, shipping_address, payment_method, items: [{product_id,quantity,unit_price}] }
    if (!payload.user_id || !Array.isArray(payload.items) || !payload.items.length) return res.status(400).json({ error: 'user_id and items required' });
    const id = await orders.createOrder(payload);
    const order = await orders.getOrderById(id);
    res.status(201).json(order);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    const o = await orders.getOrderById(id);
    if (!o) return res.status(404).json({ error: 'not found' });
    res.json(o);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function listForUser(req, res) {
  try {
    const userId = Number(req.params.userId);
    const rows = await orders.listOrdersForUser(userId, req.query);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function updateStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    await orders.updateOrderStatus(id, status);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    await orders.deleteOrder(id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { create, getOne, listForUser, updateStatus, remove };