import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Fonction simple pour créer un token
function createToken(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payloadWithExp = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
  }
  const body = btoa(JSON.stringify(payloadWithExp))
  const signature = btoa(payload.id + process.env.JWT_SECRET!)
  return `${header}.${body}.${signature}`
}

// Fonction simple pour vérifier un token
function verifyToken(token: string): any {
  try {
    const [header, payload, signature] = token.split('.')
    const decoded = JSON.parse(atob(payload))
    
    // Vérifier l'expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    // Vérifier la signature (simplifiée)
    const expectedSignature = btoa(decoded.id + process.env.JWT_SECRET!)
    if (signature !== expectedSignature) {
      return null
    }
    
    return decoded
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }
    
    // Chercher l'admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    })
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, admin.password)
    
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    // Créer le token
    const token = createToken({
      id: admin.id,
      email: admin.email
    })
    
    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email
      }
    })
    
    // Définir le cookie
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 heures
    })
    
    return response
  } catch (error) {
    console.error('Erreur login:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ authenticated: false })
    }
    
    // Vérifier le token
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ authenticated: false })
    }
    
    // Vérifier que l'admin existe toujours
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id }
    })
    
    if (!admin) {
      return NextResponse.json({ authenticated: false })
    }
    
    return NextResponse.json({
      authenticated: true,
      admin: {
        id: admin.id,
        email: admin.email
      }
    })
  } catch (error) {
    console.error('Erreur vérification auth:', error)
    return NextResponse.json({ authenticated: false })
  }
}