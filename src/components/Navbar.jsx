import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] md:w-auto">
      <div className="bg-white bg-opacity-30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-4 md:px-12 py-5">
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center space-x-10">
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

        {/* Mobile Menu Button and Title */}
        <div className="md:hidden flex items-center justify-between">
          <Link
            to="/"
            className="text-lg text-blue-500 font-bold hover:text-blue-700 transition-colors duration-300"
          >
            Video Utilities
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-blue-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4">
            <div className="flex flex-col space-y-4">
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
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-2xl -z-10"></div>
    </nav>
  );
}

export default Navbar;
