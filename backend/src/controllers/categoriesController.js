const categories = require('../models/categories');

async function create(req, res) {
  try {
    const { name, slug, parent_id } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
    const id = await categories.createCategory({ name, slug, parent_id: parent_id || null });
    const c = await categories.getCategoryById(id);
    res.status(201).json(c);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function list(req, res) {
  try {
    const rows = await categories.listCategories();
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    const c = await categories.getCategoryById(id);
    if (!c) return res.status(404).json({ error: 'not found' });
    res.json(c);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, slug, parent_id } = req.body;
    const ok = await categories.updateCategory(id, { name, slug, parent_id });
    if (!ok) return res.status(400).json({ error: 'no fields' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    await categories.deleteCategory(id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { create, list, getOne, update, remove };