import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'montantes-pro-secret-key-2025'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Récupérer l'admin connecté depuis le token
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1]

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    let adminId: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      adminId = decoded.id
    } catch {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Vérifier que l'email n'est pas déjà utilisé
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingAdmin && existingAdmin.id !== adminId) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Mettre à jour l'email
    await prisma.admin.update({
      where: { id: adminId },
      data: { email: email.toLowerCase() }
    })

    // Créer un nouveau token avec le nouvel email
    const newToken = jwt.sign(
      { 
        id: adminId,
        email: email.toLowerCase()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Créer la réponse avec le nouveau cookie
    const response = NextResponse.json({
      success: true,
      message: 'Email modifié avec succès'
    })

    // Mettre à jour le cookie
    response.cookies.set({
      name: 'auth-token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Erreur changement email:', error)
    return NextResponse.json(
      { error: 'Erreur lors du changement d\'email' },
      { status: 500 }
    )
  }
}