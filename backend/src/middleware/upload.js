// backend/src/middleware/upload.js
const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pharma-research/papers',
    resource_type: 'raw', // This ensures PDFs are handled correctly
    format: async (req, file) => {
      // Preserve original format
      const ext = file.originalname.split('.').pop();
      return ext || 'pdf';
    },
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const originalName = file.originalname.split('.')[0];
      return `${originalName}-${timestamp}-${randomString}`;
    }
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Error handling middleware for multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = { upload, handleUploadErrors };