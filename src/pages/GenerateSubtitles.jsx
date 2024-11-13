import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import ProcessingIndicator from "../components/ProcessingIndicator";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

function GenerateSubtitles() {
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtitledVideo, setSubtitledVideo] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (file) => {
    setVideoFile(file);
    setSubtitledVideo(null);
    setError(null);
    setProgress(0);
  };

  const handleGenerateSubtitles = async () => {
    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/generatesubtitles`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      const subtitledVideoUrl = `${API_BASE_URL}${response.data.outputFile}`;
      setSubtitledVideo(subtitledVideoUrl);
    } catch (error) {
      console.error("Error generating subtitles:", error);
      setError(
        "Failed to generate subtitles. Please try again with a different video."
      );
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(subtitledVideo, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video-with-subtitles.mp4");
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
      <div className="max-w-4xl mx-auto text-center bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Generate Subtitles
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Automatically generate and embed subtitles into your video using AI.
        </p>

        <VideoUpload onFileSelect={handleFileUpload} />

        {videoFile && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Original Video:</h3>
            <CustomVideoPlayer src={URL.createObjectURL(videoFile)} />
            <button
              onClick={handleGenerateSubtitles}
              disabled={isProcessing}
              className={`mt-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Generating Subtitles..." : "Generate Subtitles"}
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4">
            <ProcessingIndicator />
            <p className="text-sm text-gray-600 mt-2">
              This may take a few minutes depending on the video length...
            </p>
            {progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {subtitledVideo && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Video with Generated Subtitles:
            </h3>
            <CustomVideoPlayer src={subtitledVideo} />
            <button
              onClick={handleDownload}
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Video with Subtitles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateSubtitles;
