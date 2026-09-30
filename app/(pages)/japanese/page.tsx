'use client';

import React from 'react';
import Navbar from '@/components/Navbar';

export default function JapaneseHubPage() {
  const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1', 'General'];
  const categories = ['Vocabulary', 'Kanji', 'Japanese for work', 'Prepare to Japan'];

  return (
    <div className="min-h-screen bg-esp-bg text-esp-text pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Title & Search */}
        <div className="text-center space-y-4">
          <h1 className="text-h3 md:text-h1 font-bold tracking-wider text-esp-text">ESP JAPANESE</h1>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="What you want to study today?"
              className="w-full px-6 py-3 rounded-full bg-esp-softblue/80 border border-esp-lightblue text-esp-text text-d4 outline-none shadow-sm placeholder-esp-mutedblue focus:ring-2 focus:ring-esp-primary"
            />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          
          {/* Sidebar Filter ฝั่งซ้าย */}
          <div className="bg-esp-white p-6 rounded-2xl border border-esp-lightblue shadow-sm h-fit space-y-6">
            <div>
              <h4 className="text-d4 font-bold text-esp-mutedblue mb-3">JLPT Level</h4>
              <div className="space-y-2">
                {jlptLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2.5 text-d4 text-esp-text cursor-pointer hover:text-esp-primary transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded bg-esp-softblue border-esp-lightblue text-esp-primary focus:ring-esp-primary" />
                    <span className="font-medium">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-esp-lightblue/50 pt-4">
              <h4 className="text-d4 font-bold text-esp-mutedblue mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-d4 text-esp-text cursor-pointer hover:text-esp-primary transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded bg-esp-softblue border-esp-lightblue text-esp-primary focus:ring-esp-primary" />
                    <span className="font-medium">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content ฝั่งขวา */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Leader's Board */}
            <section className="space-y-3">
              <h3 className="text-d2 font-bold text-esp-text">Leader’s Board</h3>
              <div className="bg-esp-white border border-esp-lightblue rounded-2xl p-6 shadow-sm min-h-[160px] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-r border-esp-lightblue/50 pr-4 flex items-center justify-center text-esp-mutedblue text-d4 font-medium">
                  Top Learners Ranking
                </div>
                <div className="flex items-center justify-center text-esp-mutedblue text-d4 font-medium">
                  Department Stats
                </div>
              </div>
            </section>

            {/* Japanese Course */}
            <section className="space-y-3">
              <h3 className="text-d2 font-bold text-esp-text">Japanese Course</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-esp-white rounded-2xl border border-esp-lightblue h-44 shadow-sm hover:shadow-md transition-shadow"></div>
                ))}
              </div>
            </section>

            {/* Japanese Quiz */}
            <section className="space-y-3">
              <h3 className="text-d2 font-bold text-esp-text">Japanese Quiz</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-esp-white rounded-2xl border border-esp-lightblue h-44 shadow-sm hover:shadow-md transition-shadow"></div>
                ))}
              </div>
            </section>

            {/* Japanese JLPT Test */}
            <section className="space-y-3">
              <h3 className="text-d2 font-bold text-esp-text">Japanese JLPT Test</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-esp-white rounded-2xl border border-esp-lightblue h-44 shadow-sm hover:shadow-md transition-shadow"></div>
                ))}
              </div>
            </section>

          </div>

        </div>
      </main>
    </div>
  );
}