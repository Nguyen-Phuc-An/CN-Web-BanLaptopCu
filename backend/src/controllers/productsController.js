const products = require('../models/products');

async function create(req, res) {
  try {
    const body = req.body;
    const required = ['seller_id','category_id','title','slug','price'];
    for (const k of required) if (!body[k]) return res.status(400).json({ error: `${k} required` });
    const id = await products.createProduct(body);
    const p = await products.getProductById(id);
    res.status(201).json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function list(req, res) {
  try {
    const { limit, offset } = req.query;
    const rows = await products.listProducts({ limit: limit || 50, offset: offset || 0 });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    const p = await products.getProductById(id);
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const ok = await products.updateProduct(id, req.body);
    if (!ok) return res.status(400).json({ error: 'no fields' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    await products.deleteProduct(id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { create, list, getOne, update, remove };