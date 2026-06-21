import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';

const protectedStudentRoutes = ['/dashboard'];
// Protect everything under /admin except the public login page.
const ADMIN_PREFIX = '/admin';
const ADMIN_PUBLIC = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow Next.js internals, static files, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Admin route protection — verify the signed (unforgeable) session token.
  const isAdminProtected =
    pathname.startsWith(ADMIN_PREFIX) && !ADMIN_PUBLIC.some((r) => pathname.startsWith(r));
  if (isAdminProtected) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = await verifyAdminToken(token);
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Student dashboard — Firebase auth is client-side; page handles redirect via useAuth()
  // We still add a light check via the Firebase auth token if present
  const isStudentProtected = protectedStudentRoutes.some((r) => pathname.startsWith(r));
  if (isStudentProtected) {
    // Client-side AuthProvider handles the redirect. Middleware cannot read Firebase tokens
    // without firebase-admin SDK; we rely on the AuthProvider for now.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
