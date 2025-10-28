const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usersModel = require('../models/users');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function userSafe(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

async function register(req, res) {
  try {
    const { email, name, password, phone, address, role } = req.body || {};
    // validate required fields
    if (!email || !name || !password || !phone || !address) {
      return res.status(400).json({ error: 'email, name, password, phone and address are required' });
    }

    // normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await usersModel.getUserByEmail(normalizedEmail);
    if (existing) return res.status(409).json({ error: 'email exists' });

    const hash = bcrypt.hashSync(password, 12);

    // createUser should accept these fields; adjust if your model expects different names
    const insertId = await usersModel.createUser({
      email: normalizedEmail,
      name: String(name).trim(),
      passwordHash: hash,   // if your model expects 'password' instead, change accordingly
      role: role || 'customer',
      phone: String(phone).trim(),
      address: String(address).trim()
    });

    const user = await usersModel.getUserById(insertId);
    res.status(201).json(userSafe(user));
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: err.message || 'server error' });
  }
}

async function login(req, res) {
  try {
    // debug logs to help trace incoming data when needed
    console.log('AUTH LOGIN headers:', req.headers && req.headers['content-type']);
    console.log('AUTH LOGIN body:', req.body);

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await usersModel.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    let ok = false;
    try {
      // detect bcrypt hash (common prefix $2a/$2b/$2y)
      if (typeof user.password === 'string' && /^\$2[aby]\$/.test(user.password)) {
        ok = bcrypt.compareSync(password, user.password);
      } else {
        // legacy plaintext password fallback (accept but try to upgrade to bcrypt)
        ok = password === user.password;
        if (ok) {
          console.warn(`Legacy plaintext password detected for user ${email}. Upgrading to bcrypt hash.`);
          try {
            const newHash = bcrypt.hashSync(password, 12);
            // attempt to update password hash if model provides such method
            if (typeof usersModel.updatePassword === 'function') {
              await usersModel.updatePassword(user.id, newHash);
            } else if (typeof usersModel.updateUser === 'function') {
              // generic updateUser may accept partial update object
              await usersModel.updateUser(user.id, { password: newHash });
            } else {
              console.warn('No updatePassword/updateUser method found on usersModel; skipping auto-upgrade.');
            }
          } catch (upErr) {
            console.error('Error upgrading plaintext password to bcrypt:', upErr);
          }
        }
      }
    } catch (cmpErr) {
      console.error('Error comparing password:', cmpErr);
      ok = false;
    }

    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const payload = { id: user.id, role: user.role, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token, user: userSafe(user) });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login };