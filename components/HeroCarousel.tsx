'use client';

import React from 'react';

export default function HeroCarousel() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-md">
      {/* Search Input Floating */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl">
        <input
          type="text"
          placeholder="Searching..."
          className="w-full px-5 py-2.5 rounded-full bg-cyan-50/90 backdrop-blur-md text-slate-800 text-sm outline-none shadow-lg border border-cyan-200 placeholder-slate-400 focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Banner Display Area */}
      <div className="relative h-56 sm:h-64 bg-slate-100 flex items-center justify-center p-6 border-b border-slate-200">
        <div className="border-4 border-slate-800 p-6 rounded-lg text-center max-w-md bg-white text-slate-900 shadow-sm">
          <h2 className="text-2xl font-black tracking-wide text-blue-900">ประชาสัมพันธ์</h2>
          <p className="text-sm font-bold tracking-widest text-slate-600 mt-1">INFORMATION</p>
        </div>

        {/* Carousel Controls */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-2xl font-bold p-2">
          &lt;
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-2xl font-bold p-2">
          &gt;
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
        </div>
      </div>
    </div>
  );
}