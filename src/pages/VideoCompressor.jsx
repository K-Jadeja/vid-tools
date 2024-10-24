import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import axios from "axios";

function VideoCompressor() {
  const [videoFile, setVideoFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedVideo, setCompressedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
    setCompressedVideo(null); // Clear previous output when a new file is uploaded
    setError(null);
  };

  const handleCompressVideo = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    setError(null); // Clear previous errors
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("quality", compressionLevel);

    try {
      const response = await axios.post("/api/compress", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCompressedVideo(response.data.outputFile);
      setCompressedSize((response.data.fileSize / (1024 * 1024)).toFixed(2)); // Compressed file size in MB
    } catch (error) {
      console.error("Compression failed:", error);
      setError("Video compression failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15 bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Compress Video
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Reduce the size of your video files without losing quality.
        </p>

        <VideoUpload onFileSelect={handleFileUpload} />

        {videoFile && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Original Video Preview:
            </h3>
            <CustomVideoPlayer src={URL.createObjectURL(videoFile)} />
          </div>
        )}

        {videoFile && (
          <div className="mt-4">
            <select
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(e.target.value)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 mb-4"
            >
              <option value="very_high">Very High</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="very_low">Very Low</option>
            </select>

            <button
              onClick={handleCompressVideo}
              className={`bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors mt-4 ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Compress Video"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {compressedVideo && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Compressed Video Preview (Size: {compressedSize} MB):
            </h3>
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
