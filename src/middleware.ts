import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log the current path
  console.log('Middleware executing for path:', request.nextUrl.pathname);
  
  // Skip middleware for signin/signup API routes and public assets
  if (
    request.nextUrl.pathname.startsWith('/api/auth/signin') ||
    request.nextUrl.pathname.startsWith('/api/auth/signup') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    console.log('Skipping middleware for public route');
    return NextResponse.next()
  }

  // Paths that require authentication
  const protectedPaths = [
    '/account',
    '/admin',
    '/checkout'
  ]

  // Public paths that shouldn't redirect when authenticated
  const publicPaths = ['/signin', '/signup', '/admin/signin', '/forgot-password', '/reset-password']
  
  // Check if the path requires authentication
  const requiresAuth = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  console.log('Path:', request.nextUrl.pathname, 'Requires Auth:', requiresAuth, 'Is Public:', isPublicPath)

  // Check if token exists (but don't verify it in middleware - let API routes/pages handle that)
  const token = request.cookies.get('auth-token')?.value
  console.log('Token present:', !!token)

  // Handle unauthenticated users
  if (!token) {
    console.log('No token found')
    if (requiresAuth) {
      console.log('Redirecting to signin')
      if (request.nextUrl.pathname.startsWith('/admin')) {
        // Redirect to admin signin for admin paths
        return NextResponse.redirect(new URL('/admin/signin', request.url))
      } else {
        // Redirect to regular signin for other protected paths
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
      }
    }
    return NextResponse.next()
  }

  // Token exists - let the page/API handle role verification
  console.log('Token found, allowing access')
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Home page
    '/',
    
    // Protected client routes
    '/account/:path*',
    '/admin/:path*',
    '/checkout/:path*',
    
    // Public routes (to check auth and potentially redirect)
    '/shop/:path*',
    '/about/:path*',
    '/delivery/:path*',
    '/contact/:path*',
    '/products/:path*',
    
    // Auth pages
    '/signin',
    '/signup',
    '/admin/signin',
    '/forgot-password',
    '/reset-password',
    
    // Protected API routes
    '/api/orders/:path*',
    '/api/products/:path*'
  ]
}
