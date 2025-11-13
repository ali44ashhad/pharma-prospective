// frontend/src/pages/ResearchPapers.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  User,
  Tag,
  Shield,
  SortAsc,
  Grid,
  List
} from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { paperService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ResearchPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    confidentialityLevel: '',
    tags: '',
    dateRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const { user } = useAuth();

  useEffect(() => {
    fetchPapers();
  }, [filters]);

  const fetchPapers = async () => {
    try {
      const response = await paperService.getAll({
        search: searchTerm,
        ...filters
      });
      setPapers(response.papers || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPapers();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const confidentialityLevels = [
    { value: '', label: 'All Levels' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Added' },
    { value: 'title', label: 'Title' },
    { value: 'confidentialityLevel', label: 'Confidentiality' }
  ];

  const PaperCard = ({ paper }) => (
    <Link to={`/view/${paper._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all group cursor-pointer"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
              {paper.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1 flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>By {paper.authors.join(', ')}</span>
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            paper.confidentialityLevel === 'critical' ? 'bg-red-500/20 text-red-300' :
            paper.confidentialityLevel === 'high' ? 'bg-orange-500/20 text-orange-300' :
            paper.confidentialityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {paper.confidentialityLevel}
          </span>
        </div>

        {/* Abstract */}
        <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
          {paper.abstract}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>{(paper.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span className="capitalize">{paper.confidentialityLevel}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {paper.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
          {paper.tags?.length > 3 && (
            <span className="text-gray-400 text-xs">
              +{paper.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Uploader Info */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-xs text-gray-400">
            Uploaded by {paper.uploadedBy?.firstName} {paper.uploadedBy?.lastName}
          </div>
        </div>
      </motion.div>
    </Link>
  );

  const PaperListItem = ({ paper }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                {paper.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {paper.abstract}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
              paper.confidentialityLevel === 'critical' ? 'bg-red-500/20 text-red-300' :
              paper.confidentialityLevel === 'high' ? 'bg-orange-500/20 text-orange-300' :
              paper.confidentialityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-green-500/20 text-green-300'
            }`}>
              {paper.confidentialityLevel}
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{paper.authors.join(', ')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{(paper.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {paper.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Link to={`/view/${paper._id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </motion.button>
              </Link>
              {user.role === 'admin' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B]"> 
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-cyan-400">Loading research papers...</p>
            </div>
          </div>
        </div> 
      </div>
    );
  }

  return (
    <div>
      
      {/* Hero Section */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Research Papers
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover groundbreaking pharmaceutical research from leading scientists and institutions
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search papers by title, author, abstract, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </motion.button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confidentiality Level
                  </label>
                  <select
                    value={filters.confidentialityLevel}
                    onChange={(e) => handleFilterChange('confidentialityLevel', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {confidentialityLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    View Mode
                  </label>
                  <div className="flex space-x-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 px-3 py-2 rounded-xl transition-all ${
                        viewMode === 'grid'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Grid className="w-4 h-4 mx-auto" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`flex-1 px-3 py-2 rounded-xl transition-all ${
                        viewMode === 'list'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <List className="w-4 h-4 mx-auto" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center mb-6"
          >
            <p className="text-gray-400">
              Showing {papers.length} research papers
            </p>
            {user.role === 'admin' && (
              <Link to="/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload New Paper</span>
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Papers Grid/List */}
          {papers.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {papers.map((paper, index) =>
                viewMode === 'grid' ? (
                  <PaperCard key={paper._id} paper={paper} index={index} />
                ) : (
                  <PaperListItem key={paper._id} paper={paper} index={index} />
                )
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No papers found
              </h3>
              <p className="text-gray-400">
                {searchTerm
                  ? 'Try adjusting your search terms or filters'
                  : 'No research papers available yet'}
              </p>
              {user.role === 'admin' && (
                <Link to="/upload" className="inline-block mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                  >
                    Upload First Paper
                  </motion.button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </section> 
    </div>
  );
};

export default ResearchPapers;