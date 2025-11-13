// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Beaker, Microscope, BookOpen, Shield, Users, TrendingUp } from 'lucide-react'; 
import Loader from '../components/common/Loader';
import { Molecule3D, FloatingParticles } from '../components/3d/Molecule3D';
import { useAuth } from '../contexts/AuthContext.jsx';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Molecule3D />
          <FloatingParticles count={30} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate />
        </Canvas>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-[80vh] px-6">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text"
        >
          Pharma prospective
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-3xl text-xl text-gray-300 mb-8 leading-relaxed"
        >
          Secure collaborative platform for pharmaceutical research papers. 
          Advanced encryption, watermarking, and access control for your valuable research.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {!user ? (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-2xl shadow-cyan-500/25 transition-all"
                >
                  Access Research Portal
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-2xl shadow-cyan-500/25 transition-all"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built with security and collaboration in mind for the pharmaceutical industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Military-Grade Security',
                description: 'End-to-end encryption, dynamic watermarking, and comprehensive audit trails protect your intellectual property.',
                color: 'from-green-500 to-emerald-600'
              },
              {
                icon: Users,
                title: 'Collaborative Research',
                description: 'Secure sharing and collaboration tools for research teams with granular access controls.',
                color: 'from-blue-500 to-cyan-600'
              },
              {
                icon: TrendingUp,
                title: 'Advanced Analytics',
                description: 'Track research impact, access patterns, and collaboration metrics with detailed insights.',
                color: 'from-purple-500 to-pink-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md rounded-3xl p-12 border border-cyan-500/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Secure Your Research?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join leading pharmaceutical companies and research institutions in protecting their valuable intellectual property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all"
                >
                  Contact Sales
                </motion.button>
              </Link>
              <Link to="/demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Request Demo
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section> 
    </div>
  );
};

export default Home;
