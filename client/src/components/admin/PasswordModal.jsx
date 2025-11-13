// frontend/src/components/admin/PasswordModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const PasswordModal = ({ password, email, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Email: ${email}\nTemporary Password: ${password}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 w-full max-w-md border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4">New User Created</h3>
        
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
          <p className="text-green-400 text-sm mb-4">
            User account has been created successfully. Save these credentials:
          </p>
          
          <div className="space-y-2">
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-sm text-gray-400">Email:</p>
              <p className="text-white font-mono">{email}</p>
            </div>
            
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-sm text-gray-400">Temporary Password:</p>
              <p className="text-white font-mono">{password}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Credentials</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            ⚠️ Make sure to save these credentials. You won't be able to see the password again.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PasswordModal;