import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import ProcessingIndicator from "../components/ProcessingIndicator";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

function VideoMerging() {
  const [videoFiles, setVideoFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedVideo, setMergedVideo] = useState(null);

  const handleFileUpload = (e) => {
    setVideoFiles([...videoFiles, ...e.target.files]);
  };

  const handleMergeVideos = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMergedVideo("/assets/Elon Musk_Lex Fridman720p.mp4");
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-40 px-6">
      <div className="max-w-4xl mx-auto text-center mt-15">
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
          <button
            onClick={handleMergeVideos}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            Merge Videos
          </button>
        )}
        <ProcessingIndicator isProcessing={isProcessing} />
        {mergedVideo && (
          <div className="mt-8">
            <CustomVideoPlayer src={mergedVideo} />
            <a
              href={mergedVideo}
              download
              className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors"
            >
              Download Merged Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoMerging;
