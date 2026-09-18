import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const BUCKET_NAME = 'ESP_E-learning_resource';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'ไม่พบเซสชัน กรุณาเข้าสู่ระบบใหม่' }, { status: 401 });
    }
    
    const sessionData = JSON.parse(sessionCookie.value);
    const userId = Number(sessionData.id);

    if (!file || !userId) {
      return NextResponse.json({ error: 'กรุณาระบุไฟล์และเซสชันให้ถูกต้อง' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.profileImage && user.profileImage.includes(BUCKET_NAME)) {
      const oldPath = user.profileImage.split(`${BUCKET_NAME}/`)[1];
      if (oldPath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
      }
    }

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

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const newImageUrl = publicUrlData.publicUrl;

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: newImageUrl },
    });

    sessionData.profileImage = newImageUrl;
    cookieStore.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ success: true, url: newImageUrl });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'ไม่พบเซสชัน กรุณาเข้าสู่ระบบใหม่' }, { status: 401 });
    }
    
    const sessionData = JSON.parse(sessionCookie.value);
    const userId = Number(sessionData.id);

    if (!userId) {
      return NextResponse.json({ error: 'ไม่พบข้อมูล User ID ในเซสชัน' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.profileImage && user.profileImage.includes(BUCKET_NAME)) {
      const filePath = user.profileImage.split(`${BUCKET_NAME}/`)[1];
      if (filePath) {
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: null },
    });

    sessionData.profileImage = null;
    cookieStore.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Avatar delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}