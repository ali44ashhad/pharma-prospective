// frontend/src/pages/DataProtection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, Eye, Server, Key } from 'lucide-react'; 

const DataProtection = () => {
  const protectionMeasures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All research data is encrypted both in transit and at rest using AES-256 encryption, ensuring your intellectual property remains secure.'
    },
    {
      icon: Database,
      title: 'Secure Data Storage',
      description: 'Your research papers are stored in secure, geographically distributed data centers with multiple layers of physical and digital security.'
    },
    {
      icon: Eye,
      title: 'Access Controls',
      description: 'Granular permission systems ensure that only authorized personnel can access specific research documents based on their roles and responsibilities.'
    },
    {
      icon: Server,
      title: 'Regular Security Audits',
      description: 'We conduct regular third-party security audits and penetration testing to identify and address potential vulnerabilities.'
    },
    {
      icon: Key,
      title: 'Multi-Factor Authentication',
      description: 'Advanced MFA options including TOTP and hardware security keys protect user accounts from unauthorized access.'
    },
    {
      icon: Shield,
      title: 'Compliance Frameworks',
      description: 'Our platform adheres to industry standards including ISO 27001, HIPAA, and GDPR requirements for data protection.'
    }
  ];

  const dataRights = [
    {
      title: 'Right to Access',
      description: 'You have the right to request access to the personal data we hold about you.'
    },
    {
      title: 'Right to Rectification',
      description: 'You can request correction of any inaccurate or incomplete personal data.'
    },
    {
      title: 'Right to Erasure',
      description: 'You may request deletion of your personal data under certain circumstances.'
    },
    {
      title: 'Right to Restrict Processing',
      description: 'You can request limitation of how we use your personal data.'
    },
    {
      title: 'Right to Data Portability',
      description: 'You can receive your personal data in a structured, commonly used format.'
    },
    {
      title: 'Right to Object',
      description: 'You may object to certain types of processing of your personal data.'
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Data Protection
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Comprehensive security measures to protect your valuable research data
          </motion.p>
        </div>
      </section>

      {/* Protection Measures */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Security Measures</h2>
            <p className="text-gray-400 text-lg">
              Multi-layered protection for your research data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {protectionMeasures.map((measure, index) => (
              <motion.div
                key={measure.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all group"
              >
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <measure.icon className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{measure.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {measure.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Rights */}
      <section className="py-16 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Your Data Rights</h2>
            <p className="text-gray-400 text-lg">
              Complete control over your personal information
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataRights.map((right, index) => (
              <motion.div
                key={right.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-semibold text-green-400 mb-3">{right.title}</h3>
                <p className="text-gray-300 text-sm">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
          >
            <h2 className="text-3xl font-semibold text-white mb-6">Compliance & Certifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {['ISO 27001', 'HIPAA', 'GDPR', 'SOC 2'].map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-green-500/20 rounded-xl border border-green-500/30"
                >
                  <span className="text-green-400 font-semibold">{cert}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-gray-300">
              Our platform is designed to meet the highest standards of data protection and security compliance.
            </p>
          </motion.div>
        </div>
      </section> 
    </div>
  );
};

export default DataProtection;