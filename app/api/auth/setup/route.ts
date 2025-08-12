import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Cette route permet de créer le premier admin
// À utiliser une seule fois pour initialiser le système
export async function POST(request: Request) {
  try {
    const { email, password, setupKey } = await request.json()

    // Vérifier la clé de setup (sécurité)
    const SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'montantes-pro-setup-2025'
    
    if (setupKey !== SETUP_KEY) {
      return NextResponse.json(
        { error: 'Clé de setup invalide' },
        { status: 403 }
      )
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Vérifier s'il y a déjà des admins
    const adminCount = await prisma.admin.count()
    
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Un administrateur existe déjà' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'admin
    const admin = await prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword
      }
    })

    // Créer aussi les settings par défaut si non existants
    const settingsCount = await prisma.settings.count()
    if (settingsCount === 0) {
      await prisma.settings.create({
        data: {
          bankrollInitiale: 1000,
          bankrollActuelle: 1000,
          bankrollDisponible: 1000
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Administrateur créé avec succès',
      admin: {
        id: admin.id,
        email: admin.email
      }
    })

  } catch (error) {
    console.error('Erreur setup admin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'administrateur' },
      { status: 500 }
    )
  }
}

// GET pour vérifier si le setup est nécessaire
export async function GET() {
  try {
    const adminCount = await prisma.admin.count()
    
    return NextResponse.json({
      setupRequired: adminCount === 0
    })

  } catch (error) {
    console.error('Erreur vérification setup:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}