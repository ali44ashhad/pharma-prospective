// // models/User.js
// const userSchema = {
//   _id: ObjectId,
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ['super_admin', 'admin', 'researcher', 'reviewer'], 
//     default: 'researcher' 
//   },
//   isActive: { type: Boolean, default: true },
//   firstName: String,
//   lastName: String,
//   department: String,
//   lastLogin: Date,
//   totpSecret: String, // For 2FA
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// };

// // models/Paper.js
// const paperSchema = {
//   _id: ObjectId,
//   title: { type: String, required: true },
//   abstract: String,
//   authors: [String],
//   tags: [String],
//   confidentialityLevel: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'critical'],
//     default: 'medium'
//   },
//   fileUrl: String, // Cloudinary/S3 URL
//   fileKey: String, // Cloudinary public_id or S3 key
//   fileName: String,
//   fileSize: Number,
//   uploadedBy: { type: ObjectId, ref: 'User' },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   version: { type: Number, default: 1 }
// };

// // models/AccessLog.js
// const accessLogSchema = {
//   _id: ObjectId,
//   userId: { type: ObjectId, ref: 'User' },
//   paperId: { type: ObjectId, ref: 'Paper' },
//   action: {
//     type: String,
//     enum: ['view', 'download_attempt', 'print_attempt']
//   },
//   ipAddress: String,
//   userAgent: String,
//   sessionId: String,
//   timestamp: { type: Date, default: Date.now }
// };

// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required.']
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'researcher', 'reviewer'],
    default: 'researcher'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  lastLogin: {
    type: Date
  },
  totpSecret: {
    type: String // For two-factor authentication (2FA)
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  const fn = this.firstName || '';
  const ln = this.lastName || '';
  return `${fn}${fn && ln ? ' ' : ''}${ln}`.trim();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  try {
    // Only hash if the password is being modified
    if (!this.isModified('passwordHash')) return next();
    
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
    const hash = await bcrypt.hash(this.passwordHash, rounds);
    this.passwordHash = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.checkPassword = async function(plainPassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Static helper to create a password hash
userSchema.statics.hashPassword = async function(plainPassword) {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
  return bcrypt.hash(plainPassword, rounds);
};

// Index on email
userSchema.index({ email: 1 });

// Safe export to avoid OverwriteModelError on hot reloads
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
