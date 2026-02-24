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
                <h2 className="text-xl font-bold text-white">Pharma Perspective</h2>
                <p className="text-gray-400 text-sm">Secure Research Portal</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Advancing pharmaceutical research through secure collaboration and 
              cutting-edge technology. Empowering researchers worldwide.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=FDBC0410+Compass+Building+Al+Shohada+Road+Al+Hamra+Industrial+Zone-FZ+Ras+Al+Khaimah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm">FDBC0410 Compass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ, Ras Al Khaimah</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 shrink-0" />
                <div className="flex flex-col text-sm space-y-1">
                  <a href="tel:+971503843832" className="hover:text-cyan-400 transition-colors">🇦🇪 +971 503843832</a>
                  <a href="tel:+971501489828" className="hover:text-cyan-400 transition-colors">🇦🇪 +971 501489828</a>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 shrink-0" />
                <div className="flex flex-col text-sm space-y-1">
                  <a href="mailto:mdv@mrsadvisory.co" className="hover:text-cyan-400 transition-colors">mdv@mrsadvisory.co</a>
                  <a href="mailto:aman@mrsadvisory.co" className="hover:text-cyan-400 transition-colors">aman@mrsadvisory.co</a>
                </div>
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