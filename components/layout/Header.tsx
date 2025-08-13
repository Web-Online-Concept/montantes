'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { formatEuro } from '@/types'

export default function Header() {
  const pathname = usePathname()
  const [bankroll, setBankroll] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Fetch bankroll au chargement
  useEffect(() => {
    fetchBankroll()
  }, [pathname]) // Refresh quand on change de page

  const fetchBankroll = async () => {
    try {
      const response = await fetch('/api/bankroll')
      if (response.ok) {
        const data = await response.json()
        setBankroll(data.bankrollActuelle)
      }
    } catch (error) {
      console.error('Erreur chargement bankroll:', error)
    }
  }

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Statistiques', href: '/statistiques' },
    { name: 'Historique', href: '/historique' },
    { name: 'Fonctionnement', href: '/fonctionnement' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="bg-[#1e40af] shadow-lg sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Montantes.pro" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-white font-bold text-xl">Montantes.pro</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#fbbf24] text-[#1e40af]'
                    : 'text-white hover:bg-[#2563eb] hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Bankroll + Telegram + Stake Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {bankroll !== null && (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-[#fbbf24]">Bankroll</p>
                <p className="text-white font-bold">{formatEuro(bankroll)}</p>
              </div>
            )}
            <a
              href="https://t.me/montantespro"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              <p className="text-xs text-[#fbbf24]">Notifs</p>
              <p className="text-white font-bold">Telegram</p>
            </a>
            <a
              href="https://rounders.pro/jouer-sur-stake"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              <p className="text-xs text-[#fbbf24]">Jouer sur</p>
              <p className="text-white font-bold">Stake</p>
            </a>
          </div>

          {/* Menu Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#fbbf24] p-2"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile Ouvert */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-[#fbbf24] text-[#1e40af]'
                      : 'text-white hover:bg-[#2563eb]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {bankroll !== null && (
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg mt-2">
                  <p className="text-xs text-[#fbbf24]">Bankroll</p>
                  <p className="text-white font-bold">{formatEuro(bankroll)}</p>
                </div>
              )}
              <a
                href="https://t.me/montantespro"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg mt-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <p className="text-xs text-[#fbbf24]">Notifs</p>
                <p className="text-white font-bold">Telegram</p>
              </a>
              <a
                href="https://rounders.pro/jouer-sur-stake"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg mt-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <p className="text-xs text-[#fbbf24]">Jouer sur</p>
                <p className="text-white font-bold">Stake</p>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}