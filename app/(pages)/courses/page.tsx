import { prisma } from '@/lib/prisma';
import CourseClient from './CourseClient';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const coursesData = await prisma.course.findMany({
    include: {
      lessons: {
        include: {
          subLessons: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  const formattedCourses = coursesData.map((course) => {
    let totalSeconds = 0;
    course.lessons.forEach(lesson => {
      lesson.subLessons.forEach(sub => {
        totalSeconds += sub.durationSec;
      });
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
  });

  // 3. โยนข้อมูลที่ดึงมาไปให้ Client Component จัดการ UI ต่อ
  return <CourseClient initialCourses={formattedCourses} />;
}