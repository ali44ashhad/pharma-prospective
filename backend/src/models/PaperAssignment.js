// backend/src/models/PaperAssignment.js
const mongoose = require('mongoose');

const paperAssignmentSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a paper can only be assigned once to a user
paperAssignmentSchema.index({ paperId: 1, userId: 1 }, { unique: true });

// Safe export to avoid OverwriteModelError
module.exports = mongoose.models.PaperAssignment || mongoose.model('PaperAssignment', paperAssignmentSchema);