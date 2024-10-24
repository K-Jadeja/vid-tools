import React, { useState, useRef } from "react";
import axios from "axios";
import VideoUpload from "../components/VideoUpload";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

const API_URL = "http://localhost:3001/api/extract-mp3";

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
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAudioFile(response.data.outputFile);
    } catch (error) {
      console.error("Error extracting MP3:", error);
      setError("Failed to extract MP3. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Extract MP3</h2>
        <p className="text-lg text-gray-600 mb-8">
          Extract high-quality MP3 audio from your videos.
        </p>

        <VideoUpload onFileSelect={handleFileUpload} />

        {videoURL && (
          <div className="my-4">
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
          <div className="mt-8 p-6 rounded-lg shadow-lg">
            <audio
              controls
              className="w-full bg-white bg-opacity-30 backdrop-blur-md p-4 rounded-lg"
            >
              <source
                src={`http://localhost:3001${audioFile}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
            <a
              href={`http://localhost:3001${audioFile}`}
              download
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download MP3
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtractMp3;
