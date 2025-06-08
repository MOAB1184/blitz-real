import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup' || path === '/forgot-password';

  // Use NextAuth's session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    // If user is authenticated and tries to access public path, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !isAuthenticated) {
    // If user is not authenticated and tries to access protected path, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ],
}; 