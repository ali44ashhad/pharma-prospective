// backend/src/routes/papers.js
const express = require('express');
const {
  uploadPaper,
  getAllPapers,
  getPaperById,
  updatePaper,
  deletePaper,
  getPaperStats
} = require('../controllers/paperController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validatePaperCreation } = require('../middleware/validation');
const { upload, handleUploadErrors } = require('../middleware/upload');

const router = express.Router();

// All paper routes require authentication
router.use(authenticate);

// Paper management routes
router.post('/', 
  requireAdmin, 
  upload.single('file'), 
  handleUploadErrors,
  validatePaperCreation, 
  uploadPaper
);

router.get('/', getAllPapers);
router.get('/stats', requireAdmin, getPaperStats);
router.get('/:id', getPaperById);
router.put('/:id', updatePaper);
router.delete('/:id', deletePaper);

module.exports = router;