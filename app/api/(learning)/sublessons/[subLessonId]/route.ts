import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { verifyToken } from '@/lib/auth'; // 💡 อย่าลืมเปิดใช้งานถ้าต้องการเช็ค Access Token

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subLessonId: string }> }
) {
  try {
    // 1. (Optional) ตรวจสอบ Access Token จาก Header ตามโครงสร้าง API
    // const token = request.headers.get('authorization')?.split(' ')[1];
    // if (!token || !verifyToken(token)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // 2. ดึง subLessonId จาก URL Parameter และแปลงเป็นตัวเลข
    const resolvedParams = await params;
    const subLessonId = parseInt(resolvedParams.subLessonId, 10);

    if (isNaN(subLessonId)) {
      return NextResponse.json(
        { error: 'รหัสบทเรียนย่อยไม่ถูกต้อง (Invalid ID)' },
        { status: 400 }
      );
    }

    // 3. Query ข้อมูลจาก Prisma
    const subLesson = await prisma.subLesson.findUnique({
      where: { 
        id: subLessonId 
      },
      include: {
        documents: true, // ดึงข้อมูลเอกสารมาด้วยเพื่อเช็คประเภท
      },
    });

    if (!subLesson) {
      return NextResponse.json(
        { error: 'ไม่พบบทเรียนย่อยนี้ในระบบ (Not found)' },
        { status: 404 }
      );
    }

    // 4. จัด Format ข้อมูลให้ตรงกับตาราง API ที่ออกแบบไว้
    const isDocument = subLesson.documents && subLesson.documents.length > 0;
    
    const responseData = {
      type: isDocument ? 'document' : 'video',
      attachedLink: isDocument ? subLesson.documents[0].fileUrl : (subLesson.videoUrl || ''),
    };

    // 5. ส่ง Response กลับไป
    return NextResponse.json({ data: responseData }, { status: 200 });

  } catch (error) {
    console.error('Error fetching sub-lesson details:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทเรียนย่อย (Internal Server Error)' },
      { status: 500 }
    );
  }
}