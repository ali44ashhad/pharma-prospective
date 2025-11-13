// backend/src/controllers/paperController.js
const Paper = require('../models/Paper');
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');
const PaperAssignment = require('../models/PaperAssignment');
const cloudinary = require('../config/cloudinary');
const stream = require('stream');
const logAccess = require('../utils/logAccess');

// Helper function to check if user has access to paper
const checkPaperAccess = async (paperId, userId) => {
  // Admin bypass access control
  const user = await User.findById(userId);
  if (user && ['super_admin', 'admin'].includes(user.role)) {
    return true;
  }

  // Check if paper is assigned to user
  const assignment = await PaperAssignment.findOne({
    paperId,
    userId,
    isActive: true
  });

  return !!assignment;
};
exports.uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, abstract, authors, tags, confidentialityLevel } = req.body;
    
    // Parse authors and tags from strings to arrays
    const authorsArray = typeof authors === 'string' 
      ? authors.split(',').map(author => author.trim()) 
      : authors;
    
    const tagsArray = tags && typeof tags === 'string' 
      ? tags.split(',').map(tag => tag.trim()) 
      : tags || [];

    // Create paper record
    const paper = new Paper({
      title,
      abstract,
      authors: authorsArray,
      tags: tagsArray,
      confidentialityLevel: confidentialityLevel || 'medium',
      fileUrl: req.file.path,
      fileKey: req.file.filename,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user._id
    });

    await paper.save();

    // Log paper upload
   await logAccess(req, { action: 'paper_upload', paperId: paper._id, details: `Uploaded paper: ${title}` });

    res.status(201).json({
      success: true,
      message: 'Paper uploaded successfully',
      paper: {
        id: paper._id,
        title: paper.title,
        authors: paper.authors,
        fileUrl: paper.fileUrl,
        fileName: paper.fileName,
        fileSize: paper.fileSize,
        confidentialityLevel: paper.confidentialityLevel,
        createdAt: paper.createdAt
      }
    });

  } catch (error) {
    console.error('Upload paper error:', error);
    
    // Delete uploaded file if paper creation failed
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteError) {
        console.error('Error deleting uploaded file:', deleteError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error during paper upload'
    });
  }
};

exports.getAllPapers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      tags = '',
      confidentialityLevel = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Check if user is admin
    const user = await User.findById(req.user._id);
    const isAdmin = ['super_admin', 'admin'].includes(user.role);

    // Get paper IDs assigned to user if not admin
    let accessiblePaperIds = [];
    if (!isAdmin) {
      const assignments = await PaperAssignment.find({ 
        userId: req.user._id,
        isActive: true
      });
      accessiblePaperIds = assignments.map(a => a.paperId);
    }

    const query = { isActive: true };
    
    // Add paper ID filter for non-admin users
    if (!isAdmin) {
      query._id = { $in: accessiblePaperIds };
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Filter by confidentiality level
    if (confidentialityLevel) {
      query.confidentialityLevel = confidentialityLevel;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const papers = await Paper.find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .select('-fileKey -__v')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Paper.countDocuments(query);

    // Log papers view
    await AccessLog.create({
      userId: req.user._id,
      action: 'papers_list_view',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success'
    });

    res.json({
      success: true,
      papers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching papers'
    });
  }
};

exports.getPaperById = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await Paper.findById(id)
      .populate('uploadedBy', 'firstName lastName email')
      .select('-fileKey -__v');

    if (!paper || !paper.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if user has access to this paper
    const hasAccess = await checkPaperAccess(id, req.user._id);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this paper'
      });
    }

    // Log paper view
    await AccessLog.create({
      userId: req.user._id,
      paperId: paper._id,
      action: 'paper_view',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success'
    });

    res.json({
      success: true,
      paper
    });
  } catch (error) {
    console.error('Get paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching paper'
    });
  }
};

exports.updatePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, abstract, authors, tags, confidentialityLevel } = req.body;

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if user has permission to update
    if (paper.uploadedBy.toString() !== req.user._id.toString() && 
        !['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this paper'
      });
    }

    // Update fields
    if (title) paper.title = title;
    if (abstract) paper.abstract = abstract;
    if (authors) {
      paper.authors = typeof authors === 'string' 
        ? authors.split(',').map(author => author.trim()) 
        : authors;
    }
    if (tags) {
      paper.tags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()) 
        : tags;
    }
    if (confidentialityLevel) paper.confidentialityLevel = confidentialityLevel;

    await paper.save();

    // Log paper update
    await AccessLog.create({
      userId: req.user._id,
      paperId: paper._id,
      action: 'paper_update',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Paper updated successfully',
      paper
    });
  } catch (error) {
    console.error('Update paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during paper update'
    });
  }
};

exports.deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await Paper.findById(id);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if user has permission to delete
    if (paper.uploadedBy.toString() !== req.user._id.toString() && 
        !['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this paper'
      });
    }

    // Soft delete by setting isActive to false
    paper.isActive = false;
    await paper.save();

    // Log paper deletion
    await AccessLog.create({
      userId: req.user._id,
      paperId: paper._id,
      action: 'paper_delete',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Paper deleted successfully'
    });
  } catch (error) {
    console.error('Delete paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during paper deletion'
    });
  }
};

exports.getPaperStats = async (req, res) => {
  try {
    const totalPapers = await Paper.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    
    const papersByConfidentiality = await Paper.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$confidentialityLevel', count: { $sum: 1 } } }
    ]);

    const recentUploads = await Paper.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt confidentialityLevel')
      .populate('uploadedBy', 'firstName lastName');

    res.json({
      success: true,
      stats: {
        totalPapers,
        totalUsers,
        papersByConfidentiality,
        recentUploads
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};