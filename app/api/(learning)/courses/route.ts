import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { verifyToken } from '@/lib/auth'; // เตรียมไว้หากต้องการบังคับให้แนบ Token ตามตาราง

export async function GET(request: Request) {
  try {
    // 1. (Optional) ตรวจสอบ Access Token จาก Header ตามที่ระบุในตาราง (แม้จะเป็น All user ก็ตาม)
    // const token = request.headers.get('authorization')?.split(' ')[1];
    // if (!token || !verifyToken(token)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // 2. ดึง Query Parameters จาก URL
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'newest';
    const minDur = parseInt(searchParams.get('min') || '0', 10);
    const maxDur = parseInt(searchParams.get('max') || '100', 10);
    
    // รองรับการส่ง category มาหลายค่า เช่น ?category=Tech&category=SoftSkill
    const categoriesParam = searchParams.getAll('category'); 

    // 3. ดึงข้อมูลเบื้องต้นจาก Database ผ่าน Prisma
    // ใช้ OR เพื่อค้นหาข้อความจาก title หรือ description (ถ้ามี search query)
    const coursesData = await prisma.course.findMany({
      where: {
        category: { notIn: ['Japanese Hub', 'Language', 'ภาษาญี่ปุ่น'] },
        ...(q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        lessons: {
          include: {
            subLessons: true,
          },
        },
      },
      orderBy: sort === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' },
    });

    // 4. คำนวณชั่วโมงเรียนรวมและจัดฟอร์แมตข้อมูล (เนื่องจาก Prisma คำนวณ Sum ของความสัมพันธ์ซ้อนทับกันโดยตรงยาก)
    const formattedCourses = coursesData.map((course) => {
      let totalSeconds = 0;
      course.lessons.forEach((lesson) => {
        lesson.subLessons.forEach((sub) => {
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
        hoursInt: hours, // ใช้สำหรับคำนวณเปรียบเทียบ min/max ชั่วคราว
        category: course.category || 'General',
        image: course.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
      };
    });

    // 5. กรองข้อมูลตาม Category และ Duration (min, max) ในฝั่ง Server
    const filteredCourses = formattedCourses.filter((course) => {
      const matchesCategory = categoriesParam.length === 0 || categoriesParam.includes(course.category);
      const matchesDuration = course.hoursInt >= minDur && course.hoursInt <= maxDur;
      
      return matchesCategory && matchesDuration;
    });

    // ลบตัวแปร hoursInt ออกก่อนส่งกลับไปหน้าบ้าน เพื่อให้ตรงกับ Interface CourseType ที่หน้าบ้านรอรับ
    const finalCourses = filteredCourses.map(({ hoursInt, ...rest }) => rest);

    // 6. ส่งข้อมูลกลับตาม Format ในตาราง: data: { course: [courses array] }
    return NextResponse.json({ course: finalCourses }, { status: 200 });

  } catch (error) {
    console.error('Error fetching courses list:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงรายการคอร์สเรียน' },
      { status: 500 }
    );
  }
}