
const express = require('express');
const { authMiddleware } = require('../services/jwt');
const router = express.Router();
const { registerUser, loginUser, changePassword, deleteUser, refresh, logout, logoutAll } = require('../controllers/authentification');
const { authLimiter } = require('../services/rateLimit');
const { rateLimit } = require('express-rate-limit')

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many requests. Try again later.' },
});

// Routes
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/refresh', refreshLimiter, refresh)
router.patch('/change/password', authMiddleware, changePassword);
router.delete('/delete/me', authMiddleware, deleteUser);
router.post('/logout', logout);
router.post('/logout-all', authMiddleware, logoutAll);

module.exports = router;
