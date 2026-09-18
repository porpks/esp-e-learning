'use client';

import React from 'react';

export default function JapaneseTab({ user }: { user: any }) {
  return (
    <div className="bg-rose-100/60 rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
      <div>
        <span className="text-sm text-slate-600 font-mono">ระดับภาษาญี่ปุ่นของคุณ...</span>
        <div className="text-6xl font-extrabold font-mono text-slate-800 mt-2">
          {user?.japaneseLevel || 'N5'}
        </div>
      </div>
      <div className="pt-12 text-center text-slate-800">
        <div className="text-6xl md:text-8xl font-extrabold font-mono tracking-tight leading-none">
          Function
        </div>
        <div className="text-5xl md:text-7xl font-bold mt-4">
          เพิ่มเติม
        </div>
        <div className="text-5xl md:text-7xl font-bold mt-4">
          ในอนาคต
        </div>
      </div>
    </div>
  );
}