// frontend/src/components/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Shield,
  Eye,
  UserPlus,
  FileDown
} from 'lucide-react';
import PasswordModal from './PasswordModal';
import AssignPaperModal from './AssignPaperModal';
import { adminService, paperService } from '../../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePaperAssigned = async () => {
    // Refresh papers after assignment
    await fetchPapers();
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'papers') {
      fetchPapers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await adminService.getUsers();
      // API may return { users: [...] } or just [...]
      setUsers(response.users || response || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMsg(
        error?.response?.data?.message || 'Failed to load users. Check console.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPapers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await paperService.getAll();
      setPapers(response.papers || response || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setErrorMsg(
        error?.response?.data?.message || 'Failed to load papers. Check console.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Placeholder action handlers (implement as needed)
  const handleEditUser = (userId) => {
    console.log('Edit user', userId);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setLoading(true);
      await adminService.updateUser(userId, { isDeleted: true }); // or adminService.deleteUser if exists
      // Refresh list
      await fetchUsers();
    } catch (err) {
      console.error('Delete user failed:', err);
      alert(err?.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'papers', label: 'Paper Management', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const TabButton = ({ tab, isActive }) => {
    const Icon = tab.icon;
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${
          isActive
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{tab.label}</span>
      </motion.button>
    );
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage users, papers, and system settings</p>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-80">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            {/* Content Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {tabs.find((t) => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Manage {activeTab} in the system</p>
                </div>
                {activeTab === 'users' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateUser(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {errorMsg}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'users' && <UsersTab users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />}
                  {activeTab === 'papers' && <PapersTab papers={papers} users={users} onAssign={handlePaperAssigned} />}
                  {activeTab === 'analytics' && <AnalyticsTab />}
                  {activeTab === 'settings' && <SettingsTab />}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <CreateUserModal
          onClose={() => setShowCreateUser(false)}
          onCreated={async (createdUser) => {
            // Refresh users from server. Do NOT close the create modal here so the
            // PasswordModal (temporary password) remains visible long enough for
            // the admin to copy it. The CreateUserModal will call its onClose()
            // (which closes the modal) when the admin dismisses the PasswordModal.
            await fetchUsers();
          }}
        />
      )}
    </div>
  );
};

// Tab Components
const UsersTab = ({ users = [], onEdit, onDelete }) => (
  <div className="space-y-4">
    {users.length === 0 ? (
      <div className="text-center text-gray-400 py-8">No users found.</div>
    ) : (
      users.map((user, index) => (
        <motion.div
          key={user._id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300'
                        : user.role === 'researcher'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit?.(user._id)}
                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete?.(user._id)}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))
    )}
  </div>
);

const PapersTab = ({ papers = [], users = [], onAssign }) => {
  const [selectedPaper, setSelectedPaper] = useState(null);

  return (
    <div className="space-y-4">
      {papers.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No papers found.</div>
      ) : (
        <>
          {papers.map((paper, index) => (
            <motion.div
              key={paper._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{paper.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">By {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-gray-400 text-sm">
                      {paper.createdAt ? new Date(paper.createdAt).toLocaleDateString() : '—'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      paper.confidentialityLevel === 'critical' ? 'bg-red-500/20 text-red-300' :
                      paper.confidentialityLevel === 'high' ? 'bg-orange-500/20 text-orange-300' :
                      paper.confidentialityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {paper.confidentialityLevel || 'unknown'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPaper(paper)}
                    className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors" 
                    title="Assign to User"
                  >
                    <UserPlus className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors" 
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors" 
                    title="Download"
                  >
                    <FileDown className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {selectedPaper && (
            <AssignPaperModal
              paper={selectedPaper}
              users={users}
              onClose={() => setSelectedPaper(null)}
              onAssigned={() => {
                setSelectedPaper(null);
                onAssign?.();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

const AnalyticsTab = () => (
  <div className="text-center py-12">
    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-400">Analytics dashboard coming soon</p>
  </div>
);

const SettingsTab = () => (
  <div className="text-center py-12">
    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-400">System settings coming soon</p>
  </div>
);

// Create User Modal Component (controlled inputs + API call)
const CreateUserModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: 'researcher'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    const requiredFields = {
      firstName: 'First Name',
      email: 'Email',
      role: 'Role'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key]?.trim())
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      setError(`Required fields missing: ${missingFields.join(', ')}`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Creating user with data:', { ...formData, password: '[HIDDEN]' });
      
      const res = await adminService.createUser(formData);
      console.log('Server response:', res);

      // Response should include the temporary password
      const created = res.user || res;
      if (res.temporaryPassword) {
        console.log('Temporary password received');
        setTempPassword(res.temporaryPassword);
        setShowPassword(true);
      } else {
        console.warn('No temporary password in response');
      }
      onCreated?.(created);
    } catch (err) {
      console.error('Create user failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create user.';
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: errorMessage
      });
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 w-full max-w-md border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Create New User</h3>

        {error && (
          <div className="mb-3 text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={onChange}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={onChange}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="researcher">Researcher</option>
            <option value="admin">Admin</option>
            <option value="reviewer">Reviewer</option>
          </select>

          {/* If backend requires password on create, uncomment the block below
          <input
            type="password"
            name="password"
            placeholder="Temporary Password"
            value={formData.password}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          */}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Password Modal */}
      {showPassword && (
        <PasswordModal
          password={tempPassword}
          email={formData.email}
          onClose={() => {
            setShowPassword(false);
            onClose();
          }}
        />
      )}
    </motion.div>
  );
};

export default AdminPanel;
