// backend/src/controllers/adminController.js
const User = require('../models/User');
const Paper = require('../models/Paper');
const AccessLog = require('../models/AccessLog');
const PaperAssignment = require('../models/PaperAssignment');

exports.createUser = async (req, res) => {
  try {
    const { email, firstName, lastName, department, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Hash the temporary password before setting it
    const hashedPassword = await User.hashPassword(tempPassword);
    
    // Create user with initial password
    const user = new User({
      email: email.toLowerCase(),
      passwordHash: hashedPassword, // Already hashed, won't be hashed again
      firstName,
      lastName,
      department,
      role: role || 'researcher',
      isTemporaryPassword: true
    });

    await user.save();

    // Log user creation
    await AccessLog.create({
      userId: req.user._id,
      action: 'user_creation',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: `Created user: ${email}`
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department
      },
      temporaryPassword: tempPassword // This matches what the frontend expects
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user creation'
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-passwordHash -totpSecret -passwordResetToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, department, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deactivation
    if (id === req.user._id.toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (department) user.department = department;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    // Log user update
    await AccessLog.create({
      userId: req.user._id,
      action: 'user_update',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: `Updated user: ${user.email}`
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user update'
    });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    user.passwordHash = await User.hashPassword(tempPassword);
    await user.save();

    // Log password reset
    await AccessLog.create({
      userId: req.user._id,
      action: 'password_reset',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: `Reset password for user: ${user.email}`
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
      tempPassword // In production, send via email instead
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

exports.getAccessLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, action, startDate, endDate } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AccessLog.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('paperId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AccessLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get access logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching access logs'
    });
  }
};

// Assign paper to user
exports.assignPaper = async (req, res) => {
  try {
    const { paperId, userId } = req.body;

    // Check if paper exists
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if assignment already exists
    const existingAssignment = await PaperAssignment.findOne({
      paperId,
      userId,
      isActive: true
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Paper is already assigned to this user'
      });
    }

    // Create assignment
    const assignment = await PaperAssignment.create({
      paperId,
      userId,
      assignedBy: req.user._id
    });

    // Log the assignment
    await AccessLog.create({
      userId: req.user._id,
      paperId,
      action: 'paper_assignment',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: `Assigned paper to user: ${user.email}`
    });

    res.status(201).json({
      success: true,
      message: 'Paper assigned successfully',
      data: await assignment.populate(['paperId', 'userId'])
    });

  } catch (error) {
    console.error('Paper assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during paper assignment'
    });
  }
};

// Get user's assigned papers
exports.getUserAssignedPapers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const assignments = await PaperAssignment.find({ 
      userId,
      isActive: true 
    })
      .populate('paperId')
      .populate('assignedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PaperAssignment.countDocuments({ userId, isActive: true });

    res.json({
      success: true,
      data: assignments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get user papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user papers'
    });
  }
};

// Revoke paper access
exports.revokePaperAccess = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await PaperAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    assignment.isActive = false;
    await assignment.save();

    // Log the revocation
    await AccessLog.create({
      userId: req.user._id,
      paperId: assignment.paperId,
      action: 'paper_access_revoked',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
      details: `Revoked paper access`
    });

    res.json({
      success: true,
      message: 'Paper access revoked successfully',
      data: assignment
    });

  } catch (error) {
    console.error('Revoke paper access error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while revoking paper access'
    });
  }
};