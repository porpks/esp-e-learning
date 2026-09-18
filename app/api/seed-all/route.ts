import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({ error: 'Seed skiped' }, { status: 500 });
  try {
    const admin = await prisma.user.findFirst();
    if (!admin) return NextResponse.json({ error: 'No user found' }, { status: 400 });

    // ==========================================
    // Helper Function สำหรับค้นหาและอัปเดตคอร์ส
    // ==========================================
    const seedCourse = async (titleKeyword: string, fullTitle: string, pathName: string, lessonsData: any[]) => {
      let course = await prisma.course.findFirst({
        where: { title: { contains: titleKeyword } }
      });

      if (!course) {
        course = await prisma.course.create({
          data: { title: fullTitle, path: pathName, creatorId: admin.id }
        });
      } else {
        // เคลียร์บทเรียนเก่าทิ้งก่อนสร้างใหม่ (ป้องกันการซ้ำซ้อนถ้ารันหลายรอบ)
        await prisma.lesson.deleteMany({ where: { courseId: course.id } });
      }

      for (const lesson of lessonsData) {
        await prisma.lesson.create({
          data: {
            title: lesson.title,
            order: lesson.order,
            courseId: course!.id,
            subLessons: {
              create: lesson.subLessons
            }
          }
        });
      }
    };

    // ==========================================
    // 1. คอร์ส CAD (12 บทเรียนย่อย)
    // ==========================================
    await seedCourse('CAD', 'การใช้งานโปรแกรม CAD เบื้องต้น', 'cad-basic', [
      {
        title: 'ส่วนที่ 1: พื้นฐานและการตั้งค่า (Basic & Setup)', order: 1,
        subLessons: [
          { title: 'แนะนำหน้าต่างโปรแกรม (UI)', order: 1, durationSec: 300, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'การตั้งค่า Workspace เบื้องต้น', order: 2, durationSec: 420, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'ระบบพิกัดและมุมมอง (Coordinates)', order: 3, durationSec: 500, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { 
            title: 'เอกสารคีย์ลัดที่ใช้บ่อย (Shortcuts)', order: 4, durationSec: 60, 
            documents: { create: { title: 'CAD_Shortcuts.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } }
          }
        ]
      },
      {
        title: 'ส่วนที่ 2: เครื่องมือวาด 2D (2D Drafting Tools)', order: 2,
        subLessons: [
          { title: 'การวาดเส้นตรงและเส้นโค้ง (Line & Arc)', order: 1, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'การวาดรูปทรงเรขาคณิต (Shapes)', order: 2, durationSec: 540, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'การใช้เครื่องมือปรับแต่ง (Modify Tools)', order: 3, durationSec: 720, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { 
            title: 'แบบฝึกหัดการวาด 2D (Exercise)', order: 4, durationSec: 120,
            documents: { create: { title: 'Exercise_2D.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } }
          }
        ]
      },
      {
        title: 'ส่วนที่ 3: เลเยอร์และการบอกขนาด (Layer & Dimension)', order: 3,
        subLessons: [
          { title: 'การจัดการ Layer อย่างเป็นระบบ', order: 1, durationSec: 480, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'การใส่ Dimension และ Text', order: 2, durationSec: 560, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'การตั้งค่าหน้ากระดาษ (Layout & Plot)', order: 3, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'สรุปเทคนิคการทำงานให้ไวขึ้น', order: 4, durationSec: 300, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]);

    // ==========================================
    // 2. คอร์ส วิธีรับมือกับความเครียด
    // ==========================================
    await seedCourse('ความเครียด', 'วิธีรับมือกับความเครียด', 'stress-management', [
      {
        title: 'ทำความเข้าใจความเครียด', order: 1,
        subLessons: [
          { title: 'ความเครียดเกิดจากอะไร?', order: 1, durationSec: 450, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { 
            title: 'แบบประเมินความเครียด (Checklist)', order: 2, durationSec: 60,
            documents: { create: { title: 'Stress_Checklist.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } }
          }
        ]
      },
      {
        title: 'เทคนิคการจัดการ', order: 2,
        subLessons: [
          { title: 'การฝึกหายใจและผ่อนคลายกล้ามเนื้อ', order: 1, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'การปรับ Mindset ในการทำงาน', order: 2, durationSec: 720, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]);

    // ==========================================
    // 3. คอร์ส วิธีรับมือกับคนประสาท
    // ==========================================
    await seedCourse('คนประสาท', 'วิธีรับมือกับคนประสาท', 'handling-toxic-people', [
      {
        title: 'Lesson 1: เรียนรู้ที่จะปล่อยวาง', order: 1,
        subLessons: [
          { title: 'วิเคราะห์บุคลิกคน 4 ประเภท', order: 1, durationSec: 500, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'การรับมือด้วย Assertive Communication', order: 2, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { 
            title: 'สคริปต์การสื่อสารในสถานการณ์ตึงเครียด', order: 3, durationSec: 60,
            documents: { create: { title: 'Communication_Script.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } }
          }
        ]
      }
    ]);

    // ==========================================
    // 4. คอร์ส ความปลอดภัยทางไซเบอร์ 101 (PDPA)
    // ==========================================
    await seedCourse('ไซเบอร์', 'ความปลอดภัยทางไซเบอร์ 101 (PDPA)', 'cybersecurity-101', [
      {
        title: 'บทที่ 1: PDPA คืออะไร?', order: 1,
        subLessons: [
          { title: 'ความหมายของข้อมูลส่วนบุคคล', order: 1, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { title: 'สิทธิของเจ้าของข้อมูล', order: 2, durationSec: 900, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        title: 'บทที่ 2: การป้องกันภัยคุกคาม', order: 2,
        subLessons: [
          { title: 'วิธีสังเกต Phishing Email', order: 1, durationSec: 420, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { 
            title: 'นโยบายความปลอดภัยของบริษัท (Policy)', order: 2, durationSec: 120,
            documents: { create: { title: 'IT_Security_Policy.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } }
          }
        ]
      }
    ]);

    return NextResponse.json({ success: true, message: 'All courses seeded successfully with videos and documents!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}