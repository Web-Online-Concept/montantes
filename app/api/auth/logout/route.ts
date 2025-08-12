import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Créer la réponse
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    })

    // Supprimer le cookie en le mettant à une date expirée
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immédiatement
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Erreur logout:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}