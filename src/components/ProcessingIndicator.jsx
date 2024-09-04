import React from "react";

function ProcessingIndicator({ isProcessing }) {
  return isProcessing ? (
    <div className="flex items-center justify-center space-x-2 my-4">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
      <p className="text-gray-700">Processing your video...</p>
    </div>
  ) : null;
}

export default ProcessingIndicator;
