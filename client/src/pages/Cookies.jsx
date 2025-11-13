// frontend/src/pages/Cookies.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, ChartPie } from 'lucide-react'; 

const Cookies = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Necessary cookies can't be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    // Show confirmation
    alert('Cookie preferences saved!');
  };

  const cookieTypes = [
    {
      type: 'necessary',
      icon: Shield,
      title: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas.',
      alwaysActive: true
    },
    {
      type: 'analytics',
      icon: ChartPie,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website. The data is collected anonymously and helps us improve our services.',
      alwaysActive: false
    },
    {
      type: 'marketing',
      icon: Settings,
      title: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for individual users.',
      alwaysActive: false
    }
  ];

  return (
    <div>
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
              Cookie Policy
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            How we use cookies to enhance your experience
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">About Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our site.
            </p>
            <p className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Cookie Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Cookie Preferences</h2>
            
            <div className="space-y-4 mb-6">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={cookie.type}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <cookie.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{cookie.title}</h3>
                      <p className="text-gray-400 text-sm">{cookie.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {cookie.alwaysActive ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Always Active
                      </span>
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences[cookie.type]}
                          onChange={() => handlePreferenceChange(cookie.type)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => setCookiePreferences({
                  necessary: true,
                  analytics: false,
                  marketing: false
                })}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={() => setCookiePreferences({
                  necessary: true,
                  analytics: true,
                  marketing: true
                })}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={savePreferences}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>

          {/* Detailed Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Detailed Cookie Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-3">What are cookies?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Cookies are small pieces of data stored on your device by your web browser. 
                  They are widely used to make websites work more efficiently and provide 
                  information to the website owners.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-3">How we use cookies</h3>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li>To keep you signed in to your account</li>
                  <li>To remember your preferences and settings</li>
                  <li>To understand how you use our platform</li>
                  <li>To improve our services and user experience</li>
                  <li>To ensure the security of our platform</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Managing cookies</h3>
                <p className="text-gray-300 leading-relaxed">
                  You can control and/or delete cookies as you wish. You can delete all cookies 
                  that are already on your computer and you can set most browsers to prevent them 
                  from being placed. However, if you do this, you may have to manually adjust 
                  some preferences every time you visit a site and some services and 
                  functionalities may not work.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section> 
    </div>
  );
};

export default Cookies;