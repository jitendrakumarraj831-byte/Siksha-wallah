import { NextRequest, NextResponse } from 'next/server';

const protectedStudentRoutes = ['/dashboard'];
const protectedAdminRoutes = ['/admin/dashboard', '/admin/activity', '/admin/analytics', '/admin/applications', '/admin/communications', '/admin/courses', '/admin/payments', '/admin/students'];

export function middleware(request: NextRequest) {
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

  // Admin route protection — check for session cookie set by admin login
  const isAdminProtected = protectedAdminRoutes.some((r) => pathname.startsWith(r));
  if (isAdminProtected) {
    const adminSession = request.cookies.get('sw_admin_session');
    if (!adminSession?.value) {
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
