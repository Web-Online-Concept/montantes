import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1e40af] text-white mt-0 md:mt-12 pb-20 md:pb-0">
      {/* Section principale */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 mb-4 justify-center md:justify-center">
              <img 
                src="/logo.png" 
                alt="Montantes.pro" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="font-bold text-xl">Montantes.pro</span>
            </div>
            <p className="text-sm text-blue-100">
              Plateforme professionnelle de suivi et gestion de montantes dans les paris sportifs.
              Transparence totale et méthodologie stricte.
            </p>
          </div>

          {/* Navigation et Nous suivre sur mobile - 2 colonnes */}
          <div className="grid grid-cols-2 gap-4 md:contents">
            {/* Navigation */}
            <div className="md:col-span-1 md:text-center">
              <h3 className="font-semibold text-lg mb-4 text-[#fbbf24]">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-blue-100 hover:text-[#fbbf24] transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/statistiques" className="text-sm text-blue-100 hover:text-[#fbbf24] transition-colors">
                    Statistiques
                  </Link>
                </li>
                <li>
                  <Link href="/historique" className="text-sm text-blue-100 hover:text-[#fbbf24] transition-colors">
                    Historique bankroll
                  </Link>
                </li>
                <li>
                  <Link href="/fonctionnement" className="text-sm text-blue-100 hover:text-[#fbbf24] transition-colors">
                    Comment ça marche ?
                  </Link>
                </li>
              </ul>
            </div>

            {/* Nous suivre */}
            <div className="md:col-span-1">
              <h3 className="font-semibold text-lg mb-4 text-[#fbbf24] md:text-center">Nous suivre</h3>
              <div className="md:flex md:flex-col md:items-center">
                <div className="md:flex md:gap-3">
                  <a
                    href="https://t.me/montantespro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#0088cc] hover:bg-[#0077b3] text-white px-4 py-2 rounded-lg transition-colors mb-3 md:mb-4"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                    </svg>
                    <span className="font-medium text-sm">Canal Telegram</span>
                  </a>
                  <a
                    href="https://rounders.pro/jouer-sur-stake"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg transition-colors mb-4 md:mb-4"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10l7-7m0 0h-6m6 0v6" />
                    </svg>
                    <span className="font-medium text-sm">Jouer sur Stake</span>
                  </a>
                </div>
              </div>
              <p className="text-sm text-blue-100">
                Recevez nos montantes en temps réel et suivez notre progression.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Avertissement - même couleur que le footer principal */}
      <div className="bg-[#1e40af] border-t border-blue-400/20 px-4 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-blue-100 leading-relaxed">
            <strong>Avertissement :</strong> Les montantes sont une technique à très haut risque. Un seul pari perdu entraîne la perte totale de la montante. 
            Les performances passées ne garantissent pas les résultats futurs. Ne pariez jamais plus que ce que vous pouvez 
            vous permettre de perdre. Les paris sportifs peuvent créer une dépendance. Jouez de manière responsable et 
            fixez-vous des limites strictes. Si vous pensez avoir un problème avec le jeu, demandez de l'aide.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#172554] px-4 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-blue-200">
            © {currentYear} Montantes.pro - Tous droits réservés - 
            <Link href="/mentions-legales" className="mx-1 hover:text-[#fbbf24] transition-colors">
              Mentions légales
            </Link>
            -
            <Link href="/conditions-generales" className="mx-1 hover:text-[#fbbf24] transition-colors">
              CGU
            </Link>
            -
            <Link href="/politique-confidentialite" className="mx-1 hover:text-[#fbbf24] transition-colors">
              Confidentialité
            </Link>
            -
            <Link href="/admin/login" className="ml-1 hover:text-[#fbbf24] transition-colors">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}