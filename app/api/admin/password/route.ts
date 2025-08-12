import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'montantes-pro-secret-key-2025'

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Mots de passe requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' },
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

    // Récupérer l'admin
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin introuvable' },
        { status: 404 }
      )
    }

    // Vérifier le mot de passe actuel
    const passwordValid = await bcrypt.compare(currentPassword, admin.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      )
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    })

  } catch (error) {
    console.error('Erreur changement mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    )
  }
}