'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ProfileTab({ user, refreshUser, setUser }: { user: any, refreshUser: () => void, setUser: (user: any) => void }) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats] = useState<any>(null);
  const [achievements] = useState<any[]>([]);
  const [skills] = useState<any[]>([]);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setUploadStatus('idle');
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setUploadStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || !user?.id) return;

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', String(user.id));

    try {
      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setUser({ ...user, profileImage: data.url });

        // await refreshUser();

        setSelectedFile(null);
        setPreviewImage(null);
        setUploadStatus('idle');
      } else {
        setUploadStatus('error');
      }
    } catch (err) {
      setUploadStatus('error');
    }
  };

  const handleRemoveImage = async () => {
    if (previewImage) {
      handleCancelUpload();
      return;
    }

    if (!user?.id || !confirm('คุณต้องการลบรูปโปรไฟล์ใช่หรือไม่?')) return;

    setUploadStatus('uploading');
    try {
      const res = await fetch(`/api/upload/avatar?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUser({ ...user, profileImage: null });

        // await refreshUser();
      } else {
        alert('ลบรูปภาพไม่สำเร็จ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setUploadStatus('idle');
    }
  };

  // กำหนดว่าตอนนี้ควรโชว์รูปพรีวิว หรือรูปเดิมจาก Database
  const displayImage = previewImage || user?.profileImage;

  return (
    <div className="bg-esp-white border border-esp-lightblue shadow-sm rounded-b-2xl rounded-tr-2xl p-8 space-y-8 min-h-[600px]">
      <section>
        <h2 className="text-d2 font-bold text-esp-text mb-6">ข้อมูลส่วนตัว</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* ส่วนจัดการรูปโปรไฟล์ */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            {/* กรอบรูป (เปลี่ยนสีขอบเป็นสีแดงเมื่อ Error) */}
            <div className={`relative w-48 h-48 bg-esp-white rounded-xl flex flex-col items-center justify-center overflow-hidden shadow-sm border-4 transition-colors ${uploadStatus === 'error' ? 'border-red-500' : 'border-esp-softblue'}`}>
              
              {displayImage ? (
                <>
                  <Image src={displayImage} alt="Profile" fill className="object-cover" unoptimized />
                  
                  {/* โชว์ปุ่ม 'ลบรูป (X)' เฉพาะเมื่อไม่ใช่โหมดพรีวิว และไม่ได้ติด Error */}
                  {uploadStatus === 'idle' && (
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full text-xs w-6 shadow transition-colors z-10 cursor-pointer"
                      title={previewImage ? "ยกเลิกรูปนี้" : "ลบรูปโปรไฟล์"}
                    >
                      ✕
                    </button>
                  )}
                </>
              ) : (
                <span className="text-esp-mutedblue font-bold text-d3">Picture</span>
              )}

              {/* ปุ่ม Upload เริ่มต้น (ซ่อนเมื่อมีพรีวิวรูป หรือกำลัง Error) */}
              {!previewImage && uploadStatus !== 'error' && (
                <label className={`absolute bottom-2 ${uploadStatus === 'uploading' ? 'bg-slate-300 text-slate-500' : 'bg-esp-softblue hover:bg-esp-lightblue text-esp-primary'} text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer transition-colors z-10`}>
                  {uploadStatus === 'uploading' ? 'Processing...' : 'Upload'}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} hidden disabled={uploadStatus === 'uploading'} />
                </label>
              )}
            </div>

            {/* พื้นที่ปุ่มควบคุม (โชว์เมื่อมีการเลือกรูปพรีวิว หรือเกิด Error) */}
            <div className="h-10 flex items-center justify-center">
              {uploadStatus === 'error' ? (
                <button
                  onClick={handleCancelUpload}
                  className="px-4 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 font-bold text-sm rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  ↻ Refresh
                </button>
              ) : previewImage ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmUpload}
                    disabled={uploadStatus === 'uploading'}
                    className="px-4 py-1.5 bg-esp-primary hover:opacity-90 text-esp-white font-bold text-sm rounded-lg transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {uploadStatus === 'uploading' ? 'Uploading...' : 'Confirm'}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    disabled={uploadStatus === 'uploading'}
                    className="px-4 py-1.5 bg-esp-softblue hover:bg-esp-lightblue text-esp-primary font-bold text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          {/* จบส่วนจัดการรูปโปรไฟล์ */}

          {/* ข้อมูลส่วนตัวด้านขวา */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-d4 text-esp-text pt-2">
            <span className="font-semibold text-esp-mutedblue">Login</span>
            <span className="font-medium">{user?.username || '-'}</span>
            <span className="font-semibold text-esp-mutedblue">Team</span>
            <span className="font-medium">{user?.team || '-'}</span>
            <span className="font-semibold text-esp-mutedblue">First Name</span>
            <span className="font-medium">{user?.firstName || '-'}</span>
            <span className="font-semibold text-esp-mutedblue">Last Name</span>
            <span className="font-medium">{user?.lastName || '-'}</span>
            <span className="font-semibold text-esp-mutedblue">Employee No.</span>
            <span className="font-medium">{user?.empId || '-'}</span>
            <span className="font-semibold text-esp-mutedblue">Email</span>
            <span className="font-bold text-esp-primary">{user?.email || '-'}</span>
            <span className="font-semibold text-esp-mutedblue">Japanese Level</span>
            <span className="font-medium">{user?.japaneseLevel || '-'}</span>
          </div>
        </div>
      </section>

      {/* สถิติและข้อมูลอื่นๆ */}
      <section>
        <h2 className="text-d2 font-bold text-esp-text mb-4">สถิติการเรียนโดยรวม</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 🌟 ปรับการ์ดสถิติให้ใช้สี Theme */}
          <div className="bg-esp-softblue p-5 rounded-xl h-24 shadow-sm border border-esp-lightblue flex flex-col justify-between">
            <span className="text-d4 text-esp-mutedblue font-medium">ชั่วโมงเรียนสะสม</span>
            <span className="text-d3 font-bold text-esp-text">{stats?.totalHours ?? '0'} ชม.</span>
          </div>
          <div className="bg-esp-softblue p-5 rounded-xl h-24 shadow-sm border border-esp-lightblue flex flex-col justify-between">
            <span className="text-d4 text-esp-mutedblue font-medium">คอร์สเรียนของฉัน</span>
            <span className="text-d3 font-bold text-esp-text">{stats?.totalCourses ?? '0'} คอร์ส</span>
          </div>
          <div className="bg-esp-softblue p-5 rounded-xl h-24 shadow-sm border border-esp-lightblue flex flex-col justify-between">
            <span className="text-d4 text-esp-mutedblue font-medium">เรียนจบแล้ว</span>
            <span className="text-d3 font-bold text-esp-primary">{stats?.completedCourses ?? '0'} คอร์ส</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-d2 font-bold text-esp-text mb-4">Achievement</h2>
        <div className="flex gap-6">
          {achievements.length > 0 ? (
            achievements.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-28 h-16 bg-esp-softblue rounded-lg shadow-sm border border-esp-lightblue" />
                <span className="text-d4 font-medium text-esp-text">{item.name}</span>
              </div>
            ))
          ) : (
            <div className="text-d4 text-esp-mutedblue font-medium">ไม่มีข้อมูล Achievement</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-d2 font-bold text-esp-text">My Skills</h2>
        <p className="text-d4 text-esp-mutedblue mb-4">พนักงานจะได้รับสกิล เมื่อเรียนจบคอร์สที่เกี่ยวข้องกับสกิลนั้น</p>
        <div className="flex gap-8">
          {skills.length > 0 ? (
            skills.map((skill, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-2">
                <div className="w-20 h-20 bg-esp-softblue border border-esp-lightblue rounded-full flex items-center justify-center text-3xl text-amber-300 shadow-sm">★</div>
                <div className="text-d4 font-medium text-esp-text">
                  <div>{skill.name}</div>
                  <div className="text-esp-mutedblue">{skill.level}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-d4 text-esp-mutedblue font-medium">ยังไม่มีทักษะที่ได้รับ</div>
          )}
        </div>
      </section>
    </div>
  );
}