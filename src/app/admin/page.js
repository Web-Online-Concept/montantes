'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Erreur vérification auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Mot de passe incorrect');
      }
    } catch (error) {
      setError('Erreur de connexion');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  // Si pas connecté, afficher le formulaire
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Administration</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-indigo-600 hover:text-indigo-800">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Si connecté, afficher le dashboard admin
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Administration</h1>
            <div className="flex items-center gap-4">
              <a 
                href="/"
                className="text-blue-600 hover:text-blue-800"
              >
                Voir le site
              </a>
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
          <p className="text-gray-600 mb-8">
            Bienvenue dans l'administration des montantes !
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/admin/montantes" className="block bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition">
              <h3 className="font-semibold text-lg mb-2">Montantes</h3>
              <p className="text-gray-600">
                Gérer les montantes en cours et l'historique
              </p>
            </a>
            
            <a href="/admin/bookmakers" className="block bg-green-50 p-6 rounded-lg hover:bg-green-100 transition">
              <h3 className="font-semibold text-lg mb-2">Bookmakers</h3>
              <p className="text-gray-600">
                Gérer la liste des bookmakers
              </p>
            </a>
            
            <a href="/admin/bankroll" className="block bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition">
              <h3 className="font-semibold text-lg mb-2">Bankroll</h3>
              <p className="text-gray-600">
                Voir et gérer l'évolution de la bankroll
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}