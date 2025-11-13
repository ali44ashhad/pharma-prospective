// frontend/src/pages/Privacy.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react'; 

const Privacy = () => {
  const privacySections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, upload research papers, or contact us. This includes personal information like your name, email address, and professional details.`
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: `We use the information we collect to provide and maintain our services, authenticate users, enforce our terms and policies, and communicate with you about updates and security alerts.`
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: `We implement appropriate technical and organizational security measures designed to protect your personal information. This includes encryption, access controls, and regular security assessments.`
    },
    {
      icon: Eye,
      title: 'Information Sharing',
      content: `We do not sell your personal information. We may share information only with your consent, to comply with laws, or to protect our rights and the security of our platform.`
    },
    {
      title: 'Your Rights',
      content: `You have the right to access, correct, or delete your personal information. You can also object to processing and request data portability. Contact us to exercise these rights.`
    },
    {
      title: 'Data Retention',
      content: `We retain personal information for as long as necessary to provide our services and fulfill the purposes described in this policy, unless a longer retention period is required by law.`
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Privacy Policy
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            How we protect and handle your data
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
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              At Pharma Research Portal, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-gray-400">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="space-y-8">
            {privacySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all"
              >
                <div className="flex items-start space-x-4">
                  {section.icon && (
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-green-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {section.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 p-8 bg-green-500/10 rounded-2xl border border-green-500/20"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Privacy Concerns?
            </h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about our privacy practices or this policy, please don't hesitate to contact us.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <span>Contact Privacy Team</span>
            </motion.a>
          </motion.div>
        </div>
      </section> 
    </div>
  );
};

export default Privacy;