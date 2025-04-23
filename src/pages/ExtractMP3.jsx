import React, { useState } from "react";
import axios from "axios";
import VideoUpload from "../components/VideoUpload";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

const API_BASE_URL = "http://localhost:3001";

function ExtractMp3() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
    setError(null);
    setAudioFile(null);
  };

  const handleExtractMp3 = async () => {
    if (!videoFile) {
      setError("Please upload a video file.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/extract-mp3`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const audioUrl = `${API_BASE_URL}${response.data.outputFile}`;
      setAudioFile(audioUrl);
    } catch (error) {
      console.error("Error extracting MP3:", error);
      setError("Failed to extract MP3. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(audioFile, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "extracted-audio.mp3");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download the audio. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15 bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Extract MP3</h2>
        <p className="text-lg text-gray-600 mb-8">
          Extract high-quality MP3 audio from your videos.
        </p>

        <VideoUpload onFileSelect={handleFileUpload} />

        {videoURL && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Video Preview:</h3>
            <CustomVideoPlayer
              src={videoURL}
              poster={null}
              showDownload={false}
            />
          </div>
        )}

        {videoFile && (
          <button
            onClick={handleExtractMp3}
            className={`bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors mt-4 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Extract MP3"}
          </button>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {audioFile && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Extracted Audio:</h3>
            <audio
              controls
              className="w-full bg-white bg-opacity-30 backdrop-blur-md p-4 rounded-lg"
            >
              <source src={audioFile} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={handleDownload}
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download MP3
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtractMp3;
