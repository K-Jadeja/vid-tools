import React from "react";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-blue-200 via-purple-100 to-blue-200 py-10">
      {/* SVG Wave at the Top of the Footer */}
      <div className="absolute inset-x-0 top-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L80,112C160,128,320,160,480,186.7C640,213,800,235,960,213.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-800">VidTools</h2>
            <p className="text-gray-700 mt-2 max-w-xs">
              Transforming the way you process videos. Efficient, powerful, and
              easy-to-use tools.
            </p>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.46 6.03c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.74.85-2.71 1.05A4.14 4.14 0 0015.85 4c-2.27 0-4.1 1.83-4.1 4.09 0 .32.04.64.1.94-3.41-.17-6.44-1.81-8.47-4.28-.35.6-.55 1.3-.55 2.05 0 1.42.72 2.67 1.83 3.4-.67-.02-1.3-.21-1.85-.51v.05c0 1.99 1.42 3.65 3.3 4.03-.34.09-.71.14-1.09.14-.27 0-.52-.03-.78-.08.53 1.64 2.06 2.83 3.87 2.86a8.3 8.3 0 01-5.14 1.77c-.33 0-.66-.02-.98-.05 1.83 1.17 4 1.85 6.34 1.85 7.6 0 11.76-6.29 11.76-11.76 0-.18-.01-.37-.02-.55.8-.57 1.5-1.27 2.05-2.08z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.75 3H4.25C3.01 3 2 4.01 2 5.25v13.5C2 19.99 3.01 21 4.25 21h15.5c1.24 0 2.25-1.01 2.25-2.25V5.25C22 4.01 20.99 3 19.75 3zm-5.17 14.5h-2.14V12h-1.46v-2.02h1.46V8.25c0-1.57.9-2.42 2.28-2.42.66 0 1.35.12 1.35.12v1.45h-.76c-.75 0-.98.47-.98 1.01v1.13h1.87l-.3 2.02h-1.57v5.5z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.65 8.06 8.06 8.06 1.53 0 2.96-.4 4.2-1.12l2.91 2.91a.75.75 0 001.06 0l.01-.01a.75.75 0 00-.01-1.06l-2.91-2.91c.71-1.24 1.11-2.67 1.11-4.21 0-5.5-4.46-9.96-9.96-9.96zm0 1.5c4.66 0 8.46 3.8 8.46 8.46 0 4.66-3.8 8.46-8.46 8.46-4.66 0-8.46-3.8-8.46-8.46 0-4.66 3.8-8.46 8.46-8.46zm-4.71 4.2a.75.75 0 00-.75.75v5.36a.75.75 0 00.75.75h5.35a.75.75 0 000-1.5H8.55l4.36-4.36a.75.75 0 00-1.06-1.06l-4.36 4.36V7.49a.75.75 0 00-.75-.75z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-white/30 mt-8 pt-6 text-center">
          <p className="text-gray-700 text-sm">
            &copy; {new Date().getFullYear()} VidTools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
