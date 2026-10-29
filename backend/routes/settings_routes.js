const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authMiddleware } = require('../services/jwt');

const LANGUAGES = ['en', 'fr', 'ar'];

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user.preferences);
  } catch (err) {
    console.error('Get preferences failed:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const updatePreferences = async (req, res) => {
  try {
    const { language, darkTheme, conversationHistory } = req.body ?? {};
    const updates = {};

    if (language !== undefined) {
      if (!LANGUAGES.includes(language)) return res.status(400).json({ error: 'Invalid language.' });
      updates['preferences.language'] = language;
    }
    if (darkTheme !== undefined) {
      if (typeof darkTheme !== 'boolean') return res.status(400).json({ error: 'darkTheme must be true or false.' });
      updates['preferences.darkTheme'] = darkTheme;
    }
    if (conversationHistory !== undefined) {
      if (typeof conversationHistory !== 'boolean') {
        return res.status(400).json({ error: 'conversationHistory must be true or false.' });
      }
      updates['preferences.conversationHistory'] = conversationHistory;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid preferences provided.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('preferences');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json(user.preferences);
  } catch (err) {
    console.error('Update preferences failed:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

router.patch('/', updatePreferences);
router.put('/', updatePreferences);

module.exports = router;