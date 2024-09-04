import React from "react";

function Footer() {
  return (
    <footer className="bg-white bg-opacity-20 backdrop-blur-lg border-t border-white/30 shadow-lg py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800">VidTools</h2>
            <p className="text-gray-600 mt-2">
              Your one-stop solution for all video processing needs.
            </p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>

        <div className="border-t border-white/30 mt-6 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} VidTools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
