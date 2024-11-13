import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

function Watermarking() {
  const [videoFile, setVideoFile] = useState(null);
  const [watermarkFile, setWatermarkFile] = useState(null);
  const [position, setPosition] = useState("bottomright");
  const [size, setSize] = useState("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedVideo, setWatermarkedVideo] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
    setWatermarkedVideo(null);
    setError(null);
  };

  const handleWatermarkUpload = (e) => {
    if (e.target.files[0]) {
      setWatermarkFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAddWatermark = async () => {
    if (!videoFile || !watermarkFile) {
      setError("Please select both a video and a watermark image.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("watermark", watermarkFile);
    formData.append("position", position);
    formData.append("size", size);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/watermark`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const watermarkedVideoUrl = `${API_BASE_URL}${response.data.outputFile}`;
      setWatermarkedVideo(watermarkedVideoUrl);
    } catch (error) {
      console.error("Watermarking failed:", error);
      setError("Failed to add watermark. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(watermarkedVideo, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "watermarked-video.mp4");
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
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Add Watermark</h2>
        <p className="text-lg text-gray-600 mb-8">
          Protect your videos by adding custom watermarks.
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
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Watermark Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleWatermarkUpload}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              >
                <option value="topleft">Top Left</option>
                <option value="topright">Top Right</option>
                <option value="bottomleft">Bottom Left</option>
                <option value="bottomright">Bottom Right</option>
                <option value="center">Center</option>
              </select>
            </div>

            <button
              onClick={handleAddWatermark}
              disabled={isProcessing || !watermarkFile}
              className={`bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors ${
                isProcessing || !watermarkFile
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isProcessing ? "Processing..." : "Add Watermark"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {watermarkedVideo && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Watermarked Video:</h3>
            <CustomVideoPlayer src={watermarkedVideo} />
            <button
              onClick={handleDownload}
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Watermarked Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watermarking;
