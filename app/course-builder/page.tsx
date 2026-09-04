'use client';

import React, { useState } from 'react';

export default function CourseBuilderPage() {
  // 🌟 ตั้งค่าให้เปิดมาเจอแท็บข้อมูลทั่วไปก่อน
  const [activeTab, setActiveTab] = useState('info'); 
  const [questionType, setQuestionType] = useState('multiple-choice');
  
  // State สำหรับระบบอัปโหลด
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // ฟังก์ชันจัดการการอัปโหลดไฟล์ (แข็งแกร่ง 100%)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('กำลังอัปโหลดไฟล์... ⏳');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`หาท่อ API ไม่เจอ หรือเซิร์ฟเวอร์พัง (Status: ${response.status})`);
      }

      const result = await response.json();

      if (response.ok) {
        setUploadStatus(`✅ อัปโหลดสำเร็จ! (ชื่อไฟล์: ${result.document.title})`);
      } else {
        setUploadStatus(`❌ เกิดข้อผิดพลาดจากหลังบ้าน: ${result.error}`);
      }
    } catch (error: any) {
      console.error(error);
      setUploadStatus(`❌ การเชื่อมต่อล้มเหลว: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-12 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="font-bold tracking-wide text-lg">⚙️ ระบบสร้างเนื้อหา (Course Builder)</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* แถบเมนู Tabs */}
        <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800/50 p-1 rounded-xl mb-8">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'info' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-800'}`}>📝 1. ข้อมูลทั่วไป</button>
          <button onClick={() => setActiveTab('media')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'media' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-800'}`}>🎥 2. วิดีโอและเอกสาร</button>
          <button onClick={() => setActiveTab('quiz')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'quiz' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-800'}`}>❓ 3. แบบทดสอบ (Quiz)</button>
        </div>

        {/* ================= TAB 1: ข้อมูลทั่วไป ================= */}
        {activeTab === 'info' && (
          <div className="space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold mb-6 border-b pb-4 border-slate-200 dark:border-slate-700">ข้อมูลทั่วไปของคอร์ส</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">ชื่อคอร์สเรียน</label>
                <input type="text" placeholder="เช่น ความปลอดภัยทางไซเบอร์ 101" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">รายละเอียด (Description)</label>
                <textarea rows={4} placeholder="อธิบายสั้นๆ ว่าคอร์สนี้เกี่ยวกับอะไร..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">หมวดหมู่</label>
                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option>HR & Culture</option>
                  <option>IT Security</option>
                  <option>Operations</option>
                  <option>Soft Skills</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button onClick={() => setActiveTab('media')} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors">
                ถัดไป ➔
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: วิดีโอและเอกสาร (ระบบอัปโหลดจริง) ================= */}
        {activeTab === 'media' && (
          <div className="space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold mb-6 border-b pb-4 border-slate-200 dark:border-slate-700">อัปโหลดสื่อการสอน</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">📄 อัปโหลดไฟล์ (PDF, เอกสาร, หรือวิดีโอ)</label>
              
              <label className={`relative block border-2 border-dashed ${isUploading ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30'} rounded-xl p-8 text-center transition-colors cursor-pointer`}>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  accept=".pdf,.doc,.docx,.mp4" 
                />
                
                <div className="text-4xl mb-3">{isUploading ? '⏳' : '📁'}</div>
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {isUploading ? 'กำลังประมวลผลการอัปโหลด...' : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่'}
                </p>
                <p className="text-sm text-slate-500 mt-2">รองรับ PDF, DOC, MP4</p>
              </label>

              {uploadStatus && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${uploadStatus.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : uploadStatus.includes('❌') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                  {uploadStatus}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setActiveTab('info')} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                ชี้กลับ
              </button>
              <button onClick={() => setActiveTab('quiz')} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors">
                ถัดไป ➔
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: แบบทดสอบ (Quiz) ================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold mb-6 border-b pb-4 border-slate-200 dark:border-slate-700">สร้างแบบทดสอบ (Quiz)</h2>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">ข้อที่ 1</span>
                <select 
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="text-sm px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                >
                  <option value="multiple-choice">ปรนัย (4 ตัวเลือก)</option>
                  <option value="true-false">ถูก/ผิด</option>
                </select>
              </div>

              <input type="text" placeholder="พิมพ์คำถามที่นี่..." className="w-full px-4 py-2 mb-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />

              {questionType === 'multiple-choice' && (
                <div className="space-y-3 pl-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="flex items-center gap-3">
                      <input type="radio" name="correct-answer" className="w-4 h-4 text-blue-600" />
                      <input type="text" placeholder={`ตัวเลือกที่ ${num}`} className="flex-1 px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium">
              + เพิ่มคำถามใหม่
            </button>

            <div className="flex justify-between mt-6">
              <button onClick={() => setActiveTab('media')} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                ชี้กลับ
              </button>
              <button className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-600/30">
                ✅ บันทึกคอร์สเรียน
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}