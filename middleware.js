import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request) {
  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')
    
    if (!token || !(await verifyToken(token.value))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}