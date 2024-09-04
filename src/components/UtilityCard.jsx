import React from "react";
import { Link } from "react-router-dom";

function UtilityCard({ name, path, large }) {
  return (
    <Link
      to={path}
      className={`relative bg-white bg-opacity-30 backdrop-blur-lg border border-white/10 shadow-lg rounded-lg p-8 hover:shadow-2xl transform hover:scale-105 transition duration-300 ${
        large ? "col-span-2 row-span-2" : ""
      }`}
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-4">{name}</h2>
      <p className="text-gray-700">
        {name === "Generate Subtitles"
          ? "Automatically generate and add subtitles to your videos."
          : `Use the ${name} utility to process your video.`}
      </p>
    </Link>
  );
}

export default UtilityCard;
