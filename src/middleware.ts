import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - Static asset extensions (.svg, .png, .jpg, .ico, .txt, .xml, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|clinic-logo|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Detect if incoming request is targeting the admin subdomain
  // Matches: admin.drmonalisclinic.com, admin.localhost:3005, admin-*, etc.
  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-');

  // ========================================================
  // CASE 1: Visitor is on the admin subdomain
  // ========================================================
  if (isAdminSubdomain) {
    // If browsing root ('/') on the admin subdomain, rewrite internally to '/admin'
    if (url.pathname === '/') {
      const rewrittenUrl = new URL('/admin', req.url);
      rewrittenUrl.search = url.search;
      return NextResponse.rewrite(rewrittenUrl);
    }

    // If browsing '/admin' or any '/admin/*' path, proceed normally
    if (url.pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    // Rewrite any other path on the admin subdomain to /admin
    const rewrittenUrl = new URL(`/admin${url.pathname}`, req.url);
    rewrittenUrl.search = url.search;
    return NextResponse.rewrite(rewrittenUrl);
  }

  // ========================================================
  // CASE 2: Visitor is on the main site (drmonalisclinic.com)
  // ========================================================
  // If anyone tries to access /admin directly from the main website in production,
  // redirect them cleanly to the official admin subdomain.
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    if (isProduction && !isLocalhost) {
      const adminRedirectUrl = new URL(url.pathname, 'https://admin.drmonalisclinic.com');
      adminRedirectUrl.search = url.search;
      return NextResponse.redirect(adminRedirectUrl);
    }

    // In local development, allow direct access so you can test easily
    return NextResponse.next();
  }

  return NextResponse.next();
}
