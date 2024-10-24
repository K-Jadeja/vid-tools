import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import axios from "axios";

function GenerateSubtitles() {
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [videoWithSubs, setVideoWithSubs] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
    setSubtitleFile(null); // Clear previous subtitles
    setVideoWithSubs(null); // Clear previous video
    setError(null);
  };

  const handleGenerateSubtitles = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post("/api/generate-subtitles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSubtitleFile(response.data.subtitleFile);
      setVideoWithSubs(response.data.videoWithSubs);
    } catch (error) {
      console.error("Error generating subtitles:", error);
      setError("Failed to generate subtitles. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Generate Subtitles
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Automatically generate subtitles for your video.
        </p>

        <VideoUpload onFileSelect={handleFileUpload} />

        {videoFile && (
          <div className="mt-8">
            <CustomVideoPlayer src={URL.createObjectURL(videoFile)} />
            <button
              onClick={handleGenerateSubtitles}
              className={`mt-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Generate Subtitles"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {subtitleFile && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Download Subtitles:</h3>
            <a
              href={subtitleFile}
              download
              className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Subtitles (.srt)
            </a>
          </div>
        )}

        {videoWithSubs && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Preview Video with Subtitles:
            </h3>
            <CustomVideoPlayer src={videoWithSubs} />
            <a
              href={videoWithSubs}
              download
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Video with Subtitles
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateSubtitles;
