'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตอนนี้เป็น UI จำลอง ไว้พรุ่งนี้เชื่อม API ล็อกอินจริงครับ
    alert(`กำลังพยายามล็อกอินด้วย User: ${username}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* ฝั่งซ้าย: รูปภาพและแบรนด์องค์กร (จะซ่อนบนหน้าจอมือถือ) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-tr from-blue-900 via-indigo-950 to-slate-900 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        
        {/* โลโก้ / ชื่อระบบ */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/30">
            K
          </div>
          <span className="text-xl font-bold tracking-wider text-white">ENTERPRISE HUB</span>
        </div>

        {/* ข้อความต้อนรับฝั่งซ้าย */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Central Knowledge & Learning Platform
          </h1>
          <p className="text-slate-400 text-lg">
            ศูนย์กลางการเรียนรู้และคลังเอกสารความรู้ภายในองค์กร เข้าถึงทุกระบบได้ในที่เดียวอย่างปลอดภัย
          </p>
        </div>

        {/* ฟุตเตอร์ฝั่งซ้าย */}
        <div className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} Internal Portal System. All rights reserved.
        </div>
      </div>

      {/* ฝั่งขวา: ฟอร์ม Log In */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* หัวข้อฟอร์ม */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              เข้าสู่ระบบ
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              กรอกบัญชีผู้ใช้เดียวกับระบบภายในบริษัทเพื่อเข้าใช้งาน
            </p>
          </div>

          {/* แบบฟอร์ม */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                รหัสประจำตัวพนักงาน / Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="เช่น emp_10492"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  รหัสผ่าน / Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <span className="ml-2">จำการเข้าสู่ระบบ</span>
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                ลืมรหัสผ่าน?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform active:scale-[0.98]"
            >
              เข้าสู่ระบบ (Sign In)
            </button>
          </form>

          {/* ข้อความช่วยเหลือเพิ่มเติม */}
          <div className="pt-6 text-center text-xs text-slate-500 border-t border-slate-800">
            หากพบปัญหาการเข้าใช้งาน กรุณาติดต่อฝ่าย IT Support โทร. 1234
          </div>

        </div>
      </div>
    </div>
  );
}