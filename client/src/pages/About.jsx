import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Users, 
  Shield, 
  Globe, 
  TrendingUp 
} from 'lucide-react'; 

const About = () => {
  const stats = [
    { number: '500+', label: 'Research Papers' },
    { number: '50+', label: 'Pharma Companies' },
    { number: '1M+', label: 'Secure Views' },
    { number: '99.9%', label: 'Uptime' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Every feature is built with data protection and intellectual property security as the foundation.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe breakthrough research happens when brilliant minds can securely collaborate.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Our platform enables pharmaceutical research that improves lives worldwide.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Constantly evolving with the latest security technologies and research methodologies.'
    }
  ];

  return (
    <div>
      
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
          >
            About Pharma Research
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            We're revolutionizing how pharmaceutical research is shared, protected, and collaborated on. 
            Our secure platform ensures that groundbreaking discoveries remain protected while enabling global collaboration.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To accelerate pharmaceutical innovation by providing a secure, collaborative 
              platform where researchers can share knowledge without compromising intellectual 
              property or data security.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              A world where pharmaceutical research collaboration knows no boundaries, 
              protected by cutting-edge security that enables faster discovery and 
              development of life-saving treatments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 text-lg">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> 
    </div>
  );
};

export default About;
