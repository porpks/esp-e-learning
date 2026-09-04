'use client';

import React from 'react';

// ข้อมูลจำลองสำหรับคอร์สเรียน
const mockCourses = [
  {
    id: 1,
    title: 'ปฐมนิเทศพนักงานใหม่ 2030',
    description: 'เรียนรู้วัฒนธรรมองค์กรและสวัสดิการเบื้องต้นสำหรับพนักงานใหม่',
    progress: 100,
    category: 'HR & Culture',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'ความปลอดภัยทางไซเบอร์ 101 (PDPA)',
    description: 'ข้อควรระวังและการจัดการข้อมูลส่วนบุคคลตามกฎหมาย PDPA',
    progress: 45,
    category: 'IT Security',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 3,
    title: 'การใช้งานระบบ ERP เบื้องต้น',
    description: 'คู่มือการเบิกจ่ายและจัดการทรัพยากรผ่านระบบกลางของบริษัท',
    progress: 0,
    category: 'Operations',
    color: 'from-emerald-500 to-teal-500',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-12 transition-colors duration-300">
      {/* แถบนำทางด้านบน (Navbar) */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                K
              </div>
              <span className="font-bold tracking-wide text-lg text-slate-900 dark:text-white">ENTERPRISE HUB</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">ยินดีต้อนรับ, พัชรพล (emp_10492)</span>
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-600 border-2 border-blue-500 flex items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-200">
                PK
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ส่วนเนื้อหาหลัก */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* ส่วนหัวต้อนรับ */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">คอร์สเรียนของคุณ (Learning Hub)</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">ดำเนินการเรียนรู้ต่อ หรือค้นหาคอร์สใหม่เพื่อพัฒนาทักษะ</p>
          </div>
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            ดูคลังเอกสารภายใน (KMS) ➔
          </button>
        </header>

        {/* ระบบกริดแสดงการ์ดคอร์สเรียน */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 dark:hover:shadow-blue-900/20 transition-all duration-300 flex flex-col"
            >
              {/* ภาพหน้าปกคอร์ส */}
              <div className={`h-32 bg-gradient-to-r ${course.color} relative`}>
                <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                  {course.category}
                </div>
              </div>

              {/* ข้อมูลคอร์ส */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 flex-1">{course.description}</p>
                
                {/* แถบแสดงความคืบหน้า (Progress Bar) */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <span>ความคืบหน้า</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* ปุ่มเข้าเรียน */}
                <button 
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    course.progress === 100 
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600' 
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {course.progress === 100 ? 'ทบทวนเนื้อหา' : course.progress > 0 ? 'เรียนต่อให้จบ' : 'เริ่มเรียน'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}