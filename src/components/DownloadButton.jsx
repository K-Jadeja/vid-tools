import React from "react";

function DownloadButton({ downloadUrl, label }) {
  return (
    <a
      href={downloadUrl}
      download
      className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-colors"
    >
      {label}
    </a>
  );
}

export default DownloadButton;
