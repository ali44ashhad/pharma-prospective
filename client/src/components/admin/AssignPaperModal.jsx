// frontend/src/components/admin/AssignPaperModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/api';

const AssignPaperModal = ({ paper, users, onClose, onAssigned }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await adminService.assignPaper(paper._id, selectedUser);

      onAssigned?.();
      onClose();
    } catch (err) {
      console.error('Assign paper error:', err);
      setError(err.response?.data?.message || 'Failed to assign paper');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 w-full max-w-md border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Assign Paper Access
        </h3>
        
        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">{paper.title}</h4>
          <p className="text-gray-400 text-sm">
            By {paper.authors.join(', ')}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-cyan-400 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

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
              {submitting ? 'Assigning...' : 'Assign Paper'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AssignPaperModal;