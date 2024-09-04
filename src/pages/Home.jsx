import React from "react";
import { Link } from "react-router-dom";
import UtilityCard from "../components/UtilityCard";

function Home() {
  const utilities = [
    { name: "Generate Subtitles", path: "/generate-subtitles", large: true },
    { name: "Extract MP3", path: "/extract-mp3" },
    { name: "Video Format Conversion", path: "/video-format-conversion" },
    { name: "Watermarking", path: "/watermarking" },
    { name: "Video Merging", path: "/video-merging" },
    { name: "Video Compression", path: "/video-compression" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 pt-24">
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          VidTools: Video Utilities App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          All your video processing needs in one place.
        </p>
        <Link
          to="/generate-subtitles"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* Utility Cards - Bento Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {utilities.map((util) => (
            <UtilityCard
              key={util.name}
              name={util.name}
              path={util.path}
              large={util.large}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
