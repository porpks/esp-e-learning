import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

// ตั้งค่า Supabase Client สำหรับฝั่ง Backend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET_NAME = 'ESP_E-learning_resource';

// POST: อัปโหลดรูปโปรไฟล์ใหม่
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'กรุณาระบุไฟล์และ User ID' }, { status: 400 });
    }

    // 1. ดึงข้อมูล User เพื่อดูว่ามีรูปเดิมอยู่ไหม
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // 2. ถ้ามีรูปเดิมใน Supabase Storage ให้ลบออกก่อน
    if (user?.profileImage && user.profileImage.includes(BUCKET_NAME)) {
      const oldPath = user.profileImage.split(`${BUCKET_NAME}/`)[1];
      if (oldPath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
      }
    }

    // 3. อัปโหลดรูปใหม่เข้า Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${userId}-${Date.now()}.${fileExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 4. ดึง Public URL ของรูปใหม่
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const newImageUrl = publicUrlData.publicUrl;

    // 5. อัปเดต profileImage ใน Database ผ่าน Prisma
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: newImageUrl },
    });

    return NextResponse.json({ success: true, url: newImageUrl });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: ลบรูปโปรไฟล์ออก
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'กรุณาระบุ User ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // ลบไฟล์จาก Supabase Storage
    if (user?.profileImage && user.profileImage.includes(BUCKET_NAME)) {
      const filePath = user.profileImage.split(`${BUCKET_NAME}/`)[1];
      if (filePath) {
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      }
    }

    // ลบค่า URL ใน Database
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: null },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Avatar delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}