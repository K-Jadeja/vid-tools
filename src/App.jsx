import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GenerateSubtitles from "./pages/GenerateSubtitles";
import ExtractMp3 from "./pages/ExtractMP3";
import VideoFormatConversion from "./pages/VideoFormatConversion";
import Watermarking from "./pages/Watermarking";
import VideoMerging from "./pages/VideoMerging";
import VideoCompressor from "./pages/VideoCompressor";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-subtitles" element={<GenerateSubtitles />} />
        <Route path="/extract-mp3" element={<ExtractMp3 />} />
        <Route
          path="/video-format-conversion"
          element={<VideoFormatConversion />}
        />
        <Route path="/watermarking" element={<Watermarking />} />
        <Route path="/video-merging" element={<VideoMerging />} />
        <Route path="/video-compression" element={<VideoCompressor />} />
      </Routes>
      <div className="transition-layer">
        <div className="h-5 bg-gradient-to-b from-[#e6e9fe] to-[#c1dbfe]"></div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
