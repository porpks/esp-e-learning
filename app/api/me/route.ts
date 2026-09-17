import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies(); 
    const session = cookieStore.get('user_session');

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = JSON.parse(session.value);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}