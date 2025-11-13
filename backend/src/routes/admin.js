// backend/src/routes/admin.js
const express = require('express');
const {
  createUser,
  getUsers,
  updateUser,
  resetUserPassword,
  getAccessLogs,
  assignPaper,
  getUserAssignedPapers,
  revokePaperAccess
} = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateUserCreation } = require('../middleware/validation');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// User management routes
router.post('/users', validateUserCreation, createUser);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.post('/users/:id/reset-password', resetUserPassword);

// Audit logs
router.get('/access-logs', getAccessLogs);

// Paper assignment routes
router.post('/paper-assignments', assignPaper);
router.get('/users/:userId/papers', getUserAssignedPapers);
router.delete('/paper-assignments/:assignmentId', revokePaperAccess);

module.exports = router;