import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

function GenerateSubtitles() {
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtitleFile, setSubtitleFile] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
  };

  const handleGenerateSubtitles = () => {
    setIsProcessing(true);
    // Simulate backend processing
    setTimeout(() => {
      setIsProcessing(false);
      setSubtitleFile("/assets/video.mp4");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center  ">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 ">
          Generate Subtitles
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Automatically generate subtitles for your video with ease.
        </p>
        <VideoUpload onFileSelect={handleFileUpload} />
        {videoFile && (
          <button
            onClick={handleGenerateSubtitles}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            Generate Subtitles
          </button>
        )}
        <ProcessingIndicator isProcessing={isProcessing} />
        {subtitleFile && (
          <div className="mt-8">
            <CustomVideoPlayer src={videoFile.name} />
            <a
              href={subtitleFile}
              download
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Subtitles
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateSubtitles;
