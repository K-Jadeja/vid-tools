import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

function VideoFormatConversion() {
  const [videoFile, setVideoFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedVideo, setConvertedVideo] = useState(null);

  const handleFileUpload = (file) => {
    setVideoFile(file);
  };

  const handleConvertVideo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      //   setConvertedVideo(`/path/to/converted_video.${outputFormat}`);
      setConvertedVideo(`/assets/Elon Musk_Lex Fridman720p.mp4`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Video Format Conversion
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Convert your video files to different formats.
        </p>
        <VideoUpload onFileSelect={handleFileUpload} />
        {videoFile && (
          <div className="mt-4">
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 mb-4"
            >
              <option value="mp4">MP4</option>
              <option value="avi">AVI</option>
              <option value="mkv">MKV</option>
              <option value="mov">MOV</option>
            </select>
            <button
              onClick={handleConvertVideo}
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors"
            >
              Convert Video
            </button>
          </div>
        )}
        <ProcessingIndicator isProcessing={isProcessing} />
        {convertedVideo && (
          <div className="mt-8">
            <CustomVideoPlayer src={videoFile.name} />
            <a
              href={convertedVideo}
              download
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Converted Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoFormatConversion;
