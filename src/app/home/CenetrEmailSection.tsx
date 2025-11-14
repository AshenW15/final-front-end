import React from 'react';
import heroBg from '../../../public/center_banner.jpg';

export default function CenetrEmailSection() {
  return (
    <section className="w-full h-[380px] md:h-[450px] relative flex items-center justify-center">
      {/* Background image container */}
      <div
        className="w-[80%] h-full bg-center bg-no-repeat bg-cover rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg.src})`,
        }}
      >
        {/* Overlay for smooth dim effect */}
        <div className="absolute inset-0 bg-white/10"></div>
      </div>

      {/* Brush stroke / painting effect behind content */}
      <div className="absolute z-5 w-2/4 h-24 md:h-32 bg-white rotate-[-7deg] rounded-xl blur-2xl"></div>
      <div className="absolute z-5 w-2/4 h-24 md:h-32 bg-white rotate-[5deg] rounded-xl blur-2xl"></div>

      {/* Content */}
      <div className="absolute z-10 flex flex-col items-center w-full px-4">
        {/* Logo + Text */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 drop-shadow-md">
          Storevia
        </h2>
        <p className="text-gray-700 mt-1 mb-5 drop-shadow-lg text-sm md:text-base">
          A Personal Shopping Experience
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-xl relative">
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-full p-[2px] "></div>

          {/* Input container */}
          <div className="w-full max-w-xl relative flex items-center">
            {/* Gradient border wrapper for input */}
            <div className="flex-1 rounded-full p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full bg-white px-5 py-2 outline-none text-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Search button */}
            <button className="ml-2 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow">
              <span className="text-white text-lg">🔍</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
