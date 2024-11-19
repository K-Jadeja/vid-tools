import React from "react";
import { Link } from "react-router-dom";

function UtilityCard({ name, path, large }) {
  const isGenerateSubtitles = name === "Generate Subtitles";

  return (
    <Link
      to={path}
      className={`relative bg-opacity-30 backdrop-blur-lg border border-white/10 shadow-lg rounded-lg p-8 hover:shadow-2xl transform hover:scale-105 transition duration-300 ${
        large ? "sm:col-span-2 sm:row-span-2" : ""
      } ${
        isGenerateSubtitles
          ? "bg-gradient-to-r from-purple-200 to-blue-200 text-black"
          : "bg-white bg-opacity-30"
      }`}
    >
      <h2
        className={`font-bold mb-4 ${
          isGenerateSubtitles ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
        }`}
      >
        {name}
      </h2>
      <p className={`text-gray-700 ${isGenerateSubtitles ? "md:text-xl" : ""}`}>
        {isGenerateSubtitles
          ? "Automatically generate and add subtitles to your videos."
          : `Use the ${name} utility to process your video.`}
      </p>
    </Link>
  );
}

export default UtilityCard;
