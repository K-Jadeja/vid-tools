import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

function VideoFormatConversion() {
  const [videoFile, setVideoFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedVideo, setConvertedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
    setConvertedVideo(null);
    setError(null);
  };

  const handleConvertVideo = async () => {
    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("format", outputFormat);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/formatconversion`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const convertedVideoUrl = `${API_BASE_URL}${response.data.outputFile}`;
      setConvertedVideo(convertedVideoUrl);
      setFileSize((response.data.fileSize / (1024 * 1024)).toFixed(2)); // Convert to MB
    } catch (error) {
      console.error("Conversion failed:", error);
      setError("Video conversion failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(convertedVideo, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `converted-video.${outputFormat}`);
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
          Video Format Conversion
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Convert your video files to different formats.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Output Format
            </label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 mb-4"
            >
              <option value="mp4">MP4</option>
              <option value="avi">AVI</option>
              <option value="mkv">MKV</option>
              <option value="mov">MOV</option>
              <option value="webm">WebM</option>
            </select>
            <button
              onClick={handleConvertVideo}
              disabled={isProcessing}
              className={`bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Converting..." : "Convert Video"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {convertedVideo && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Converted Video Preview {fileSize && `(Size: ${fileSize} MB)`}:
            </h3>
            <CustomVideoPlayer src={convertedVideo} />
            <button
              onClick={handleDownload}
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Converted Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoFormatConversion;
