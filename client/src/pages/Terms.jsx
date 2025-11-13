// frontend/src/pages/Terms.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react'; 

const Terms = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the Pharma Research Portal, you accept and agree to be bound by the terms and provision of this agreement.`
    },
    {
      title: '2. Use License',
      content: `Permission is granted to temporarily access the materials on Pharma Research Portal for personal, non-commercial transitory viewing only.`
    },
    {
      title: '3. User Accounts',
      content: `You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.`
    },
    {
      title: '4. Intellectual Property',
      content: `All research papers, documents, and content available through this platform are protected by copyright and intellectual property laws. Unauthorized distribution is strictly prohibited.`
    },
    {
      title: '5. Data Security',
      content: `We implement industry-standard security measures to protect your data. However, users are responsible for maintaining the security of their login credentials.`
    },
    {
      title: '6. Prohibited Uses',
      content: `You may not use the platform for any unlawful purpose, to upload malicious code, or to attempt unauthorized access to other users' data.`
    },
    {
      title: '7. Termination',
      content: `We may terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms of Service.`
    },
    {
      title: '8. Limitation of Liability',
      content: `Pharma Research Portal shall not be held liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.`
    },
    {
      title: '9. Governing Law',
      content: `These terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.`
    }
  ];

  return (
    <div>
      
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Terms of Service
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Last updated: {new Date().toLocaleDateString()}
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
            <p className="text-gray-300 text-lg leading-relaxed">
              Please read these terms and conditions carefully before using our service. 
              Your access to and use of the service is conditioned on your acceptance of and compliance with these terms.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                  {section.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact for Questions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 p-8 bg-cyan-500/10 rounded-2xl border border-cyan-500/20"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Questions About Our Terms?
            </h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
            >
              <span>Contact Us</span>
            </motion.a>
          </motion.div>
        </div>
      </section>  
    </div>
  );
};

export default Terms;