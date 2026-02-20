const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  secretCode: {
    type: String,
    required: true,
    minlength: 4
  },
  category: {
    type: String,
    enum: ['Academic', 'Stress', 'Love', 'Funny', 'Secret', 'Other'],
    default: 'Other'
  },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anonymousId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Confession', confessionSchema);
