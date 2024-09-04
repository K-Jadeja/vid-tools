import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

function VideoCompressor() {
  const [videoFile, setVideoFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedVideo, setCompressedVideo] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
  };

  const handleCompressVideo = () => {
    setIsProcessing(true);
    // Simulate backend processing
    setTimeout(() => {
      setIsProcessing(false);
      setCompressedVideo("/assets/Elon Musk_Lex Fridman720p.mp4");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Compress Video
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Reduce the size of your video files without losing quality.
        </p>
        <VideoUpload onFileSelect={handleFileUpload} />
        {videoFile && (
          <div className="mt-4">
            <select
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(e.target.value)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 mb-4"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              onClick={handleCompressVideo}
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors"
            >
              Compress Video
            </button>
          </div>
        )}
        <ProcessingIndicator isProcessing={isProcessing} />
        {compressedVideo && (
          <div className="mt-8">
            <CustomVideoPlayer src={compressedVideo} />
            <a
              href={compressedVideo}
              download
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Compressed Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCompressor;
