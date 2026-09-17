'use client';

import React from 'react';
import Navbar from '@/components/Navbar';

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-wide leading-tight">
            Function <br />
            เพิ่มเติม <br />
            ในอนาคต
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest pt-2">
            Q/A & FAQs Section - Coming Soon
          </p>
        </div>
      </main>
    </div>
  );
}