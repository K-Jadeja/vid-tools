import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

function ExtractMp3() {
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
  };

  const handleExtractMp3 = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAudioFile("/assets/Elon Musk_Lex Fridman720p.mp4");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Extract MP3</h2>
        <p className="text-lg text-gray-600 mb-8">
          Extract high-quality MP3 audio from your videos.
        </p>
        <VideoUpload onFileSelect={handleFileUpload} />
        {videoFile && (
          <button
            onClick={handleExtractMp3}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            Extract MP3
          </button>
        )}
        <ProcessingIndicator isProcessing={isProcessing} />
        {audioFile && (
          <div className="mt-8">
            <CustomVideoPlayer src={videoFile.name} />
            <a
              href={audioFile}
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
