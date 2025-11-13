// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  };
  res.cookie('token', token, cookieOptions);
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || !user.isActive) {
      await AccessLog.create({
        action: 'login',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'failed',
        details: 'Invalid email or inactive account'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account inactive'
      });
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      await AccessLog.create({
        action: 'login',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'failed',
        details: 'Invalid password'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    // Log successful login
    await AccessLog.create({
      userId: user._id,
      action: 'login',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await AccessLog.create({
        userId: req.user._id,
        action: 'logout',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'success'
      });
    }

    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        fullName: req.user.fullName,
        role: req.user.role,
        department: req.user.department,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.checkPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    // Log password change
    await AccessLog.create({
      userId: user._id,
      action: 'password_change',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};