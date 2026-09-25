import React from 'react';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import CourseCard, { CourseType } from '@/components/CourseCard';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. ดึงข้อมูล User จาก Session Cookie เพื่อหาคอร์สที่กำลังเรียน (Continue Learning)
  const cookieStore = cookies();
  const sessionCookie = await getSession();
  let userId: number | null = null;
  
  if (sessionCookie) {
    try {
      userId = sessionCookie.id;
    } catch (e) {
      console.error('Invalid session cookie');
    }
  }

  // Helper Function สำหรับคำนวณเวลาและจัดฟอร์แมตข้อมูลให้ CourseCard
  const formatCourse = (course: any): CourseType => {
    let totalSeconds = 0;
    course.lessons?.forEach((lesson: any) => {
      lesson.subLessons?.forEach((sub: any) => totalSeconds += sub.durationSec);
    });
    const hours = Math.max(1, Math.round(totalSeconds / 3600));

    return {
      id: course.id,
      path: course.path,
      title: course.title,
      description: course.description || 'ไม่มีคำอธิบาย',
      hours: `${hours} ชม.`,
      category: course.category || 'General',
      image: course.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
    };
  };

  // 2. ดึงข้อมูล Mandatory (สมมติให้เป็นคอร์สจาก HR & Culture และ IT Security)
  const mandatoryCoursesRaw = await prisma.course.findMany({
    where: { category: { in: ['HR & Culture', 'IT Security'] } },
    include: { lessons: { include: { subLessons: true } } },
    take: 3,
  });
  const mandatoryCourses = mandatoryCoursesRaw.map(formatCourse);

  // 3. ดึงข้อมูล Continue Learning (ดึงจาก Enrollment ที่สถานะเป็น IN_PROGRESS ของ User นี้)
  let continueLearningRaw: any[] = [];
  let enrolledCourseIds: number[] = [];
  
  if (userId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: userId, status: 'IN_PROGRESS' },
      include: { 
        course: { include: { lessons: { include: { subLessons: true } } } } 
      },
      take: 3,
    });
    continueLearningRaw = enrollments.map(e => e.course);
    enrolledCourseIds = enrollments.map(e => e.courseId);
  }
  const continueLearning = continueLearningRaw.map(formatCourse);

  // 4. ดึงข้อมูล Recommended (คอร์สใหม่ล่าสุด ที่ไม่ได้อยู่ใน Mandatory หรือกำลังเรียนอยู่)
  const excludeIds = [...mandatoryCoursesRaw.map(c => c.id), ...enrolledCourseIds];
  const recommendedCoursesRaw = await prisma.course.findMany({
    where: { 
      id: { notIn: excludeIds }, 
      category: { notIn: ['Japanese Hub', 'Language', 'ภาษาญี่ปุ่น'] } 
    },
    include: { lessons: { include: { subLessons: true } } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  const recommendedCourses = recommendedCoursesRaw.map(formatCourse);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        <HeroCarousel />

        {/* 1. Mandatory Courses */}
        <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Mandatory</h3>
            <p className="text-xs text-slate-500">คอร์สบังคับ จาก HR, Confidential, IT</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandatoryCourses.length > 0 ? (
              mandatoryCourses.map((course) => <CourseCard key={course.id} course={course} />)
            ) : (
              <div className="col-span-full h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm">ไม่มีคอร์สบังคับในขณะนี้</div>
            )}
          </div>
        </section>

        {/* 2. Continue Learning */}
        <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Continue Learning</h3>
            <p className="text-xs text-slate-500">คอร์สดำเนินการเรียนต่อ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueLearning.length > 0 ? (
              continueLearning.map((course) => <CourseCard key={course.id} course={course} />)
            ) : (
              <div className="col-span-full h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm">คุณยังไม่มีคอร์สที่กำลังเรียนอยู่</div>
            )}
          </div>
        </section>

        {/* 3. Recommended Courses */}
        <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Recommended</h3>
            <p className="text-xs text-slate-500">คอร์สอื่นๆ ที่น่าสนใจ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.length > 0 ? (
              recommendedCourses.map((course) => <CourseCard key={course.id} course={course} />)
            ) : (
              <div className="col-span-full h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm">ไม่มีคอร์สแนะนำในขณะนี้</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}