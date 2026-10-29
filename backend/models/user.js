const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true, maxlength: 50 },
    last_name: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },
    password: { type: String, required: true, select: false },
    selectedBot: { type: String, enum: ['bot1', 'bot2'] },  // use your real bot values
    personal_photo: { type: String },
    preferences: {
      language: { type: String, enum: ['en', 'fr', 'ar'], default: 'en' }, // your supported languages
      darkTheme: { type: Boolean, default: false },
      conversationHistory: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;