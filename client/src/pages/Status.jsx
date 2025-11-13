// frontend/src/pages/Status.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Database, 
  Shield, 
  Cloud, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react'; 

const Status = () => {
  const [systems, setSystems] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from an API
  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setSystems([
          {
            id: 1,
            name: 'Web Application',
            status: 'operational',
            description: 'Main research portal interface',
            responseTime: '142ms',
            uptime: '99.98%',
            lastIncident: '14 days ago'
          },
          {
            id: 2,
            name: 'API Services',
            status: 'operational',
            description: 'REST API and backend services',
            responseTime: '89ms',
            uptime: '99.99%',
            lastIncident: '21 days ago'
          },
          {
            id: 3,
            name: 'Database Cluster',
            status: 'operational',
            description: 'Primary data storage and replication',
            responseTime: '23ms',
            uptime: '99.99%',
            lastIncident: '45 days ago'
          },
          {
            id: 4,
            name: 'File Storage',
            status: 'degraded',
            description: 'Research paper storage and CDN',
            responseTime: '256ms',
            uptime: '99.85%',
            lastIncident: '2 hours ago'
          },
          {
            id: 5,
            name: 'Authentication',
            status: 'operational',
            description: 'User authentication and authorization',
            responseTime: '67ms',
            uptime: '99.97%',
            lastIncident: '7 days ago'
          },
          {
            id: 6,
            name: 'Security Services',
            status: 'operational',
            description: 'Encryption and security monitoring',
            responseTime: '45ms',
            uptime: '100%',
            lastIncident: 'Never'
          }
        ]);

        setIncidents([
          {
            id: 1,
            title: 'Increased latency in file uploads',
            status: 'monitoring',
            severity: 'minor',
            systems: ['File Storage'],
            started: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            updates: [
              {
                time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                message: 'Performance improvements deployed. Monitoring system response.',
                status: 'monitoring'
              },
              {
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                message: 'Identified increased latency in file processing pipeline. Investigating root cause.',
                status: 'investigating'
              }
            ]
          },
          {
            id: 2,
            title: 'Scheduled maintenance completed',
            status: 'resolved',
            severity: 'maintenance',
            systems: ['Web Application', 'API Services'],
            started: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
            resolved: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
            updates: [
              {
                time: new Date(Date.now() - 22 * 60 * 60 * 1000),
                message: 'Maintenance completed successfully. All systems operational.',
                status: 'resolved'
              },
              {
                time: new Date(Date.now() - 24 * 60 * 60 * 1000),
                message: 'Scheduled maintenance window started. Some services may be temporarily unavailable.',
                status: 'maintenance'
              }
            ]
          }
        ]);

        setLastUpdated(new Date());
        setLoading(false);
      }, 1000);
    };

    fetchStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'outage':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'major':
        return 'bg-orange-500 text-white';
      case 'minor':
        return 'bg-yellow-500 text-white';
      case 'maintenance':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatUptime = (uptime) => {
    return uptime === '100%' ? '100%' : uptime;
  };

  const formatDuration = (start, end = new Date()) => {
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const refreshStatus = () => {
    setLastUpdated(new Date());
    // In real app, this would trigger an API call
  };

  const overallStatus = systems.every(s => s.status === 'operational') 
    ? 'operational' 
    : systems.some(s => s.status === 'outage') 
      ? 'outage' 
      : 'degraded';

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                System Status
              </h1>
              <p className="text-xl text-gray-300">
                Real-time status of Pharma Research Platform services
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshStatus}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </motion.div>

          {/* Overall Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(overallStatus)}
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    All Systems {overallStatus === 'operational' ? 'Operational' : 'Experiencing Issues'}
                  </h2>
                  <p className="text-gray-400">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full border ${getStatusColor(overallStatus)}`}>
                {overallStatus.toUpperCase()}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Systems Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  <span>System Status</span>
                </h2>
                <p className="text-gray-400 mt-2">
                  Current status of all platform components
                </p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                          <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-1/4"></div>
                            <div className="h-3 bg-white/10 rounded w-1/2"></div>
                          </div>
                          <div className="w-20 h-8 bg-white/10 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {systems.map((system, index) => (
                      <motion.div
                        key={system.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            {system.name.includes('Database') && <Database className="w-5 h-5 text-cyan-400" />}
                            {system.name.includes('API') && <Cloud className="w-5 h-5 text-cyan-400" />}
                            {system.name.includes('Security') && <Shield className="w-5 h-5 text-cyan-400" />}
                            {system.name.includes('Web') && <Server className="w-5 h-5 text-cyan-400" />}
                            {system.name.includes('File') && <Database className="w-5 h-5 text-cyan-400" />}
                            {system.name.includes('Authentication') && <Shield className="w-5 h-5 text-cyan-400" />}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{system.name}</h3>
                            <p className="text-gray-400 text-sm">{system.description}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span>Response: {system.responseTime}</span>
                              <span>Uptime: {formatUptime(system.uptime)}</span>
                              <span>Last incident: {system.lastIncident}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full border text-sm ${getStatusColor(system.status)}`}>
                              {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                            </div>
                          </div>
                          {getStatusIcon(system.status)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Incidents & Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Active Incidents */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span>Active Incidents</span>
                </h2>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="p-4 bg-white/5 rounded-xl space-y-2">
                          <div className="h-4 bg-white/10 rounded w-3/4"></div>
                          <div className="h-3 bg-white/10 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : incidents.filter(i => i.status !== 'resolved').length > 0 ? (
                  <div className="space-y-4">
                    {incidents
                      .filter(incident => incident.status !== 'resolved')
                      .map((incident, index) => (
                        <motion.div
                          key={incident.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-white font-semibold text-sm">
                              {incident.title}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(incident.severity)}`}>
                              {incident.severity}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-400 mb-3">
                            <div>Affected: {incident.systems.join(', ')}</div>
                            <div>Duration: {formatDuration(incident.started)}</div>
                          </div>

                          <div className="text-sm text-gray-300">
                            {incident.updates[0]?.message}
                          </div>
                        </motion.div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-400">No active incidents</p>
                    <p className="text-gray-500 text-sm">All systems are operating normally</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Metrics */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <span>System Metrics</span>
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Overall Uptime (30 days)</span>
                  <span className="text-green-400 font-semibold">99.96%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Average Response Time</span>
                  <span className="text-cyan-400 font-semibold">104ms</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Users</span>
                  <span className="text-white font-semibold">2,847</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Research Papers</span>
                  <span className="text-white font-semibold">15,239</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">API Requests (24h)</span>
                  <span className="text-white font-semibold">2.1M</span>
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Recent Incidents</h2>
              </div>

              <div className="p-6">
                {incidents
                  .filter(incident => incident.status === 'resolved')
                  .slice(0, 3)
                  .map((incident, index) => (
                    <div key={incident.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                      <div>
                        <p className="text-white text-sm">{incident.title}</p>
                        <p className="text-gray-400 text-xs">
                          {incident.started.toLocaleDateString()} • {formatDuration(incident.started, incident.resolved)}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Resolved
                      </span>
                    </div>
                  ))
                }
                
                {incidents.filter(incident => incident.status === 'resolved').length === 0 && (
                  <p className="text-gray-400 text-center py-4">No recent incidents</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subscribe to Updates */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 text-center"
        >
          <h3 className="text-2xl font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get notified about system status changes, maintenance windows, and incident updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div> 
    </div>
  );
};

export default Status;