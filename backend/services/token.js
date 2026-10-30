require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');

const ACCESS_TTL = '15m';
const REFRESH_DAYS = 7;
const REUSE_GRACE_MS = 10 * 1000; // tolerates two requests racing with the same cookie
const COOKIE_NAME = 'refresh_token';

const hash = (t) => crypto.createHash('sha256').update(t).digest('hex');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === 'true'
    : process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAMESITE || 'strict',
  path: process.env.COOKIE_PATH || '/users',
});

const signAccessToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });

async function issueRefreshToken(res, userId, family = crypto.randomUUID()) {
  const token = crypto.randomBytes(48).toString('hex');
  await RefreshToken.create({
    user: userId,
    tokenHash: hash(token),
    family,
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions(),
    maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
  });
}

// Validates the cookie, retires it, and sets a fresh one. Returns the user id or null.
async function rotateRefreshToken(req, res) {
  const token = req.cookies?.[COOKIE_NAME];
  if (typeof token !== 'string' || !token) return null;

  const record = await RefreshToken.findOne({ tokenHash: hash(token) });
  if (!record || record.expiresAt < new Date()) return null;

  if (record.usedAt) {
    // An already-used token: a near-simultaneous retry is tolerated,
    // anything later looks like theft, so the whole family is revoked.
    if (Date.now() - record.usedAt.getTime() > REUSE_GRACE_MS) {
      await RefreshToken.deleteMany({ family: record.family });
    }
    return null;
  }

  // Atomic claim, so two parallel requests can't both succeed
  const claimed = await RefreshToken.findOneAndUpdate(
    { _id: record._id, usedAt: null },
    { usedAt: new Date() }
  );
  if (!claimed) return null;

  await issueRefreshToken(res, record.user, record.family);
  return record.user;
}

async function revokeSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (typeof token !== 'string' || !token) return;
  const record = await RefreshToken.findOne({ tokenHash: hash(token) });
  if (record) await RefreshToken.deleteMany({ family: record.family });
}

const clearRefreshCookie = (res) => res.clearCookie(COOKIE_NAME, cookieOptions());

module.exports = {
  signAccessToken, issueRefreshToken, rotateRefreshToken,
  revokeSession, clearRefreshCookie,
};