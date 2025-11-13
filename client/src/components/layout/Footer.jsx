import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Beaker, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' }, 
      { name: 'Contact', href: '/contact' },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Data Protection', href: '/data-protection' },
    ], 
    'Resources': [  
      { name: 'Help Center', href: '/help' },
      { name: 'Status', href: '/status' },
    ],
  };

  return (
    <footer className="relative z-40 bg-gradient-to-b from-[#0A0F1C] to-[#0F172A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pharma prospective</h2>
                <p className="text-gray-400 text-sm">Secure Research Portal</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Advancing pharmaceutical research through secure collaboration and 
              cutting-edge technology. Empowering researchers worldwide.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">123 Research Park, BioTech City, ST 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@pharmaresearch.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Pharma Research Portal. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Privacy
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Terms
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Security
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
