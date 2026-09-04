'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // ป้องกัน Hydration Mismatch สำหรับไอคอน
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // ระหว่างโหลด ให้แสดงพื้นที่ว่างๆ ขนาดเท่าปุ่มไว้ก่อน กันเลย์เอาต์ขยับ
    return <div className="fixed bottom-6 right-6 w-12 h-12 z-50"></div>;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-yellow-400 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all duration-200"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        // ไอคอน ☀️ สำหรับโหมด Dark (กดเพื่อเปลี่ยนเป็น Light)
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // ไอคอน 🌙 สำหรับโหมด Light (กดเพื่อเปลี่ยนเป็น Dark)
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}