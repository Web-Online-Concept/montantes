import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function verifyPassword(password) {
  // On compare directement avec le mot de passe en clair pour éviter les problèmes
  return password === ADMIN_PASSWORD
}

export function generateToken() {
  return jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyToken(token) {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  
  if (!token) return false
  
  return await verifyToken(token.value)
}

export async function setAuthCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}