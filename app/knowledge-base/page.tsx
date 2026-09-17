'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ESPKnowledgeModern() {
  const [mainMenu, setMainMenu] = useState<'CAD' | 'SYSTEM'>('CAD');
  const [subMenu, setSubMenu] = useState('HOME');

  // ข้อมูลจำลองสำหรับ CAD
  const cadContents = [
    { id: 1, topic: '08 - STANDARD MOLD ESP', path: 'Eng. Knowledge » Overall', date: '2025-06-16', isNew: true },
    { id: 2, topic: '01 Welding', path: 'Eng. Knowledge » Overall', date: '2025-04-21', isNew: true },
    { id: 3, topic: '02 Materials', path: 'Eng. Knowledge » Overall', date: '2025-04-21', isNew: true },
    { id: 4, topic: '03 Mechanical drawing', path: 'Eng. Knowledge » Overall', date: '2025-04-21', isNew: true },
    { id: 5, topic: '04 Car production line', path: 'Eng. Knowledge » Overall', date: '2025-04-21', isNew: true },
  ];

  // ข้อมูลจำลองสำหรับหน้า SYSTEM
  const systemCategories = [
    'BASIC IT', 'INFRASTRUCTURE', 'SOLUTION', 'PROGRAMMING', 'PRODUCT'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">

      {/* 2. Mode Switcher (CAD KNOWLEDGE / IT SYSTEM) ด้านบน */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner border border-slate-300">
            <button 
              onClick={() => { setMainMenu('CAD'); setSubMenu('HOME'); }}
              className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                mainMenu === 'CAD' 
                  ? 'bg-[#0B2545] text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CAD KNOWLEDGE
            </button>
            <button 
              onClick={() => { setMainMenu('SYSTEM'); setSubMenu('SYSTEM TECHNIQUE'); }}
              className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                mainMenu === 'SYSTEM' 
                  ? 'bg-[#0B2545] text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IT SYSTEM
            </button>
          </div>
        </div>
      </div>

      {/* 3. Hero Header (โทนสี ESP Navy) */}
      <div className="relative overflow-hidden bg-[#0B2545] py-12 sm:py-16 shadow-inner text-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {mainMenu === 'CAD' ? 'CAD Knowledge Center' : 'System Technical Guide'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl mx-auto">
            เข้าถึงคลังเอกสาร คู่มือ และบทเรียนสำหรับพนักงานได้ง่ายๆ ในที่เดียว
          </p>

          {/* Sub-navbar (Pill Menu) */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {(mainMenu === 'CAD' 
              ? ['HOME', 'OPERATION', 'ENG. KNOWLEDGE', 'PRINCIPLE DESIGN', 'SPECIAL KNOWLEDGE']
              : ['HOME', 'PROJECT RULE', 'SYSTEM TECHNIQUE', 'SYSTEM CASE STUDY', 'TEST']
            ).map((item) => (
              <button
                key={item}
                onClick={() => setSubMenu(item)}
                className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                  subMenu === item 
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-md transform scale-105' 
                    : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item === 'HOME' ? '🏠 ' : ''}{item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* === มุมมองหน้า CAD (List View) === */}
        {mainMenu === 'CAD' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl text-lg">✨</span>
              <h3 className="text-xl font-bold text-slate-900">Newest Knowledges</h3>
            </div>

            <div className="space-y-3">
              {cadContents.map((item) => (
                <div 
                  key={item.id} 
                  className="group flex flex-col sm:flex-row sm:items-center bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 p-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                >
                  {/* ป้าย NEW */}
                  <div className="shrink-0 mb-2 sm:mb-0 mr-4">
                    <div className="bg-rose-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase flex items-center justify-center">
                      New
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-slate-900 font-bold text-sm group-hover:text-blue-700 transition-colors">
                      {item.topic}
                    </h4>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      {item.path}
                    </p>
                  </div>

                  <div className="shrink-0 text-slate-400 text-xs font-medium mt-2 sm:mt-0 bg-white px-3 py-1 rounded-md border border-slate-200">
                    🕒 {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === มุมมองหน้า SYSTEM (Grid View) === */}
        {mainMenu === 'SYSTEM' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[400px]">
            <div className="text-slate-400 text-xs font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="text-[#0B2545]">HOME</span> <span className="text-slate-300">/</span> {subMenu}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {systemCategories.map((cat, idx) => (
                <div 
                  key={idx}
                  className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-[#0B2545] flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    📘
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-[#0B2545] text-xs tracking-wider transition-colors">
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}