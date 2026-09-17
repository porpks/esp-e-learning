'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/lib/useUser'; // 🌟 Import Custom Hook

type TabType = 'profile' | 'courses' | 'certificates' | 'japanese';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [uploading, setUploading] = useState(false);

  const { user, loading: loadingUser, refreshUser } = useUser();

  const [stats] = useState<any>(null);
  const [achievements] = useState<any[]>([]);
  const [skills] = useState<any[]>([]);
  const [myCourses] = useState<{ completed: any[]; inProgress: any[] }>({
    completed: [],
    inProgress: [],
  });
  const [certificates] = useState<{ courseCerts: any[]; customCerts: any[] }>({
    courseCerts: [],
    customCerts: [],
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', String(user.id));

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        await refreshUser();
      } else {
        alert(data.error || 'อัปโหลดรูปไม่สำเร็จ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.id || !confirm('คุณต้องการลบรูปโปรไฟล์ใช่หรือไม่?')) return;

    setUploading(true);
    try {
      const res = await fetch(`/api/profile/avatar?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // 🌟 Refresh ข้อมูลกลางทันที
        await refreshUser();
      } else {
        alert('ลบรูปภาพไม่สำเร็จ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center text-slate-500 font-mono">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="w-5xl mx-auto p-6 font-sans">
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

      {/* 2. TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-blue-50/70 rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
          {/* ข้อมูลส่วนตัว */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">ข้อมูลส่วนตัว</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image & Upload Box */}
              <div className="relative w-48 h-48 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden shadow-sm shrink-0">
                {user?.profileImage ? (
                  <>
                    <Image src={user.profileImage} alt="Profile" fill className="object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      disabled={uploading}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full text-xs shadow transition-colors"
                      title="ลบรูปภาพ"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="text-slate-400 font-mono text-lg">Picture</span>
                )}

                <label className="absolute bottom-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-4 py-1 rounded cursor-pointer transition-colors">
                  {uploading ? 'Processing...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden disabled={uploading} />
                </label>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-sm text-slate-700 pt-2">
                <span className="font-semibold text-slate-500">Login</span>
                <span>{user?.username || '-'}</span>
                
                <span className="font-semibold text-slate-500">Team</span>
                <span>{user?.team || '-'}</span>
                
                <span className="font-semibold text-slate-500">First Name</span>
                <span>{user?.firstName || '-'}</span>
                
                <span className="font-semibold text-slate-500">Last Name</span>
                <span>{user?.lastName || '-'}</span>
                
                <span className="font-semibold text-slate-500">Employee No.</span>
                <span>{user?.empId || '-'}</span>
                
                <span className="font-semibold text-slate-500">Email</span>
                <span className="text-blue-600">{user?.email || '-'}</span>
                
                <span className="font-semibold text-slate-500">Japanese Level</span>
                <span>{user?.japaneseLevel || '-'}</span>
              </div>
            </div>
          </section>

          {/* สถิติการเรียนโดยรวม (รอเชื่อม API เพิ่มเติม) */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">สถิติการเรียนโดยรวม</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl h-24 shadow-sm border border-slate-100 flex flex-col justify-between">
                <span className="text-xs text-slate-500">ชั่วโมงเรียนสะสม</span>
                <span className="text-xl font-bold text-slate-800">{stats?.totalHours ?? '0'} ชม.</span>
              </div>
              <div className="bg-white p-5 rounded-xl h-24 shadow-sm border border-slate-100 flex flex-col justify-between">
                <span className="text-xs text-slate-500">คอร์สเรียนของฉัน</span>
                <span className="text-xl font-bold text-slate-800">{stats?.totalCourses ?? '0'} คอร์ส</span>
              </div>
              <div className="bg-white p-5 rounded-xl h-24 shadow-sm border border-slate-100 flex flex-col justify-between">
                <span className="text-xs text-slate-500">เรียนจบแล้ว</span>
                <span className="text-xl font-bold text-emerald-600">{stats?.completedCourses ?? '0'} คอร์ส</span>
              </div>
            </div>
          </section>

          {/* Achievement */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 font-mono">Achievement</h2>
            <div className="flex gap-6">
              {achievements.length > 0 ? (
                achievements.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-28 h-16 bg-white rounded-lg shadow-sm border border-slate-100" />
                    <span className="text-xs font-mono text-slate-600">{item.name}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 font-mono">ไม่มีข้อมูล Achievement</div>
              )}
            </div>
          </section>

          {/* My Skills */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 font-mono">My Skills</h2>
            <p className="text-xs text-slate-500 mb-4">พนักงานจะได้รับสกิล เมื่อเรียนจบคอร์สที่เกี่ยวข้องกับสกิลนั้น</p>
            <div className="flex gap-8">
              {skills.length > 0 ? (
                skills.map((skill, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center gap-2">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl text-amber-300 shadow-sm">
                      ★
                    </div>
                    <div className="text-xs font-mono text-slate-700">
                      <div>{skill.name}</div>
                      <div>{skill.level}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 font-mono">ยังไม่มีทักษะที่ได้รับ</div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* 3. TAB 2: MY COURSE */}
      {activeTab === 'courses' && (
        <div className="bg-cyan-50/70 rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">คอร์สที่เรียนจบแล้ว</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {myCourses.completed.length > 0 ? (
                myCourses.completed.map((course: any, i: number) => (
                  <div key={i} className="p-4 bg-white rounded-2xl shadow-sm">{course.title}</div>
                ))
              ) : (
                <div className="col-span-4 text-sm text-slate-400 font-mono">ยังไม่มีคอร์สที่เรียนจบ</div>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">คอร์สที่กำลังเรียนอยู่</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {myCourses.inProgress.length > 0 ? (
                myCourses.inProgress.map((course: any, i: number) => (
                  <div key={i} className="p-4 bg-white rounded-2xl shadow-sm">{course.title}</div>
                ))
              ) : (
                <div className="col-span-4 text-sm text-slate-400 font-mono">ยังไม่มีคอร์สที่กำลังเรียน</div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* 4. TAB 3: MY CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="bg-yellow-100/60 rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
          <button className="text-blue-600 underline font-mono text-sm hover:text-blue-800">
            Upload Certificates
          </button>
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 font-mono">Certificate ที่ได้รับจากคอร์สเรียน</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {certificates.courseCerts.length > 0 ? (
                certificates.courseCerts.map((cert: any, i: number) => (
                  <div key={i} className="p-4 bg-white rounded-2xl shadow-sm">{cert.name}</div>
                ))
              ) : (
                <div className="col-span-4 text-sm text-slate-400 font-mono">ไม่มี Certificate จากคอร์สเรียน</div>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 font-mono">Certificate ที่อัปโหลดเพิ่ม</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {certificates.customCerts.length > 0 ? (
                certificates.customCerts.map((cert: any, i: number) => (
                  <div key={i} className="p-4 bg-white rounded-2xl shadow-sm">{cert.name}</div>
                ))
              ) : (
                <div className="col-span-4 text-sm text-slate-400 font-mono">ไม่มี Certificate ที่อัปโหลดเพิ่ม</div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* 5. TAB 4: JAPANESE LEVELS */}
      {activeTab === 'japanese' && (
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
      )}
    </div>
  );
}