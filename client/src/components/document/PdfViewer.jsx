import React from 'react';

const PdfViewer = ({ fileUrl }) => {
  if (!fileUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">No document available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={fileUrl}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;