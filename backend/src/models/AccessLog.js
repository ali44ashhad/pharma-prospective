// // backend/src/models/AccessLog.js
// const mongoose = require('mongoose');

// const accessLogSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   paperId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Paper'
//   },
//   action: {
//     type: String,
//     enum: ['view', 'download_attempt', 'print_attempt', 'login', 'logout'],
//     required: true
//   },
//   ipAddress: {
//     type: String,
//     required: true
//   },
//   userAgent: String,
//   sessionId: String,
//   resourceUrl: String,
//   status: {
//     type: String,
//     enum: ['success', 'failed', 'blocked'],
//     default: 'success'
//   },
//   details: String
// }, {
//   timestamps: true
// });

// // Index for faster queries
// accessLogSchema.index({ userId: 1, createdAt: -1 });
// accessLogSchema.index({ paperId: 1, createdAt: -1 });

// module.exports = mongoose.model('AccessLog', accessLogSchema);

// backend/src/models/AccessLog.js
const mongoose = require('mongoose');

const ACTIONS = [
  'view',
  'download_attempt',
  'print_attempt',
  'login',
  'logout',
  // application-specific actions
  'paper_upload',
  'papers_list_view',
  'paper_view',
  'paper_update',
  'paper_delete',
  'access_attempt', // e.g., blocked/unauthenticated access attempts
  // admin actions
  'user_creation',
  'user_update',
  'password_reset'
];

const accessLogSchema = new mongoose.Schema({
  // make userId optional to allow logging of unauthenticated attempts
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper'
  },
  action: {
    type: String,
    enum: ACTIONS,
    required: true
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: String,
  sessionId: String,
  resourceUrl: String,
  status: {
    type: String,
    enum: ['success', 'failed', 'blocked'],
    default: 'success'
  },
  details: String
}, {
  timestamps: true
});

// indexes
accessLogSchema.index({ userId: 1, createdAt: -1 });
accessLogSchema.index({ paperId: 1, createdAt: -1 });

module.exports = mongoose.models.AccessLog || mongoose.model('AccessLog', accessLogSchema);
module.exports.ACTIONS = ACTIONS;

