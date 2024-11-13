import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import axios from "axios";

// Configure base URL for API
const API_BASE_URL = "http://localhost:3001"; // Adjust this to match your backend URL

function VideoMerging() {
  const [videoFiles, setVideoFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedVideo, setMergedVideo] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    setVideoFiles([...videoFiles, ...e.target.files]);
  };

  const handleMergeVideos = async () => {
    if (videoFiles.length < 2) {
      setError("Please select at least two videos to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    videoFiles.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/merge`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Construct the full URL for the merged video
      const mergedVideoUrl = `${API_BASE_URL}${response.data.outputFile}`;
      setMergedVideo(mergedVideoUrl);
    } catch (error) {
      console.error("Merging failed:", error);
      setError("Video merging failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(mergedVideo, {
        responseType: "blob",
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "merged-video.mp4");
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
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Merge Videos</h2>
        <p className="text-lg text-gray-600 mb-8">
          Combine multiple videos into one seamless file.
        </p>
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 my-4"
        />
        {videoFiles.length > 0 && (
          <div className="text-left mb-4">
            <h3 className="text-lg font-semibold">Selected Videos:</h3>
            <ul className="list-disc list-inside">
              {Array.from(videoFiles).map((file, index) => (
                <li key={index} className="text-gray-700">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {videoFiles.length > 0 && (
          <button
            onClick={handleMergeVideos}
            disabled={isProcessing}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isProcessing ? "Merging..." : "Merge Videos"}
          </button>
        )}
        <ProcessingIndicator isProcessing={isProcessing} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {mergedVideo && (
          <div className="mt-8">
            <CustomVideoPlayer src={mergedVideo} />
            <button
              onClick={handleDownload}
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Merged Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoMerging;
