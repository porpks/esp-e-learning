import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({ error: 'Seed skiped' }, { status: 500 });
  try {
    // 1. หาคอร์ส CAD (หากไม่มี ให้สร้างใหม่)
    let course = await prisma.course.findFirst({
      where: { title: { contains: 'CAD' } }
    });

    if (!course) {
      // ดึง User มาเป็นคนสร้างคอร์ส
      const admin = await prisma.user.findFirst();
      if (!admin) return NextResponse.json({ error: 'No user found' }, { status: 400 });

      course = await prisma.course.create({
        data: {
          title: 'การใช้งานโปรแกรม CAD เบื้องต้น',
          description: 'คอร์สปูพื้นฐานการเขียนแบบด้วยโปรแกรม CAD',
          path: 'cad-basic',
          creatorId: admin.id,
        }
      });
    }

    // 2. สร้าง Lesson 1: พื้นฐาน
    const lesson1 = await prisma.lesson.create({
      data: {
        title: 'ทำความรู้จักเครื่องมือพื้นฐาน',
        order: 1,
        courseId: course.id,
        subLessons: {
          create: [
            {
              title: 'แนะนำหน้าต่างโปรแกรม (UI)',
              order: 1,
              durationSec: 300,
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // วิดีโอตัวอย่าง
            },
            {
              title: 'เอกสารคำสั่งคีย์ลัด (Shortcut)',
              order: 2,
              durationSec: 60,
              documents: {
                create: {
                  title: 'CAD_Shortcuts.pdf',
                  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // ไฟล์ PDF ตัวอย่าง
                  fileType: 'application/pdf'
                }
              }
            }
          ]
        }
      }
    });

    // 3. สร้าง Lesson 2: การลงมือปฏิบัติ
    const lesson2 = await prisma.lesson.create({
      data: {
        title: 'การเขียนแบบเบื้องต้น',
        order: 2,
        courseId: course.id,
        subLessons: {
          create: [
            {
              title: 'การวาดเส้นและรูปทรงเรขาคณิต',
              order: 1,
              durationSec: 600,
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            }
          ]
        }
      }
    });

    return NextResponse.json({ success: true, message: 'CAD Course Seeded!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}