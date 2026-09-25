import { NextResponse } from 'next/server';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from '@/lib/prisma';
import { s3Client, BUCKET_NAME } from '@/lib/s3';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    // 🔒 1. ตรวจสอบสิทธิ์ (Security) ป้องกันคนนอกอัปโหลดไฟล์
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'ไม่พบเซสชัน กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const title = data.get('title') as string;
    
    // (Optional) ควรรับค่า subLessonId มาจาก Frontend ด้วยแทนการ Fix ค่า 1
    // const subLessonId = Number(data.get('subLessonId')); 

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // แนะนำให้จัดโฟลเดอร์ตอนอัปโหลด เช่น ใส่ไว้ในโฟลเดอร์ documents/
    const uniqueName = `documents/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // 🚀 2. เรียกใช้ s3Client และ BUCKET_NAME จากไฟล์ส่วนกลางได้เลย
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueName,
      Body: buffer,
      ContentType: file.type,
    });
    await s3Client.send(command);

    const fileUrl = `${process.env.MINIO_ENDPOINT_FOR_CLIENT}/${BUCKET_NAME}/${uniqueName}`;

    // 💾 3. บันทึกลง Database
    const document = await prisma.document.create({
      data: {
        title: title || file.name,
        fileType: file.type,
        fileUrl: fileUrl, 
        subLessonId: 1, // TODO: อย่าลืมแก้ให้รับค่าแบบ Dynamic ในอนาคต
      }
    });

    return NextResponse.json({ success: true, document });

  } catch (error: any) {
    console.error('Upload Error Details:', error);
    return NextResponse.json(
      { error: error.message || 'ระบบเกิดข้อผิดพลาดในการอัปโหลด' }, 
      { status: 500 }
    );
  }
}