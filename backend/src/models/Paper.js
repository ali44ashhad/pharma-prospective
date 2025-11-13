// // backend/src/models/Paper.js
// const mongoose = require('mongoose');

// const paperSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   abstract: {
//     type: String,
//     required: true
//   },
//   authors: [{
//     type: String,
//     required: true
//   }],
//   tags: [String],
//   confidentialityLevel: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'critical'],
//     default: 'medium'
//   },
//   fileUrl: {
//     type: String,
//     required: true
//   },
//   fileKey: {
//     type: String,
//     required: true
//   },
//   fileName: {
//     type: String,
//     required: true
//   },
//   fileSize: {
//     type: Number,
//     required: true
//   },
//   fileType: {
//     type: String,
//     default: 'application/pdf'
//   },
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   version: {
//     type: Number,
//     default: 1
//   }
// }, {
//   timestamps: true
// });

// // Index for search functionality
// paperSchema.index({ title: 'text', abstract: 'text', authors: 'text', tags: 'text' });

// module.exports = mongoose.model('Paper', paperSchema);

// backend/src/models/Paper.js
const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  abstract: {
    type: String,
    required: true
  },
  // ensure at least one author
  authors: {
    type: [String],
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: 'A paper must have at least one author.'
    }
  },
  tags: [String],
  confidentialityLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileKey: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
    // optionally: add validation to limit size: max 50MB etc.
  },
  fileType: {
    type: String,
    default: 'application/pdf'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// text index that weights title higher than abstract/tags/authors
paperSchema.index({ title: 'text', abstract: 'text', authors: 'text', tags: 'text' }, { weights: { title: 5, abstract: 2, authors: 3, tags: 1 } });

// safe model export to avoid OverwriteModelError when nodemon reloads
module.exports = mongoose.models.Paper || mongoose.model('Paper', paperSchema);
