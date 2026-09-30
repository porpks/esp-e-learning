'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen bg-esp-bg flex flex-col">
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-h1 md:text-big font-bold text-esp-text opacity-30 tracking-wide leading-tight">
            พี่ มม ทำ
          </h1>
          <p className="text-esp-mutedblue text-d4 font-bold uppercase tracking-widest pt-2">
            Knowledge Base Section - Coming Soon
          </p>
        </div>
      </main>
    </div>
  );
}