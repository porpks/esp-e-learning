import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const title = data.get('title') as string;

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด' }, { status: 400 });
    }

    // 1. สร้างชื่อไฟล์ให้ไม่ซ้ำกัน (ลบช่องว่างทิ้งเพื่อป้องกัน URL มีปัญหา)
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    
    // 2. เรียกใช้งาน Supabase Client
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 3. อัปโหลดไฟล์ขึ้น Supabase Storage (ระบุชื่อ Bucket ที่สร้างไว้ เช่น 'learning-materials')
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('learning-materials')
      .upload(`uploads/${uniqueName}`, file, {
        contentType: file.type,
        upsert: false, // ป้องกันการเซฟทับไฟล์ชื่อเดิม
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการบันทึกไฟล์บนคลาวด์' }, 
        { status: 500 }
      );
    }

    // 4. ขอ URL แบบ Public จาก Supabase เพื่อเอาไปเก็บลง Database
    const { data: { publicUrl } } = supabase
      .storage
      .from('learning-materials')
      .getPublicUrl(`uploads/${uniqueName}`);

    // 5. บันทึกข้อมูลลง Database ผ่าน Prisma เหมือนเดิม
    const document = await prisma.document.create({
      data: {
        title: title || file.name,
        fileType: file.type,
        // เปลี่ยนจาก path ในเครื่อง เป็น Public URL ของ Supabase แทน
        filePath: publicUrl, 
        uploaderId: 1, // TODO: อนาคตควรเปลี่ยนให้ดึงจาก Session ของ User ที่กำลัง Login อยู่
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