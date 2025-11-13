import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  Globe
} from 'lucide-react'; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'contact@pharmaresearch.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Research Park, BioTech City',
      description: 'ST 12345, United States'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: '24/7 Emergency Support',
      description: 'Critical issues anytime'
    }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Have questions about our platform? Ready to secure your research? We're here to help you get started.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="space-y-4 md:space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-6 border border-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm md:text-base mb-0.5">{item.title}</h3>
                      <p className="text-cyan-400 text-xs md:text-sm font-medium">{item.details}</p>
                      <p className="text-gray-400 text-xs md:text-sm">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-8 border border-white/10">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm md:text-base"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm md:text-base"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm md:text-base"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm md:text-base"
                    >
                      <option value="">Select a subject</option>
                      <option value="demo">Request Demo</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none text-sm md:text-base"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
