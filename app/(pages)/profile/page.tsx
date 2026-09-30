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
      <div className="max-w-6xl mx-auto p-12 text-center text-esp-mutedblue font-medium text-d3">
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
          className={`px-6 py-2.5 rounded-t-xl font-bold text-d4 transition-colors cursor-pointer ${
            activeTab === 'profile' 
              ? 'bg-esp-text text-esp-white' 
              : 'bg-esp-softblue text-esp-mutedblue hover:bg-esp-lightblue hover:text-esp-text'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-2.5 rounded-t-xl font-bold text-d4 transition-colors cursor-pointer ${
            activeTab === 'courses' 
              ? 'bg-esp-text text-esp-white' 
              : 'bg-esp-softblue text-esp-mutedblue hover:bg-esp-lightblue hover:text-esp-text'
          }`}
        >
          My Course
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-6 py-2.5 rounded-t-xl font-bold text-d4 transition-colors cursor-pointer ${
            activeTab === 'certificates' 
              ? 'bg-esp-text text-esp-white' 
              : 'bg-esp-softblue text-esp-mutedblue hover:bg-esp-lightblue hover:text-esp-text'
          }`}
        >
          My Certificates
        </button>
        <button
          onClick={() => setActiveTab('japanese')}
          className={`px-6 py-2.5 rounded-t-xl font-bold text-d4 transition-colors cursor-pointer ${
            activeTab === 'japanese' 
              ? 'bg-esp-text text-esp-white' 
              : 'bg-esp-softblue text-esp-mutedblue hover:bg-esp-lightblue hover:text-esp-text'
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