import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, signAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';

const ADMIN_SESSION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const ADMIN_RENEW_THRESHOLD_MS = 25 * 24 * 60 * 60 * 1000; // refresh once <25 days remain

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
    // Sliding renewal — keep the office logged in as long as it's being used.
    // Refresh the 30-day window whenever less than 25 days remain.
    if (session.exp - Date.now() < ADMIN_RENEW_THRESHOLD_MS) {
      const res = NextResponse.next();
      const fresh = await signAdminToken(session.u, ADMIN_SESSION_MS);
      res.cookies.set(ADMIN_COOKIE, fresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ADMIN_SESSION_MS / 1000,
      });
      return res;
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
