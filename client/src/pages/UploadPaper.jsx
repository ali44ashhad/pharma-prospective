// frontend/src/pages/UploadPaper.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Users, 
  Tag, 
  Shield,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { paperService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UploadPaper = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: [''],
    tags: [''],
    confidentialityLevel: 'medium'
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup file object URL if it exists
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  // Check admin access
  useEffect(() => {
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      navigate('/papers');
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setErrors(prev => ({
          ...prev,
          file: 'Only PDF files are allowed'
        }));
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          file: 'File size must be less than 50MB'
        }));
        return;
      }
      setFile(selectedFile);
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    // Abstract validation
    if (!formData.abstract.trim()) {
      newErrors.abstract = 'Abstract is required';
    } else if (formData.abstract.length < 10) {
      newErrors.abstract = 'Abstract must be at least 10 characters';
    } else if (formData.abstract.length > 5000) {
      newErrors.abstract = 'Abstract must be less than 5000 characters';
    }

    // Authors validation
    if (formData.authors.length === 0) {
      newErrors.authors = 'At least one author is required';
    } else if (formData.authors.some(author => !author.trim())) {
      newErrors.authors = 'All authors must have names';
    } else if (formData.authors.some(author => author.length > 100)) {
      newErrors.authors = 'Author names must be less than 100 characters';
    }

    // Tags validation
    if (formData.tags.some(tag => tag.length > 50)) {
      newErrors.tags = 'Tags must be less than 50 characters';
    }

    // File validation
    if (!file) {
      newErrors.file = 'Please select a PDF file';
    } else if (file.size > 50 * 1024 * 1024) {
      newErrors.file = 'File size must be less than 50MB';
    } else if (file.type !== 'application/pdf') {
      newErrors.file = 'Only PDF files are allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prevent double submission
    if (uploading) {
      return;
    }

    setUploading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      
      // Sanitize and trim data before submission
      if (!file) {
        throw new Error('Please select a PDF file');
      }
      submitData.append('file', file);
      
      const trimmedTitle = formData.title.trim();
      if (!trimmedTitle) {
        throw new Error('Title is required');
      }
      submitData.append('title', trimmedTitle);
      
      const trimmedAbstract = formData.abstract.trim();
      if (!trimmedAbstract || trimmedAbstract.length < 10) {
        throw new Error('Abstract must be at least 10 characters');
      }
      submitData.append('abstract', trimmedAbstract);
      
      submitData.append('confidentialityLevel', formData.confidentialityLevel);
      
      // Filter out empty authors and tags
      const filteredAuthors = formData.authors
        .map(author => author.trim())
        .filter(author => author.length > 0);
      
      if (filteredAuthors.length === 0) {
        throw new Error('At least one author is required');
      }

      // Add authors and tags as arrays
      filteredAuthors.forEach(author => {
        submitData.append('authors[]', author);
      });
      
      const filteredTags = formData.tags
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (filteredTags.length > 0) {
        filteredTags.forEach(tag => {
          submitData.append('tags[]', tag);
        });
      }

      const response = await paperService.upload(submitData);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Upload failed');
      }

      // Success - redirect to papers page
      navigate('/papers', { 
        state: { 
          message: 'Paper uploaded successfully!',
          type: 'success',
          paperId: response.paperId 
        } 
      });
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({
        submit: error.response?.data?.message || error.message || 'Failed to upload paper. Please try again.'
      });
      
      // Scroll to error message
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } finally {
      setUploading(false);
    }
  };

  const confidentialityLevels = [
    { value: 'low', label: 'Low', description: 'General research information' },
    { value: 'medium', label: 'Medium', description: 'Sensitive research data' },
    { value: 'high', label: 'High', description: 'Proprietary research findings' },
    { value: 'critical', label: 'Critical', description: 'Highly confidential IP' }
  ];

  return (
    <div>
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Upload Research Paper
            </h1>
            <p className="text-xl text-gray-300">
              Share your groundbreaking research with the pharmaceutical community
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Research Paper File *
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-cyan-400/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {file ? (
                      <div className="space-y-4">
                        <FileText className="w-16 h-16 text-cyan-400 mx-auto" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1 mx-auto"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove File</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-white font-medium">Click to upload PDF</p>
                          <p className="text-gray-400 text-sm">
                            Maximum file size: 50MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {errors.file && (
                  <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.file}</span>
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paper Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter the research paper title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-2">{errors.title}</p>
                )}
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Abstract *
                </label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => handleInputChange('abstract', e.target.value)}
                  rows="6"
                  placeholder="Provide a detailed abstract of your research..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />
                {errors.abstract && (
                  <p className="text-red-400 text-sm mt-2">{errors.abstract}</p>
                )}
              </div>

              {/* Authors */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Authors *
                </label>
                <div className="space-y-3">
                  {formData.authors.map((author, index) => (
                    <div key={index} className="flex space-x-3">
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => handleArrayFieldChange('authors', index, e.target.value)}
                        placeholder={`Author ${index + 1} name`}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                      {formData.authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('authors', index)}
                          className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('authors')}
                    className="flex items-center space-x-2 px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Author</span>
                  </button>
                </div>
                {errors.authors && (
                  <p className="text-red-400 text-sm mt-2">{errors.authors}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex space-x-3">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
                        placeholder={`Tag ${index + 1} (e.g., oncology, clinical-trial)`}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('tags', index)}
                          className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('tags')}
                    className="flex items-center space-x-2 px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Tag</span>
                  </button>
                </div>
              </div>

              {/* Confidentiality Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Confidentiality Level *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {confidentialityLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`relative flex cursor-pointer rounded-xl border-2 p-4 focus:outline-none ${
                        formData.confidentialityLevel === level.value
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="confidentialityLevel"
                        value={level.value}
                        checked={formData.confidentialityLevel === level.value}
                        onChange={(e) => handleInputChange('confidentialityLevel', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <div className="flex items-center space-x-2">
                              <Shield className={`w-4 h-4 ${
                                level.value === 'critical' ? 'text-red-400' :
                                level.value === 'high' ? 'text-orange-400' :
                                level.value === 'medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`} />
                              <span className="font-medium text-white">
                                {level.label}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">
                              {level.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigate('/papers')}
                  className="flex-1 px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Research Paper</span>
                    </>
                  )}
                </motion.button>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.submit}</span>
                  </p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
 
    </div>
  );
};

export default UploadPaper;