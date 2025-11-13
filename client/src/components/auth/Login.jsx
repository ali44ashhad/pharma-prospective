// // frontend/src/components/auth/Login.jsx
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Beaker } from 'lucide-react';
// import { authService } from '../../services/api';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await authService.login(formData.email, formData.password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative z-10 w-full max-w-md"
//       >
//         {/* Header */}
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, type: 'spring' }}
//           className="text-center mb-8"
//         >
//           <div className="flex items-center justify-center space-x-3 mb-4">
//             <div className="p-3 bg-cyan-500/20 rounded-2xl">
//               <Beaker className="w-8 h-8 text-cyan-400" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
//               Pharma Research
//             </h1>
//           </div>
//           <p className="text-gray-400">Sign in to access research papers</p>
//         </motion.div>

//         {/* Login Form */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
//         >
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
//               >
//                 {error}
//               </motion.div>
//             )}

//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <motion.input
//                 whileFocus={{ scale: 1.02 }}
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                 placeholder="researcher@company.com"
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <motion.input
//                   whileFocus={{ scale: 1.02 }}
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-12"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <motion.button
//               type="submit"
//               disabled={loading}
//               whileHover={{ scale: loading ? 1 : 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   <span>Signing in...</span>
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </motion.button>
//           </form>

//           {/* Additional Links */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-400 text-sm">
//               Contact admin for account access
//             </p>
//           </div>
//         </motion.div>

//         {/* Footer */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="text-center mt-6"
//         >
//           <p className="text-gray-500 text-sm">
//             Secure Pharma Research Portal • {new Date().getFullYear()}
//           </p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

// frontend/src/components/auth/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Beaker } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // use AuthContext login so app state updates (header, protected routes etc.)
      const res = await login(formData.email, formData.password);

      if (res?.success) {
        navigate('/dashboard');
        return;
      }

      // If login didn't return success, show message if available
      const msg = res?.message || 'Login failed';
      setError(msg);
    } catch (err) {
      console.error('Login failed error object:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      if (serverMsg) setError(serverMsg);
      else if (err?.response) setError(`Login failed (status ${err.response.status})`);
      else setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-2xl">
              <Beaker className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Pharma Research
            </h1>
          </div>
          <p className="text-gray-400">Sign in to access research papers</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="researcher@company.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Contact admin for account access
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm">
            Secure Pharma Research Portal • {new Date().getFullYear()}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;