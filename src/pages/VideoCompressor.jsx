import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Adjust this to match your backend URL

function VideoCompressor() {
  const [videoFile, setVideoFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedVideo, setCompressedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressionStats, setCompressionStats] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
    setCompressedVideo(null); // Clear previous output when a new file is uploaded
    setError(null);
    setOriginalSize((file.size / (1024 * 1024)).toFixed(2)); // Calculate original file size in MB
  };

  const handleCompressVideo = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    setError(null);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("quality", compressionLevel);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/compress`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Construct the full URL for the compressed video
      const compressedVideoUrl = `${API_BASE_URL}${response.data.outputFile}`;
      setCompressedVideo(compressedVideoUrl);
      setCompressedSize(
        (response.data.stats.compressedSize / (1024 * 1024)).toFixed(2)
      );
      setCompressionStats(response.data.stats);
    } catch (error) {
      console.error("Compression failed:", error);
      setError("Video compression failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(compressedVideo, {
        responseType: "blob",
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "compressed-video.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download the video. Please try again.");
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
              Original Video Preview (Size: {originalSize} MB):
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
              <option value="very_high">Very High (1080p, 3000kbps)</option>
              <option value="high">High (720p, 2000kbps)</option>
              <option value="medium">Medium (480p, 1000kbps)</option>
              <option value="low">Low (360p, 500kbps)</option>
              <option value="very_low">Very Low (240p, 250kbps)</option>
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
            {compressionStats && (
              <div className="mb-4 text-gray-600">
                <p>Compression Ratio: {compressionStats.compressionRatio}</p>
              </div>
            )}
            <CustomVideoPlayer src={compressedVideo} />
            <button
              onClick={handleDownload}
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Compressed Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCompressor;
