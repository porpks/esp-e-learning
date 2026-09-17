'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'path'>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  const categories = [
    'Work', 'Language', 'HR & Culture', 'Operations', 'IT Security', 'Soft Skill'
  ];

  const courses = [
    {
      id: 1,
      title: 'วิธีรับมือกับความเครียด',
      description: 'คอร์สนี้จะพาพนักงานไปรู้วิธีการต่างๆ ในการรับมือความเครียด',
      hours: '10 ชม.',
      category: 'Soft Skill',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
    },
    {
      id: 2,
      title: 'วิธีรับมือกับคนประสาท',
      description: 'คอร์สนี้จะพาพนักงานอยู่ร่วมกับคนหลายรูปแบบ',
      hours: '2 ชม.',
      category: 'Soft Skill',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
    },
    {
      id: 3,
      title: 'กล้าที่จะแตกต่าง',
      description: 'เสียงของทุกคนมีค่า ลุกขึ้นมาดิฟ!',
      hours: '3 ชม.',
      category: 'Soft Skill',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="What you want to study today?"
            className="w-full px-6 py-3.5 rounded-full bg-cyan-50/80 border border-cyan-200 text-slate-800 text-sm outline-none shadow-sm placeholder-slate-400 focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 border border-slate-200'
                : 'bg-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            คอร์สเรียนทั้งหมด
          </button>
          <button
            onClick={() => setActiveTab('path')}
            className={`px-8 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all ${
              activeTab === 'path'
                ? 'bg-white text-slate-900 border border-slate-200'
                : 'bg-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Learning Path
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          
          {/* Sidebar Filter ฝั่งซ้าย */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 mb-4">พนักงานต้องการพัฒนาทักษะด้านใด</h4>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedSkill === cat}
                      onChange={() => setSelectedSkill(selectedSkill === cat ? 'All' : cat)}
                      className="w-3.5 h-3.5 rounded bg-cyan-100 border-none text-cyan-600 focus:ring-0"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <button className="text-xs font-bold text-slate-600 hover:text-slate-900">
                Certificates
              </button>
            </div>
          </div>

          {/* Main Course Content ฝั่งขวา */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-2xl font-black text-slate-900">คอร์สเรียนทั้งหมด</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    {/* ปกคอร์ส */}
                    <div className="h-40 bg-slate-200 relative overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/60 text-white backdrop-blur-sm">
                        {course.category}
                      </span>
                    </div>

                    {/* รายละเอียด */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                      <p className="text-[11px] text-slate-400 pt-1">ชั่วโมงเรียน {course.hours}</p>
                    </div>
                  </div>

                  {/* ปุ่มเริ่มเรียน */}
                  <div className="p-4 pt-0">
                    <button className="w-full py-2 bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs rounded-xl shadow transition-colors">
                      เริ่มเรียนเลย
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}