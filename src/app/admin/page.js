import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default async function AdminPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Administration</h1>
            <div className="flex items-center gap-4">
              <a 
                href="/"
                target="_blank"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Voir le site
              </a>
              <form action="/api/auth/logout" method="POST">
                <button 
                  type="submit"
                  className="text-red-600 hover:text-red-800"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
          <p className="text-gray-600">
            Bienvenue dans l'administration des montantes !
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/admin/montantes" className="block bg-blue-50 p-4 rounded hover:bg-blue-100 transition">
              <h3 className="font-semibold">Montantes</h3>
              <p className="text-sm text-gray-600 mt-2">
                Gérer les montantes en cours
              </p>
            </a>
            
            <a href="/admin/bookmakers" className="block bg-green-50 p-4 rounded hover:bg-green-100 transition">
              <h3 className="font-semibold">Bookmakers</h3>
              <p className="text-sm text-gray-600 mt-2">
                Gérer les bookmakers
              </p>
            </a>
            
            <a href="/admin/bankroll" className="block bg-purple-50 p-4 rounded hover:bg-purple-100 transition">
              <h3 className="font-semibold">Bankroll</h3>
              <p className="text-sm text-gray-600 mt-2">
                Voir l'évolution de la bankroll
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}