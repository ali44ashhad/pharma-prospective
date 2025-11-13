// frontend/src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Search, 
  Filter,
  Download,
  Eye,
  Calendar
} from 'lucide-react';
import { paperService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalPapers: 0,
    recentUploads: 0,
    myUploads: 0
  });
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If the signed-in user is an admin, redirect them to the Admin Panel
  // Admins shouldn't use the regular user dashboard; this keeps role UX separate.
  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchPapers();
    fetchStats();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await paperService.getAll();
      setPapers(response.papers || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await paperService.getStats();
      setStats(prev => ({
        ...prev,
        totalPapers: response.stats?.totalPapers || 0,
        recentUploads: response.stats?.recentUploads?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Recompute myUploads whenever papers or user change. We use user._id
  // because the auth context returns the Mongo-style _id field.
  useEffect(() => {
    try {
      setStats(prev => ({
        ...prev,
        myUploads: papers.filter(p => p.uploadedBy?._id === user?._id).length
      }));
    } catch (err) {
      // defensive: if papers/user shapes are unexpected, keep myUploads 0
      setStats(prev => ({ ...prev, myUploads: 0 }));
    }
  }, [papers, user]);

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.authors.some(author => 
      author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const PaperCard = ({ paper }) => (
    <Link to={`/view/${paper._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all group cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {paper.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              By {paper.authors.join(', ')}
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

        <p className="text-gray-300 text-sm line-clamp-2 mb-4">
          {paper.abstract}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{(paper.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            {paper.tags?.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
            {paper.tags?.length > 2 && (
              <span className="text-gray-400 text-xs">
                +{paper.tags.length - 2} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400">Loading research papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-400">
            Access and manage pharmaceutical research papers
          </p>
        </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <StatCard
          icon={FileText}
          label="Total Papers"
          value={stats.totalPapers}
          color="bg-cyan-500/20"
        />
        <StatCard
          icon={BarChart3}
          label="Recent Uploads"
          value={stats.recentUploads}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={Users}
          label="My Uploads"
          value={stats.myUploads}
          color="bg-green-500/20"
        />
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search papers by title, author, or abstract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </motion.button>
          {user.role === 'admin' && (
            <Link to="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Admin Panel</span>
              </motion.button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Papers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredPapers.map((paper, index) => (
          <PaperCard
            key={paper._id}
            paper={paper}
            index={index}
          />
        ))}
      </motion.div>

      {filteredPapers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No papers found</p>
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'Try adjusting your search terms' : 'No papers available yet'}
          </p>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;