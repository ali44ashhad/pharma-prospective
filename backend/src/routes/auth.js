// backend/src/routes/auth.js
const express = require('express');
const { 
  login, 
  logout, 
  getCurrentUser, 
  changePassword 
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

const changePasswordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  handleValidationErrors
];

// Public routes
router.post('/login', loginValidation, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/change-password', authenticate, changePasswordValidation, changePassword);

module.exports = router;