import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decodedToken.id) },
      select: {
        id: true,
        empId: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        department: true,
        team: true,
        role: true,
        isAdmin: true,
        profileImage: true,
      }
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}