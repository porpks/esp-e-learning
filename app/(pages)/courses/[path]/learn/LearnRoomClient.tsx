'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SubLesson {
  id: number;
  title: string;
  type: 'video' | 'document';
  url: string;
  durationMins: number;
}

interface Lesson {
  id: number;
  title: string;
  subLessons: SubLesson[];
}

export default function LearnRoomClient({ courseTitle, coursePath, lessons }: { courseTitle: string, coursePath: string, lessons: Lesson[] }) {
  const allSubLessons = lessons.flatMap(l => l.subLessons);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [openLessons, setOpenLessons] = useState<number[]>([lessons[0]?.id]);

  const currentSubLesson = allSubLessons[currentIdx];
  const progressPercent = Math.round((completedIds.length / allSubLessons.length) * 100) || 0;

  const goToLesson = (idx: number) => {
    if (currentSubLesson && !completedIds.includes(currentSubLesson.id)) {
      setCompletedIds(prev => [...prev, currentSubLesson.id]);
    }
    setCurrentIdx(idx);
    
    // หาว่าบทเรียนที่กดไป อยู่ใน Lesson (หมวดหมู่หลัก) ไหน แล้วกาง Accordion นั้นออก
    const targetSub = allSubLessons[idx];
    const parentLesson = lessons.find(l => l.subLessons.some(s => s.id === targetSub.id));
    if (parentLesson && !openLessons.includes(parentLesson.id)) {
      setOpenLessons(prev => [...prev, parentLesson.id]);
    }
  };

  const toggleLesson = (lessonId: number) => {
    setOpenLessons(prev => 
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  if (!currentSubLesson) return <div className="p-10">ยังไม่มีเนื้อหาบทเรียน</div>;

  return (
    <div className="flex h-screen bg-white font-sans text-slate-800 overflow-hidden">
      
      {/* ================= LEFT SIDEBAR (คงเดิมตามโค้ดก่อนหน้า) ================= */}
      <div className="w-[350px] bg-[#eef8ff] flex flex-col border-r border-blue-100 shrink-0">
        <div className="p-6 bg-[#bce3ff] space-y-4">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">{courseTitle}</h1>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>{completedIds.length}/{allSubLessons.length}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson, lessonIdx) => (
            <div key={lesson.id} className="border-b border-blue-100/50">
              <button 
                onClick={() => toggleLesson(lesson.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-transparent hover:bg-blue-50/50 transition-colors"
              >
                <div className="text-left">
                  <div className="font-bold text-sm text-slate-800">Lesson {lessonIdx + 1}: {lesson.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {lesson.subLessons.length} บทเรียน
                  </div>
                </div>
                <span className={`transform transition-transform text-slate-400 text-xs ${openLessons.includes(lesson.id) ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {openLessons.includes(lesson.id) && (
                <div className="bg-white/40 pb-2">
                  {lesson.subLessons.map((sub, index) => {
                    const isCompleted = completedIds.includes(sub.id);
                    const isActive = currentSubLesson.id === sub.id;
                    const globalIdx = allSubLessons.findIndex(s => s.id === sub.id);

                    return (
                      <button
                        key={sub.id}
                        onClick={() => goToLesson(globalIdx)}
                        className={`w-full px-6 py-2.5 flex items-center gap-3 transition-colors ${isActive ? 'bg-blue-100/50 font-bold' : 'hover:bg-white/60'}`}
                      >
                        {isCompleted ? (
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-200 shrink-0"></div>
                        )}
                        <span className={`text-xs text-left flex-1 truncate ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                          Lesson {lessonIdx + 1}.{index + 1}: {sub.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{sub.durationMins} m</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-blue-100">
          <Link href={`/courses/${coursePath}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            ออกจากห้องเรียน
          </Link>
        </div>
      </div>

      {/* ================= RIGHT MAIN AREA ================= */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        <div className="h-20 flex items-center justify-center bg-slate-50 border-b border-slate-200 shrink-0">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">{currentSubLesson.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          {currentSubLesson.type === 'document' ? (
            <div className="max-w-4xl w-full mx-auto space-y-4">
              <p className="text-sm text-slate-600">พนักงานสามารถดาวน์โหลดเอกสารสำหรับการเรียนได้เลย</p>
              <a href={currentSubLesson.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline text-sm inline-block mb-4">
                เอกสารสำหรับการเรียน (คลิกเพื่อดาวน์โหลด/เปิดอ่าน)
              </a>
              <div className="w-full aspect-[1/1.4] max-h-[600px] bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300">
                <iframe src={currentSubLesson.url} className="w-full h-full" title="Document Viewer" />
              </div>
            </div>
          ) : (
            <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col justify-center">
               {/* 🌟 HTML5 Video Player */}
               <video 
                 key={currentSubLesson.id} // สำคัญมาก: บังคับให้ React รีเฟรช Player เมื่อเปลี่ยนคลิป
                 src={currentSubLesson.url} 
                 controls 
                 controlsList="nodownload"
                 className="w-full aspect-video bg-black rounded-xl shadow-2xl"
               >
                 เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
               </video>
            </div>
          )}
        </div>

        {/* 🌟 Bottom Navigation (Next / Previous) */}
        <div className="h-20 bg-white border-t border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => goToLesson(currentIdx - 1)}
            disabled={currentIdx === 0}
            className="px-6 py-2.5 text-slate-600 font-bold border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            ← Previous
          </button>
          
          <button 
            onClick={() => {
              if (currentIdx < allSubLessons.length - 1) {
                goToLesson(currentIdx + 1);
              } else {
                if (!completedIds.includes(currentSubLesson.id)) {
                  setCompletedIds(prev => [...prev, currentSubLesson.id]);
                }
                alert('🎉 ยินดีด้วย! คุณเรียนจบหลักสูตรนี้แล้ว');
              }
            }}
            className="px-8 py-2.5 bg-[#0B2545] text-white font-bold rounded-lg hover:bg-[#134074] transition-colors"
          >
            {currentIdx === allSubLessons.length - 1 ? 'Finish Course ✔️' : 'Next Lesson →'}
          </button>
        </div>

      </div>
    </div>
  );
}