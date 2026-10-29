const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, trim: true, maxlength: 80, default: 'New Chat' },
    messages: [{
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true, maxlength: 20000 },
      timestamp: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

discussionSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('discussion', discussionSchema);