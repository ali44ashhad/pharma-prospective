// frontend/src/components/document/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { X, AlertCircle } from 'lucide-react';
import { paperService } from '../../services/api';

const getProtectedPdfUrl = (url) => {
  // Add watermark and other protection parameters to Cloudinary URL
  return url.replace('/upload/', '/upload/l_text:Arial_50:Pharma%20Prospective,co_gray,o_50/');
};

const DocumentViewer = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        console.log('Fetching paper with ID:', paperId);
        const response = await paperService.getById(paperId);
        console.log('Full API Response:', response);
        console.log('Paper data:', response.paper);
        console.log('File URL:', response.paper?.fileUrl);
        
        if (!response.paper) {
          throw new Error('Paper not found');
        }
        
        if (!response.paper.fileUrl) {
          console.error('Paper found but no fileUrl:', response.paper);
          throw new Error('PDF file URL not available');
        }

        // Check if the fileUrl is a valid Cloudinary URL
        const fileUrl = response.paper.fileUrl;
        console.log('Attempting to load PDF from URL:', fileUrl);
        
        if (!fileUrl.startsWith('http')) {
          console.error('Invalid file URL format:', fileUrl);
          throw new Error('Invalid PDF file URL');
        }

        setPaper(response.paper);
      } catch (error) {
        console.error('Error in DocumentViewer:', error);
        setError(error.message || 'Failed to load paper');
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [paperId]);

  // No need for watermark and render functions as we'll use iframe for PDF viewing

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-400">Loading document...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center text-red-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-white">{paper?.title}</h1>
              <p className="text-gray-400">By {paper?.authors?.join(', ')}</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 text-gray-400 hover:text-white rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Document Viewer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="w-full h-[calc(100vh-200px)] bg-gray-100">
              {paper?.fileUrl ? (
                <div className="w-full h-full flex flex-col">
                  <div className="relative w-full h-[calc(100vh-200px)] bg-gray-50 rounded-lg overflow-hidden">
                    {/* PDF Viewer */}
                    <iframe
                      src={getProtectedPdfUrl(paper.fileUrl)}
                      title={paper.title}
                      className="w-full h-full border-0"
                      style={{
                        pointerEvents: 'none', // Prevents selection and right-click
                      }}
                    />
                    
                    {/* Overlay to prevent interaction */}
                    <div 
                      className="absolute inset-0 pointer-events-none select-none"
                      style={{
                        background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 10px, transparent 10px, transparent 20px)'
                      }}
                    />

                    {/* Watermark Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.15]"
                      style={{
                        transform: 'rotate(-45deg)',
                      }}
                    >
                      <div className="text-gray-800 text-4xl font-bold whitespace-nowrap">
                        PHARMA PROSPECTIVE
                      </div>
                    </div>
                  </div>

                 
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>No PDF file URL available</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center"
          >
            <p className="text-gray-400 text-sm">
               🔒 This document is protected. Downloading, printing, and copying are disabled for security.
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DocumentViewer;