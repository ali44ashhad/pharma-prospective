// backend/src/middleware/validation.js
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserCreation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('department')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Department is required'),
  body('role')
    .isIn(['admin', 'researcher', 'reviewer'])
    .withMessage('Valid role is required'),
  handleValidationErrors
];

const validatePaperCreation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),
  body('abstract')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Abstract must be at least 10 characters'),
  body('authors')
    .isArray({ min: 1 })
    .withMessage('At least one author is required'),
  body('confidentialityLevel')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Valid confidentiality level is required'),
  handleValidationErrors
];

module.exports = {
  validateUserCreation,
  validatePaperCreation,
  handleValidationErrors
};