import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const title = data.get('title') as string;

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const document = await prisma.document.create({
      data: {
        title: title || file.name,
        fileType: file.type,
        fileUrl: `/uploads/${uniqueName}`,
        subLessonId: 1, 
      }
    });

    return NextResponse.json({ success: true, document });

  } catch (error: any) {
    console.error('Upload Error Details:', error);
    return NextResponse.json(
      { error: error.message || 'ระบบหลังบ้านเกิดข้อผิดพลาด' }, 
      { status: 500 }
    );
  }
}