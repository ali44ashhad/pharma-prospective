// frontend/src/pages/Help.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageCircle,
  FileText,
  Download,
  Upload,
  Shield,
  Users
} from 'lucide-react'; 

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: BookOpen,
      description: 'New to our platform? Start here to learn the basics.'
    },
    {
      id: 'uploading',
      name: 'Uploading Papers',
      icon: Upload,
      description: 'Learn how to upload and manage your research papers.'
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      icon: Shield,
      description: 'Understand our security measures and privacy features.'
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      icon: Users,
      description: 'Working with team members and external collaborators.'
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: HelpCircle,
      description: 'Common issues and their solutions.'
    }
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I create an account?',
        answer: 'Accounts can only be created by administrators. Please contact your organization\'s admin or our support team to get started.'
      },
      {
        question: 'What browsers are supported?',
        answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, ensure you\'re using an updated browser.'
      },
      {
        question: 'Is there a mobile app?',
        answer: 'Currently, we offer a responsive web application that works on all devices. Native mobile apps are planned for future releases.'
      }
    ],
    'uploading': [
      {
        question: 'What file formats are supported for upload?',
        answer: 'We currently support PDF files for research papers. Maximum file size is 50MB per document.'
      },
      {
        question: 'How do I add metadata to my papers?',
        answer: 'During the upload process, you\'ll be prompted to add title, authors, abstract, tags, and confidentiality level for each paper.'
      },
      {
        question: 'Can I update a paper after uploading?',
        answer: 'Yes, you can update paper metadata at any time. To replace the actual file, you\'ll need to upload a new version.'
      }
    ],
    'security': [
      {
        question: 'How is my research data protected?',
        answer: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We implement dynamic watermarking and comprehensive access controls.'
      },
      {
        question: 'Who can access my uploaded papers?',
        answer: 'Access is controlled through role-based permissions. Only users with explicit permission can view your research papers.'
      },
      {
        question: 'Are downloads allowed?',
        answer: 'Download functionality is restricted to prevent unauthorized distribution. Papers can only be viewed through our secure viewer.'
      }
    ]
  };

  const popularArticles = [
    {
      title: 'Setting Up Two-Factor Authentication',
      category: 'Security',
      reads: '1.2k'
    },
    {
      title: 'Managing Team Permissions',
      category: 'Collaboration',
      reads: '890'
    },
    {
      title: 'Uploading Large Research Papers',
      category: 'Uploading',
      reads: '756'
    },
    {
      title: 'Understanding Confidentiality Levels',
      category: 'Security',
      reads: '643'
    }
  ];

  const filteredFaqs = faqs[activeCategory] || [];

  return (
    <div>
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
          >
            Help Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Find answers to common questions and learn how to make the most of our platform
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Help Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                        activeCategory === category.id
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs opacity-75">{category.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Help */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold mb-3">Quick Help</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Video className="w-4 h-4" />
                    <span>Video Tutorials</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>Documentation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Popular Articles</h3>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="text-white text-sm font-medium mb-1">
                      {article.title}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{article.category}</span>
                      <span>{article.reads} reads</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-semibold text-white capitalize">
                  {categories.find(cat => cat.id === activeCategory)?.name}
                </h2>
                <p className="text-gray-400 mt-2">
                  {categories.find(cat => cat.id === activeCategory)?.description}
                </p>
              </div>

              {/* FAQs */}
              <div className="p-6">
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredFaqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="text-white font-medium pr-4">
                            {faq.question}
                          </span>
                          <motion.div
                            animate={{ rotate: openFaq === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <HelpCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {openFaq === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-6 pb-6"
                            >
                              <p className="text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No FAQs found in this category</p>
                    <p className="text-gray-500 text-sm">Try another category or search for specific topics</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 text-center"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Still Need Help?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our support team is here to help you with any questions or issues you might have. 
                We typically respond within a few hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="mailto:support@pharmaresearch.com"
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                >
                  Email Support
                </motion.a>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Contact Form
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div> 
    </div>
  );
};

export default Help;