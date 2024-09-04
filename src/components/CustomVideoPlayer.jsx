import React from "react";

const CustomVideoPlayer = ({ src, poster }) => {
  return (
    <div className="relative">
      <video
        controls
        autoPlay={false}
        preload="auto"
        poster={poster}
        style={{ width: "100%", height: "auto" }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <a
        href={src}
        download
        className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
      >
        Download
      </a>
    </div>
  );
};

export default CustomVideoPlayer;
