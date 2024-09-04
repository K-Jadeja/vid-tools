import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

function Watermarking() {
  const [videoFile, setVideoFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedVideo, setWatermarkedVideo] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
  };

  const handleAddWatermark = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWatermarkedVideo("/assets/Elon Musk_Lex Fridman720p.mp4");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Add Watermark</h2>
        <p className="text-lg text-gray-600 mb-8">
          Protect your videos by adding custom watermarks.
        </p>
        <VideoUpload onFileSelect={handleFileUpload} />
        {videoFile && (
          <div className="mt-4">
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 mb-4"
            />
            <button
              onClick={handleAddWatermark}
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors"
            >
              Add Watermark
            </button>
          </div>
        )}
        <ProcessingIndicator isProcessing={isProcessing} />
        {watermarkedVideo && (
          <div className="mt-8">
            <CustomVideoPlayer src={videoFile.name} />
            <a
              href={watermarkedVideo}
              download
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Watermarked Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watermarking;
