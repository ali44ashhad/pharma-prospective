// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard'; 
import DocumentViewer from './components/document/DocumentViewer';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Team from './pages/Team';
import Cookies from './pages/Cookies.jsx';
import DataProtection from './pages/DataProtection.jsx'; 
import Help from './pages/Help.jsx';
import Status from './pages/Status.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import ResearchPapers from './pages/ResearchPapers.jsx';
import UploadPaper from './pages/UploadPaper.jsx';
import AdminPanel from './components/admin/Adminpanel.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop/>
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white relative">
          <Header/>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/team" element={<Team />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/data-protection" element={<DataProtection />} /> 
              <Route path="/help" element={<Help />} />
              <Route path="/status" element={<Status />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/view/:paperId" element={
                <ProtectedRoute>
                  <DocumentViewer />
                </ProtectedRoute>
              } /> 
              <Route path="/papers" element={
                <ProtectedRoute>
                  <ResearchPapers />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute requireAdmin>
                  <UploadPaper />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;