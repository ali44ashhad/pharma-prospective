// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');

const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
      await AccessLog.create({
        action: 'access_attempt',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'failed',
        details: 'No token provided'
      });
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Please login.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select('-passwordHash -totpSecret -passwordResetToken');
    
    if (!user || !user.isActive) {
      await AccessLog.create({
        action: 'access_attempt',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'failed',
        details: 'User not found or inactive'
      });
      return res.status(401).json({ 
        success: false,
        message: 'User account is inactive or not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    await AccessLog.create({
      action: 'access_attempt',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'failed',
      details: `Invalid token: ${error.message}`
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authentication token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired. Please login again.' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Authentication error' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || !['super_admin', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Super admin access required' 
    });
  }
  next();
};

module.exports = { 
  authenticate, 
  requireAdmin, 
  requireSuperAdmin 
};