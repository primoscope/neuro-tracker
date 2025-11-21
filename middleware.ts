import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // In hybrid mode, auth is handled client-side
  // Middleware just ensures proper routing
  
  // Allow all requests to pass through
  // Auth checks happen in the StorageProvider on the client
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
