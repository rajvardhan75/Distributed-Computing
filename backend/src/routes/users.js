const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/users/search?q=
router.get('/search', requireAuth, async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ users: [] });
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const me = req.session.userId;
  const users = await User.find({
    _id: { $ne: me },
    $or: [{ name: re }, { email: re }]
  })
    .select('_id name email role')
    .limit(20)
    .lean();
  return res.json({ users });
});

module.exports = router;