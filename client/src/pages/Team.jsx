import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Linkedin, 
  Github,
  Award,
  BookOpen,
  Shield
} from 'lucide-react'; 

const Team = () => {
  const teamMembers = [
    {
      name: 'Madava Hegde',
      role: 'Founding Partner & CEO',
      department: 'Leadership',
      image: '/api/placeholder/400/400',
      bio: `With over a decade of experience in the pharmaceutical sector, he has provided advisory services to investors and companies within the industry. His expertise spans across multiple geographical regions, including regulated markets such as the United States and Europe, as well as emerging markets such as India, Southeast Asia, the Middle East, and Africa.`,
      expertise: [
        'Portfolio Development - Dossier Sourcing, Negotiation and finalization of contracts',
        'Growth Strategy - Product portfolio expansion, Geography Expansion',
        'Commercial Diligence - Proposed Investment'
      ]
    },
    {
      name: 'Aman Preet',
      role: 'Engagement Manager',
      department: 'Consulting',
      image: '/api/placeholder/400/400',
      bio: `Aman is a healthcare and pharma specialist with 10+ years of experience across the U.S., U.K., Middle East, and Southeast Asia. He has led commercial and strategic due diligence for payors, providers, and pharma firms, supporting market entry, digital transformation, and growth. His strength lies in evaluating complex businesses and driving actionable, high-impact strategies.`,
      expertise: [
        'Commercial due diligences, feasibility studies, market entry strategies, and go-to-market planning',
        'Geo-expansion strategies to increase market share and enhance revenue streams',
        'Strategic Planning, operational excellence and cost optimization'
      ]
    },
    {
      name: 'Ritika',
      role: 'Consultant',
      department: 'Consulting',
      image: '/api/placeholder/400/400',
      bio: `Ritika is a life sciences and pharma specialist with 10+ years of experience spanning from life sciences research to management consulting. She excels in aligning research goals to client requirements and generating valuable insights.`,
      expertise: [
        'Market Landscaping',
        'Growth Strategy & Opportunity Sizing',
        'Technology Assessment',
        'Treatment Pathways & Patient Journey',
        'Primary Research with KOLs, HCPs, industry experts',
        'Developing Industry Assessment for DRHP (IPO)',
        'Data analytics from pharmaceutical databases'
      ]
    },
    {
      name: 'Mohammad Zaid',
      role: 'Associate Consultant',
      department: 'Consulting',
      image: '/api/placeholder/400/400',
      bio: `Mohammad Zaid has 2+ years of expertise in forecasting methodologies, market research, and analytical automation across global therapeutic markets, delivering strategic insights for high-value assets.`,
      expertise: [
        'Patient-based and epidemiological forecasting',
        'Trend-based revenue projection modelling',
        'Competitive landscape assessment',
        'KPI tracking and performance monitoring'
      ]
    }
  ];

  const departments = [
    {
      name: 'Research',
      icon: BookOpen,
      description: 'Our research team ensures scientific accuracy and maintains the highest standards of research integrity.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Technology',
      icon: Shield,
      description: 'Building and maintaining the secure infrastructure that powers our research platform.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Security',
      icon: Award,
      description: 'Dedicated to protecting your research data with cutting-edge security measures.',
      color: 'from-purple-500 to-pink-600'
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
            Meet Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Passionate experts dedicated to advancing pharmaceutical research through secure collaboration
          </motion.p>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Departments</h2>
            <p className="text-gray-400 text-lg">
              Specialized teams working together to deliver excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${dept.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <dept.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{dept.name}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {dept.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Experts</h2>
            <p className="text-gray-400 text-lg">
              Meet the brilliant minds behind our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.floor(index / 3) * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all group"
              >
                {/* Member Image */}
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-12 h-12 text-white" />
                </div>

                {/* Member Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-cyan-400 font-medium mb-1">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.department}</p>
                </div>

                <p className="text-gray-300 text-sm text-center mb-4 leading-relaxed">
                  {member.bio}
                </p>

                {/* Expertise */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    href={`mailto:`}
                    className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md rounded-3xl p-12 border border-cyan-500/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our Team
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Passionate about advancing pharmaceutical research and security? 
              We're always looking for talented individuals to join our mission.
            </p>
            <motion.a
              href="/careers"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-cyan-500 text-white font-semibold rounded-2xl hover:bg-cyan-600 transition-all"
            >
              <span>View Open Positions</span>
            </motion.a>
          </motion.div>
        </div>
      </section> 
    </div>
  );
};

export default Team;
