const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
   reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
   reviewee: { type: Schema.Types.ObjectId, ref: 'User' },
   rating: { type: Number,min: 1, max: 5,   required: true },
   comment: { type: String, required: true },
   createdAt: { type: Date, default: Date.now },
});

feedbackSchema.index({ reviewer: 1, reviewee: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);