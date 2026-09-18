'use client';

import React, { useState } from 'react';
import { useUser } from '@/lib/useUser';
import ProfileTab from '@/components/profile/ProfileTab';
import CoursesTab from '@/components/profile/CoursesTab';
import CertificatesTab from '@/components/profile/CertificatesTab';
import JapaneseTab from '@/components/profile/JapaneseTab';

type TabType = 'profile' | 'courses' | 'certificates' | 'japanese';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { user, loading: loadingUser, refreshUser, setUser } = useUser();

  if (loadingUser) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center text-slate-500 font-mono">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto p-6 font-sans">
      {/* 1. Header Tabs Navigation */}
      <div className="flex gap-2 mb-0">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-2.5 rounded-t-xl font-bold text-sm transition-colors ${
            activeTab === 'profile' ? 'bg-blue-100 text-slate-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-2.5 rounded-t-xl font-bold text-sm transition-colors ${
            activeTab === 'courses' ? 'bg-cyan-100 text-slate-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          My Course
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-6 py-2.5 rounded-t-xl font-bold text-sm transition-colors ${
            activeTab === 'certificates' ? 'bg-yellow-200 text-slate-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          My Certificates
        </button>
        <button
          onClick={() => setActiveTab('japanese')}
          className={`px-6 py-2.5 rounded-t-xl font-bold text-sm transition-colors ${
            activeTab === 'japanese' ? 'bg-rose-100 text-slate-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Japanese Levels
        </button>
      </div>

      {/* 2. Content Area */}
      {activeTab === 'profile' && <ProfileTab user={user} refreshUser={refreshUser} setUser={setUser} />}
      {activeTab === 'courses' && <CoursesTab />}
      {activeTab === 'certificates' && <CertificatesTab />}
      {activeTab === 'japanese' && <JapaneseTab user={user} />}
    </div>
  );
}