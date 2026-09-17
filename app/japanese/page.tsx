'use client';

import React from 'react';
import Navbar from '@/components/Navbar';

export default function JapaneseHubPage() {
  const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1', 'General'];
  const categories = ['Vocabulary', 'Kanji', 'Japanese for work', 'Prepare to Japan'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Title & Search */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black tracking-wider text-[#0B2545]">ESP JAPANESE</h1>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="What you want to study today?"
              className="w-full px-6 py-3 rounded-full bg-cyan-50/80 border border-cyan-200 text-slate-800 text-sm outline-none shadow-sm placeholder-slate-400 focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          
          {/* Sidebar Filter ฝั่งซ้าย */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 mb-3">JLPT Level</h4>
              <div className="space-y-2">
                {jlptLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded bg-cyan-100 border-none text-cyan-600 focus:ring-0" />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-500 mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded bg-cyan-100 border-none text-cyan-600 focus:ring-0" />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content ฝั่งขวา */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Leader's Board */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Leader’s Board</h3>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[160px] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-r border-slate-100 pr-4 flex items-center justify-center text-slate-400 text-sm">
                  Top Learners Ranking
                </div>
                <div className="flex items-center justify-center text-slate-400 text-sm">
                  Department Stats
                </div>
              </div>
            </section>

            {/* Japanese Course */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Japanese Course</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-2xl border border-slate-200 h-44 shadow-sm hover:shadow-md transition-shadow"></div>
                ))}
              </div>
            </section>

            {/* Japanese Quiz */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Japanese Quiz</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-2xl border border-slate-200 h-44 shadow-sm hover:shadow-md transition-shadow"></div>
                ))}
              </div>
            </section>

            {/* Japanese JLPT Test */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Japanese JLPT Test</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-2xl border border-slate-200 h-44 shadow-sm hover:shadow-md transition-shadow"></div>
                ))}
              </div>
            </section>

          </div>

        </div>
      </main>
    </div>
  );
}