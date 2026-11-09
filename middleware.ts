import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('esp_token')?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * ครอบคลุมทุกหน้า ยกเว้น:
     * - api routes (/api/...) -> ให้ API ตรวจสอบ Token ของตัวเอง
     * - static files (_next/static, _next/image, favicon.ico)
     * - public uploads (/uploads/...)
     */
    '/((?!api|_next/static|_next/image|uploads|favicon.ico).*)',
  ],
};