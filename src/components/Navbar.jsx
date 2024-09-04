import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white bg-opacity-30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-12 py-5 flex justify-center space-x-10">
        <Link
          to="/"
          className="text-lg text-blue-500 font-bold hover:text-blue-700 transition-colors duration-300"
        >
          Video Utilities
        </Link>
        <Link
          to="/generate-subtitles"
          className="text-lg text-gray-600 hover:text-blue-500 font-medium transition-colors duration-300"
        >
          Generate Subtitles
        </Link>
        <Link
          to="/extract-mp3"
          className="text-lg text-gray-600 hover:text-blue-500 font-medium transition-colors duration-300"
        >
          Extract MP3
        </Link>
        <Link
          to="/watermarking"
          className="text-lg text-gray-600 hover:text-blue-500 font-medium transition-colors duration-300"
        >
          Watermarking
        </Link>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-2xl -z-10"></div>
    </nav>
  );
}

export default Navbar;
