// backend/src/utils/logAccess.js
const AccessLog = require('../models/AccessLog');
const ACTIONS = require('../models/AccessLog').ACTIONS;

/**
 * logAccess(req, { action, paperId, status, details })
 * - req may be undefined (e.g., background jobs) — function will safely handle it.
 */
async function logAccess(req = {}, { action, paperId, status = 'success', details = '' } = {}) {
  if (!action || !ACTIONS.includes(action)) {
    // fallback to access_attempt if action invalid or missing
    action = 'access_attempt';
  }

  const payload = {
    action,
    paperId,
    status,
    details,
    ipAddress: req.ip || (req.headers && req.headers['x-forwarded-for']) || undefined,
    userAgent: req.get ? req.get('User-Agent') : (req.headers && req.headers['user-agent']) || undefined,
    sessionId: req.session ? req.session.id : undefined
  };

  // attach userId only if present to avoid validation errors
  if (req.user && req.user._id) payload.userId = req.user._id;

  try {
    await AccessLog.create(payload);
  } catch (err) {
    // Don't crash the app because of logging failure — print for debugging
    console.error('logAccess error:', err);
  }
}

module.exports = logAccess;
