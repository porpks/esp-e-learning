'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* ==========================================
          🌟 1. Top Navbar (Modern Glassmorphism)
      ========================================== */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* โลโก้แบรนด์ */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              E
            </div>
            <span className="font-bold text-xl tracking-wide text-slate-900 dark:text-white hidden sm:block">
              Enterprise Hub
            </span>
          </div>

          {/* สวิตช์สลับโหมด CAD / SYSTEM */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => { setMainMenu('CAD'); setSubMenu('HOME'); }}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                mainMenu === 'CAD' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              CAD KNOWLEDGE
            </button>
            <button 
              onClick={() => { setMainMenu('SYSTEM'); setSubMenu('SYSTEM TECHNIQUE'); }}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                mainMenu === 'SYSTEM' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              IT SYSTEM
            </button>
          </div>

          {/* เมนูฝั่งขวา */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              🔍
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">
                Pacharaphol K.
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          🌟 2. Hero Banner (อารมณ์เดียวกับหน้า Login)
      ========================================== */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-blue-900 via-indigo-950 to-slate-900 py-16 sm:py-24 shadow-xl">
        {/* วงกลมแสง Background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            {mainMenu === 'CAD' ? 'CAD Knowledge Center' : 'System Technical Guide'}
          </h1>
          <p className="text-lg text-blue-200/80 mb-8 max-w-2xl mx-auto">
            เข้าถึงคลังเอกสาร คู่มือ และบทเรียนสำหรับพนักงานได้ง่ายๆ ในที่เดียว
          </p>

          {/* Sub-navbar (Pill Menu) */}
          <div className="flex flex-wrap justify-center gap-3">
            {(mainMenu === 'CAD' 
              ? ['HOME', 'OPERATION', 'ENG. KNOWLEDGE', 'PRINCIPLE DESIGN', 'SPECIAL KNOWLEDGE']
              : ['HOME', 'PROJECT RULE', 'SYSTEM TECHNIQUE', 'SYSTEM CASE STUDY', 'TEST']
            ).map((item) => (
              <button
                key={item}
                onClick={() => setSubMenu(item)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                  subMenu === item 
                    ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/40 transform scale-105' 
                    : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item === 'HOME' ? '🏠 ' : ''}{item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================
          🌟 3. Content Section (ปรับตาม Theme Dashboard)
      ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        
        {/* === มุมมองหน้า CAD (List View) === */}
        {mainMenu === 'CAD' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
              <span className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-xl">✨</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Newest Knowledges</h3>
            </div>

            <div className="space-y-4">
              {cadContents.map((item) => (
                <div 
                  key={item.id} 
                  className="group flex flex-col sm:flex-row sm:items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 border border-transparent hover:border-blue-200 dark:hover:border-slate-600 p-5 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                  {/* ป้าย NEW แบบพรีเมียม */}
                  <div className="shrink-0 mb-3 sm:mb-0 mr-5">
                    <div className="bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg shadow-md shadow-red-500/30 uppercase flex items-center justify-center">
                      New
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-slate-900 dark:text-white font-bold text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.topic}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      {item.path}
                    </p>
                  </div>

                  <div className="shrink-0 text-slate-400 dark:text-slate-500 text-sm font-medium mt-3 sm:mt-0 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    🕒 {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === มุมมองหน้า SYSTEM (Grid View) === */}
        {mainMenu === 'SYSTEM' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 min-h-[400px]">
            <div className="text-slate-400 dark:text-slate-500 text-sm font-bold mb-8 uppercase tracking-widest flex items-center gap-2">
              <span className="text-indigo-500">HOME</span> <span className="text-slate-300 dark:text-slate-600">/</span> {subMenu}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {systemCategories.map((cat, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20"
                >
                  {/* แสงวงกลมโผล่ตอน Hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="text-5xl mb-4 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300">
                    📘
                  </div>
                  <span className="relative z-10 font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm tracking-widest transition-colors">
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