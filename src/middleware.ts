import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_LOGIN } from '@/utils/constant';

// Các tiền tố cho static file & API
const staticPrefixes = [
  '/api/',
  '/_next/',
  '/images/',
  '/videos/',
  '/files/',
  '/fonts/',
  '/robots.txt',
  '/sitemap.xml',
];

// Các route public không cần xác thực
const publicRoutes = [
  '/',
  '/terms',
  '/policy',
  '/favicon.svg',
  '/rate-plan',
  '/rate-plan',
  '/guide',
  '/guide/coupang',
  '/guide/ali',
  '/shorten',
  '/upload/sample',
  '/copyright',
  '/ai-policy',
  '/analys',
  '/redirect',
];

// Regex để bỏ qua các route auth như /auth, /auth/login, v.v.
const authRoutePattern = /^\/auth(\/|$)/;

// Các phần mở rộng tệp được truy cập mà không cần đăng nhập
const allowedExtensions = ['.html', '.xml'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_LOGIN)?.value;

  // Bỏ qua static file & API route
  if (staticPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Cho phép route public, auth hoặc các file có phần mở rộng được whitelist
  if (
    publicRoutes.includes(pathname) ||
    authRoutePattern.test(pathname) ||
    allowedExtensions.some((ext) => pathname.endsWith(ext))
  ) {
    return NextResponse.next();
  }

  // Nếu chưa có token => chuyển hướng về /auth/login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Tắt cache để đảm bảo token được cập nhật
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

// Middleware áp dụng cho toàn bộ route trừ /r/...
export const config = {
  matcher: '/((?!_next|api|favicon.ico|r/).*)',
};
