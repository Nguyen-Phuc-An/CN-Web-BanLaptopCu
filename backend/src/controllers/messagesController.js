const messages = require('../models/messages');

async function send(req, res) {
  try {
    const { from_user_id, to_user_id, product_id, content } = req.body;
    if (!from_user_id || !to_user_id || !content) return res.status(400).json({ error: 'from_user_id, to_user_id, content required' });
    const id = await messages.sendMessage({ from_user_id, to_user_id, product_id, content });
    res.status(201).json({ id });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function conversation(req, res) {
  try {
    const userA = Number(req.params.userA);
    const userB = Number(req.params.userB);
    const rows = await messages.listConversation(userA, userB, req.query);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function markRead(req, res) {
  try {
    const ids = req.body.ids || [];
    await messages.markAsRead(ids);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { send, conversation, markRead };