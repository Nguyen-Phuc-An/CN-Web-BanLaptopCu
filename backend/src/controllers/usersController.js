const bcrypt = require('bcryptjs');
const users = require('../models/users');

async function create(req, res) {
  try {
    const { email, name, password, role, phone } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'email, name, password required' });
    const exist = await users.getUserByEmail(email);
    if (exist) return res.status(409).json({ error: 'email exists' });
    const hash = bcrypt.hashSync(password, 10);
    const id = await users.createUser({ email, name, passwordHash: hash, role, phone });
    const user = await users.getUserById(id);
    res.status(201).json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    const u = await users.getUserById(id);
    if (!u) return res.status(404).json({ error: 'not found' });
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, password, role, phone } = req.body;
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (password !== undefined) fields.passwordHash = bcrypt.hashSync(password, 10);
    if (role !== undefined) fields.role = role;
    if (phone !== undefined) fields.phone = phone;
    const ok = await users.updateUser(id, fields);
    if (!ok) return res.status(400).json({ error: 'no fields' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    await users.deleteUser(id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { create, getOne, update, remove };