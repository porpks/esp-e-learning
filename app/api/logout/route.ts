import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // ลบ Cookie user_session
  response.cookies.set('user_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}