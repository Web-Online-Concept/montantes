import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/admin', '/api/admin']
const authRoutes = ['/admin/login', '/api/auth']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))
  
  // Si c'est une route d'auth ou publique, laisser passer
  if (!isProtectedRoute || isAuthRoute) {
    return NextResponse.next()
  }
  
  // Récupérer le token depuis les cookies
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    // Pas de token, rediriger vers login
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  
  try {
    // Vérifier le token avec une requête interne
    const verifyUrl = new URL('/api/auth/login', request.url)
    const verifyResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`
      }
    })
    
    if (!verifyResponse.ok) {
      throw new Error('Token invalide')
    }
    
    return NextResponse.next()
  } catch (error) {
    // Token invalide, supprimer le cookie et rediriger
    const response = path.startsWith('/api/')
      ? NextResponse.json({ error: 'Token invalide' }, { status: 401 })
      : NextResponse.redirect(new URL('/admin/login', request.url))
    
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}