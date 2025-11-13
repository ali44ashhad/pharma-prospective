// frontend/src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Beaker, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  FileText,
  Users,
  BarChart3,
   Home, 
  Info, 
   Mail 
} from 'lucide-react';


import { useAuth } from '../../contexts/AuthContext.jsx';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    // Removed Dashboard from main nav
      { name: 'Home', href: '/', icon: Home },
        { name: 'About us', href: '/about', icon: Info},
          
    { name: 'Research Papers', href: '/papers', icon: FileText },
    ...(user?.isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: Settings }] : []),
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Contact Us', href: '/contact', icon: Mail },
  ];
  

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
            >
              <Beaker className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                Pharma Prospective
              </h1>
              <p className="text-gray-400 text-xs">Secure Research Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isActiveRoute(item.href)
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* If not logged in, show Login button */}
            {!user ? (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Login
                </motion.button>
              </Link>
            ) : (
              <>
                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileMenuOpen(prev => !prev);
                    }}
                    className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl border border-white/10 shadow-2xl p-2 z-50"
                      >
                        <div className="p-4 border-b border-white/10">
                          <p className="text-white font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-gray-400 text-sm">{user?.email}</p>
                          <p className="text-cyan-400 text-xs capitalize mt-1">
                            {user?.role} • {user?.department}
                          </p>
                        </div>

                        <div className="p-2 space-y-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-3 py-2 text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-lg transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 py-4"
            >
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActiveRoute(item.href)
                          ? 'bg-cyan-500 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;