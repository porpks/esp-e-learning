import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'user_session';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 8, // 8 ชั่วโมง
};

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function updateSession(newData: any) {
  const cookieStore = await cookies();
  const currentSession = await getSession();
  
  const updatedSession = { ...currentSession, ...newData };

  cookieStore.set(
    SESSION_COOKIE_NAME,
    JSON.stringify(updatedSession),
    SESSION_COOKIE_OPTIONS
  );
}

export async function createSession(userData: any) {
  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    JSON.stringify(userData),
    SESSION_COOKIE_OPTIONS
  );
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0, // สั่งให้ Cookie หมดอายุทันที
  });
}