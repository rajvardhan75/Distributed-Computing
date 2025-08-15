const express = require('express');
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// helper: is admin?
async function isAdmin(userId) {
  const u = await User.findById(userId).select('role');
  return u && u.role === 'admin';
}

// POST /api/feedback  -> create or update your review for someone
// body: { revieweeId, rating (1-5), comment }
router.post('/', requireAuth, async (req, res) => {
  try {
    const reviewerId = req.session.userId;
    const { revieweeId, rating, comment } = req.body || {};
    if (!revieweeId || !rating) return res.status(400).json({ message: 'revieweeId and rating are required' });
    if (reviewerId === revieweeId) return res.status(400).json({ message: 'You cannot review yourself' });

    const target = await User.findById(revieweeId).select('_id');
    if (!target) return res.status(404).json({ message: 'Reviewee not found' });

    const doc = await Feedback.findOneAndUpdate(
      { reviewer: reviewerId, reviewee: revieweeId },
      { $set: { rating: Math.max(1, Math.min(5, Number(rating))), comment: comment || '' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('reviewer', 'name email').populate('reviewee', 'name email');

    return res.status(201).json({ message: 'Saved', feedback: doc });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: 'Duplicate review' });
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/feedback/received/:userId?page=&limit=
// list reviews for a user + summary
router.get('/received/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const match = { reviewee: new mongoose.Types.ObjectId(userId) };

    const [items, total, summary] = await Promise.all([
      Feedback.find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reviewer', 'name email')
        .lean(),
      Feedback.countDocuments(match),
      Feedback.aggregate([
        { $match: match },
        { $group: { _id: '$reviewee', count: { $sum: 1 }, avg: { $avg: '$rating' } } }
      ])
    ]);

    const meta = {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      avgRating: summary[0] ? Number(summary[0].avg.toFixed(2)) : 0,
      count: summary[0] ? summary[0].count : 0
    };

    return res.json({ reviews: items, meta });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/feedback/mine/:userId -> the review YOU wrote for :userId (if any)
router.get('/mine/:userId', requireAuth, async (req, res) => {
  try {
    const reviewerId = req.session.userId;
    const { userId } = req.params;
    const fb = await Feedback.findOne({ reviewer: reviewerId, reviewee: userId }).lean();
    return res.json({ feedback: fb || null });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/feedback/given -> all reviews you have authored
router.get('/given', requireAuth, async (req, res) => {
  try {
    const reviewerId = req.session.userId;
    const items = await Feedback.find({ reviewer: reviewerId })
      .sort({ updatedAt: -1 })
      .populate('reviewee', 'name email')
      .lean();
    return res.json({ reviews: items });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/feedback/:id -> author or admin can delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;
    const doc = await Feedback.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const admin = await isAdmin(userId);
    if (!admin && String(doc.reviewer) !== String(userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await doc.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;