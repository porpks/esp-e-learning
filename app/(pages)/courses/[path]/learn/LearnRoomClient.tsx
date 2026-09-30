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

  if (!currentSubLesson) return <div className="p-10 text-esp-text font-bold">ยังไม่มีเนื้อหาบทเรียน</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] bg-esp-white font-sans text-esp-text overflow-hidden">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[350px] bg-esp-softblue flex flex-col border-r border-esp-lightblue shrink-0">
        
        <div className="p-6 bg-esp-lightblue space-y-4">
          <h1 className="text-d2 font-bold text-esp-text leading-tight">{courseTitle}</h1>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-esp-text">
              <span>{completedIds.length}/{allSubLessons.length}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-esp-white h-2 rounded-full overflow-hidden shadow-inner">
              <div className="bg-esp-primary h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson, lessonIdx) => (
            <div key={lesson.id} className="border-b border-esp-lightblue/50">
              <button 
                onClick={() => toggleLesson(lesson.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-transparent hover:bg-esp-white/60 transition-colors cursor-pointer"
              >
                <div className="text-left">
                  <div className="font-bold text-d4 text-esp-text">Lesson {lessonIdx + 1}: {lesson.title}</div>
                  <div className="text-xs text-esp-mutedblue mt-0.5">
                    {lesson.subLessons.length} บทเรียน
                  </div>
                </div>
                <span className={`transform transition-transform text-esp-mutedblue text-xs ${openLessons.includes(lesson.id) ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {openLessons.includes(lesson.id) && (
                <div className="bg-esp-white/40 pb-2">
                  {lesson.subLessons.map((sub, index) => {
                    const isCompleted = completedIds.includes(sub.id);
                    const isActive = currentSubLesson.id === sub.id;
                    const globalIdx = allSubLessons.findIndex(s => s.id === sub.id);

                    return (
                      <button
                        key={sub.id}
                        onClick={() => goToLesson(globalIdx)}
                        className={`w-full px-6 py-2.5 flex items-center gap-3 transition-colors cursor-pointer ${isActive ? 'bg-esp-white font-bold shadow-sm' : 'hover:bg-esp-white/60'}`}
                      >
                        {isCompleted ? (
                          <div className="w-4 h-4 rounded-full bg-esp-primary flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 text-esp-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-esp-lightblue shrink-0"></div>
                        )}
                        <span className={`text-xs text-left flex-1 truncate ${isActive ? 'text-esp-primary' : 'text-esp-text'}`}>
                          Lesson {lessonIdx + 1}.{index + 1}: {sub.title}
                        </span>
                        <span className="text-[10px] text-esp-mutedblue">{sub.durationMins} m</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-20 pl-4 bg-esp-white border-t border-esp-lightblue flex items-center">
          <Link href={`/courses/${coursePath}`} className="flex items-center gap-2 text-esp-mutedblue hover:text-esp-text font-bold text-d4 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            ออกจากห้องเรียน
          </Link>
        </div>
      </div>

      {/* ================= RIGHT MAIN AREA ================= */}
      <div className="flex-1 flex flex-col bg-esp-bg relative">
        <div className="h-20 flex items-center justify-center bg-esp-bg border-b border-esp-lightblue shrink-0">
          <h2 className="text-h4 font-bold tracking-tight text-esp-text">{currentSubLesson.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          {currentSubLesson.type === 'document' ? (
            <div className="max-w-4xl w-full mx-auto space-y-4">
              <p className="text-d4 text-esp-mutedblue font-medium">พนักงานสามารถดาวน์โหลดเอกสารสำหรับการเรียนได้เลย</p>
              <a href={currentSubLesson.url} target="_blank" rel="noreferrer" className="text-esp-primary font-bold hover:underline text-d4 inline-block mb-4">
                เอกสารสำหรับการเรียน (คลิกเพื่อดาวน์โหลด/เปิดอ่าน)
              </a>
              <div className="w-full aspect-[1/1.4] max-h-[600px] bg-esp-softblue rounded-xl overflow-hidden shadow-inner border border-esp-lightblue">
                <iframe src={currentSubLesson.url} className="w-full h-full" title="Document Viewer" />
              </div>
            </div>
          ) : (
            <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col justify-center">
               <video 
                 key={currentSubLesson.id}
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

        <div className="h-20 bg-esp-white border-t border-esp-lightblue flex items-center justify-between px-8 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => goToLesson(currentIdx - 1)}
            disabled={currentIdx === 0}
            className={`px-6 py-2.5 text-esp-mutedblue font-bold border border-esp-lightblue rounded-lg disabled:opacity-30 hover:bg-esp-softblue transition-colors ${currentIdx === 0 ? '': 'cursor-pointer'}`}
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
            className={`px-8 py-2.5 bg-esp-text text-esp-white font-bold rounded-lg hover:bg-esp-primary transition-colors ${currentIdx === allSubLessons.length - 1 ? '' : 'cursor-pointer'}`}
          >
            {currentIdx === allSubLessons.length - 1 ? 'Finish Course ✔️' : 'Next Lesson →'}
          </button>
        </div>

      </div>
    </div>
  );
}