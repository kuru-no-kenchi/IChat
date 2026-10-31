const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const skipRateLimit = () => process.env.DISABLE_RATE_LIMIT === 'true';

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipRateLimit,
    keyGenerator: (req) =>
        req.user?._id ? req.user._id.toString() : ipKeyGenerator(req.ip),
    message: { error: 'Too many messages. Please wait a moment.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipRateLimit,
    message: { error: 'Too many attempts. Try again later.' },
});

module.exports = { chatLimiter, authLimiter, skipRateLimit };