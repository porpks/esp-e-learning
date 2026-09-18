import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-slate-50 px-4 text-slate-800">
      <div className="text-center space-y-6 max-w-lg bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        
        {/* กราฟิก 404 */}
        <div className="relative">
          <h1 className="text-9xl font-black text-slate-100 drop-shadow-sm tracking-tighter">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* ข้อความแจ้งเตือน */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#0B2545]">Oops! ไม่พบหน้าที่คุณค้นหา</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            ดูเหมือนว่า URL ที่คุณพยายามเข้าถึงจะไม่มีอยู่จริง อาจถูกลบไปแล้ว หรือคุณอาจพิมพ์ที่อยู่ผิดพลาด
          </p>
        </div>

        {/* ปุ่มกลับไปหน้าอื่นๆ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full px-6 py-2.5 bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer">
              กลับสู่หน้าหลัก
            </button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}