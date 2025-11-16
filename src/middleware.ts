import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

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

  // Customer-only paths that admins shouldn't access
  const customerOnlyPaths = [
    '/shop',
    '/about',
    '/delivery',
    '/contact',
    '/account',
    '/checkout',
    '/products'
  ]

  // Public paths that shouldn't redirect when authenticated
  const publicPaths = ['/signin', '/signup', '/admin/signin']
  
  // Admin signin path
  const isAdminSignin = request.nextUrl.pathname === '/admin/signin'

  // Check if the path requires authentication
  const requiresAuth = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Skip authentication for public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  const isCustomerOnlyPath = customerOnlyPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  console.log('Path:', request.nextUrl.pathname, 'Requires Auth:', requiresAuth, 'Is Public:', isPublicPath, 'Is Customer Only:', isCustomerOnlyPath, 'Is Admin Signin:', isAdminSignin)

  // Verify authentication
  const token = request.cookies.get('auth-token')?.value
  console.log('Token present:', !!token)

  // Check user role if token exists
  let userRole = null
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
      userRole = decoded.role
      console.log('User role:', userRole)
    } catch (error) {
      console.log('Invalid token')
    }
  }

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

  // Token exists, handle authenticated users
  console.log('Token found, user role:', userRole)

  // Redirect admin users away from customer-only pages
  if (userRole === 'admin' && isCustomerOnlyPath) {
    console.log('Admin user accessing customer page, redirecting to admin dashboard')
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Redirect admin users from home page to admin dashboard
  if (userRole === 'admin' && request.nextUrl.pathname === '/') {
    console.log('Admin user accessing home page, redirecting to admin dashboard')
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Handle authenticated users accessing signin pages
  if (isPublicPath || isAdminSignin) {
    if (userRole === 'admin') {
      console.log('Authenticated admin accessing signin page, redirecting to admin dashboard')
      return NextResponse.redirect(new URL('/admin', request.url))
    } else if (!isAdminSignin) {
      console.log('Authenticated user accessing public path, redirecting to home')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Prevent non-admin users from accessing admin signin
  if (isAdminSignin && userRole && userRole !== 'admin') {
    console.log('Non-admin user accessing admin signin, redirecting to regular signin')
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Home page (to redirect admin to dashboard)
    '/',
    
    // Protected client routes
    '/account/:path*',
    '/admin/:path*',
    '/checkout/:path*',
    
    // Customer-only routes (redirect admin away)
    '/shop/:path*',
    '/about/:path*',
    '/delivery/:path*',
    '/contact/:path*',
    '/products/:path*',
    
    // Auth pages (to redirect when already authenticated)
    '/signin',
    '/signup',
    '/admin/signin',
    
    // Protected API routes
    '/api/orders/:path*',
    '/api/products/:path*'
  ]
}
