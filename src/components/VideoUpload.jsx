import React from "react";

function VideoUpload({ onFileSelect }) {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="relative group cursor-pointer w-full max-w-md">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => onFileSelect(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
        />
        <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white/30 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 ease-in-out w-full">
          <svg
            className="w-16 h-16 text-blue-600 mb-4 group-hover:text-blue-800 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 12v8m0 0v-8m0 0L8 8m4 4l4-4m-8-4h8a2 2 0 012 2v12a2 2 0 01-2 2h-8a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
          <p className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            Upload Video
          </p>
          <p className="text-md text-gray-600 mt-1 group-hover:text-gray-700">
            Drag & drop or click to browse
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
