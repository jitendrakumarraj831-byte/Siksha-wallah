import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin'];
const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  // Don't apply middleware to public pages
  if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // For client-side auth check, we can't verify in middleware
  // The AuthProvider will handle redirects on the client side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)'],
};
