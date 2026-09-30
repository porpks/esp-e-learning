import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: Promise<{ path: string }> }) {
  
  const resolvedParams = await params;
  const currentPath = resolvedParams.path;

  const course = await prisma.course.findUnique({
    where: { path: currentPath },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: {
          subLessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  let totalSeconds = 0;
  let totalSubLessons = 0;
  course.lessons.forEach((lesson) => {
    lesson.subLessons.forEach((sub) => {
      totalSeconds += sub.durationSec;
      totalSubLessons++;
    });
  });
  
  const hours = Math.floor(totalSeconds / 3600);
  const durationText = hours > 0 ? `${hours} ชั่วโมง` : `${Math.floor(totalSeconds / 60)} นาที`;

  return (
    <div className="min-h-screen bg-esp-bg pb-20 text-esp-text">
      
      {/* 1. Hero Section (Header แบบ Gradient + รูปปกพื้นหลัง) */}
      <div 
        className={`relative pt-16 pb-16 border-b border-esp-lightblue overflow-hidden ${
          !course.thumbnail ? 'bg-gradient-to-b from-esp-lightblue to-esp-bg' : ''
        }`}
      >
        {course.thumbnail && (
          <>
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-multiply" 
              style={{ backgroundImage: `url(${course.thumbnail})` }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-esp-lightblue to-transparent" />
          </>
        )}

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-h4 md:text-h2 font-bold tracking-tight text-esp-text mb-3 drop-shadow-sm">
            {course.title}
          </h1>
          <p className="text-d3 md:text-d2 text-esp-text mb-6 font-medium max-w-3xl drop-shadow-sm">
            {course.description || 'ไม่มีคำอธิบายสำหรับคอร์สนี้'}
          </p>
          
          <div className="flex items-center text-d4 font-bold text-esp-text gap-3 mb-8 drop-shadow-sm">
            <span>จำนวน {durationText}</span>
            <span className="text-esp-mutedblue">|</span>
            <span>{totalSubLessons} บทเรียน</span>
            <span className="text-esp-mutedblue">|</span>
            <span>Certificate</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href={`/courses/${course.path}/learn`}>
              <button className="px-8 py-3 bg-esp-text hover:bg-esp-primary text-esp-white font-bold rounded-lg shadow-md transition-colors cursor-pointer">
                เริ่มเรียนเลย
              </button>
            </Link>
            <button className="px-8 py-3 bg-esp-white/80 hover:bg-esp-white text-esp-text font-bold rounded-lg shadow-sm backdrop-blur-sm transition-colors cursor-not-allowed">
              ทำข้อสอบจบคอร์ส
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Column: Course Lessons (สไตล์ Accordion/List) */}
          <div className="flex-1">
            <div className="bg-esp-white rounded-2xl shadow-sm border border-esp-lightblue overflow-hidden">
              {course.lessons.length > 0 ? (
                <div className="flex flex-col">
                  {course.lessons.map((lesson, lessonIdx) => {
                    const lessonSecs = lesson.subLessons.reduce((acc, curr) => acc + curr.durationSec, 0);
                    const lessonDuration = Math.floor(lessonSecs / 3600) > 0 
                      ? `${Math.floor(lessonSecs / 3600)} ชั่วโมง` 
                      : `${Math.floor(lessonSecs / 60)} นาที`;

                    return (
                      <div key={lesson.id} className="border-b border-esp-lightblue/50 last:border-0">
                        {/* Lesson Header */}
                        <div className="px-8 py-6 flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-d2 text-esp-text">
                              Lesson {lessonIdx + 1}: {lesson.title}
                            </h3>
                            <div className="text-d4 text-esp-mutedblue font-medium mt-1">{lessonDuration}</div>
                          </div>
                          <button className="text-d4 text-esp-mutedblue font-bold hover:text-esp-text flex items-center gap-1 cursor-pointer">
                            รายละเอียด ▼
                          </button>
                        </div>
                        
                        {/* Sub-Lessons List */}
                        <div className="px-8 pb-6 space-y-4">
                          {lesson.subLessons.map((sub, subIdx) => (
                            <div key={sub.id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-4 text-d4 font-medium text-esp-text">
                                <div className="w-3.5 h-3.5 rounded-full bg-esp-lightblue shrink-0"></div>
                                <span>Lesson {lessonIdx + 1}.{subIdx + 1}: {sub.title}</span>
                              </div>
                              <div className="text-d4 text-esp-mutedblue">
                                {Math.floor(sub.durationSec / 60) > 0 ? `${Math.floor(sub.durationSec / 60)} Mins` : '< 1 Min'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-esp-mutedblue font-medium">
                  ยังไม่มีการเพิ่มเนื้อหาในคอร์สนี้
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Skills & Certificate */}
          <div className="w-full md:w-[280px] shrink-0 space-y-10">
            
            {/* Skills Section */}
            <div>
              <h3 className="text-d3 font-bold text-esp-text mb-4">ทักษะที่จะได้รับ</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-esp-softblue text-esp-primary text-d4 font-bold rounded-full">Data Analysis</span>
                <span className="px-3 py-1 bg-esp-softblue text-esp-primary text-d4 font-bold rounded-full">Analytical Skills</span>
                <span className="px-3 py-1 bg-esp-softblue text-esp-primary text-d4 font-bold rounded-full">Data Cleansing</span>
              </div>
            </div>

            {/* Certificate Section */}
            <div>
              <h3 className="text-d3 font-bold text-esp-text mb-3">Certificate</h3>
              <a href="#" className="text-esp-primary hover:opacity-80 font-medium text-d4 underline underline-offset-4 decoration-esp-lightblue hover:decoration-esp-primary transition-colors">
                {course.title}.pdf
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}