import { NextResponse } from 'next/server'
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      )
    }

    const isValid = await verifyPassword(password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    const token = generateToken()
    await setAuthCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur login:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}