import { NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from '@/lib/prisma';
import { getSession, updateSession } from '@/lib/session';
import { s3Client, BUCKET_NAME } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'ไม่พบเซสชัน กรุณาเข้าสู่ระบบใหม่' }, { status: 401 });
    }

    const userId = Number(session.id);

    if (!file) {
      return NextResponse.json({ error: 'กรุณาระบุไฟล์ให้ถูกต้อง' }, { status: 400 });
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'ขนาดไฟล์รูปภาพต้องไม่เกิน 4MB' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // ลบรูปเก่าถ้ามี
    if (user?.profileImage && user.profileImage.includes(BUCKET_NAME)) {
      const oldPath = user.profileImage.split(`${BUCKET_NAME}/`)[1];
      if (oldPath) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: oldPath,
        });
        await s3Client.send(deleteCommand).catch(e => console.error("Failed to delete old avatar:", e));
      }
    }

    // อัปโหลดรูปใหม่
    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${userId}-${Date.now()}.${fileExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });
    await s3Client.send(uploadCommand);

    const newImageUrl = `${process.env.MINIO_ENDPOINT_FOR_CLIENT}/${BUCKET_NAME}/${fileName}`;

    // อัปเดต Database
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: newImageUrl },
    });

    // อัปเดต Session Cookie
    await updateSession({ profileImage: newImageUrl });

    return NextResponse.json({ success: true, url: newImageUrl });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'ไม่พบเซสชัน กรุณาเข้าสู่ระบบใหม่' }, { status: 401 });
    }
    
    const userId = Number(session.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.profileImage && user.profileImage.includes(BUCKET_NAME)) {
      const filePath = user.profileImage.split(`${BUCKET_NAME}/`)[1];
      if (filePath) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filePath,
        });
        await s3Client.send(deleteCommand);
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: null },
    });

    await updateSession({ profileImage: null });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Avatar delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}