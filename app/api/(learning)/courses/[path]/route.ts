import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const resolvedParams = await params;
    const currentPath = resolvedParams.path;

    const course = await prisma.course.findUnique({
      where: { 
        path: currentPath 
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            subLessons: {
              orderBy: { order: 'asc' },
              // หากต้องการดึง documents มาด้วย สามารถเปิดคอมเมนต์ด้านล่างได้ครับ
              // include: {
              //   documents: true,
              // }
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'ไม่พบคอร์สเรียนนี้ในระบบ (Course not found)' },
        { status: 404 }
      );
    }

    return NextResponse.json({ course }, { status: 200 });

  } catch (error) {
    console.error('Error fetching course by path:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคอร์สเรียน (Internal Server Error)' },
      { status: 500 }
    );
  }
}