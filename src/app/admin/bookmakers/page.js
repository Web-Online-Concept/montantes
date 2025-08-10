'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X, Plus } from 'lucide-react'

export default function BookmakersPage() {
  const [bookmakers, setBookmakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBookmaker, setNewBookmaker] = useState({
    nom: '',
    couleur: '#3B82F6'
  })
  const router = useRouter()

  useEffect(() => {
    fetchBookmakers()
  }, [])

  const fetchBookmakers = async () => {
    try {
      const res = await fetch('/api/bookmakers')
      if (!res.ok) throw new Error('Erreur')
      const data = await res.json()
      // FIX: L'API retourne { bookmakers: [...] }
      setBookmakers(data.bookmakers || [])
    } catch (error) {
      console.error('Erreur:', error)
      setBookmakers([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (bookmaker) => {
    setEditingId(bookmaker.id)
    setEditForm(bookmaker)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSaveEdit = async () => {
    try {
      const res = await fetch('/api/bookmakers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      if (!res.ok) throw new Error('Erreur')
      
      await fetchBookmakers()
      setEditingId(null)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const handleAddBookmaker = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/bookmakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookmaker)
      })
      
      if (!res.ok) throw new Error('Erreur')
      
      await fetchBookmakers()
      setShowAddForm(false)
      setNewBookmaker({ nom: '', couleur: '#3B82F6' })
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'ajout')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bookmaker ?')) return

    try {
      const res = await fetch(`/api/bookmakers?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error('Erreur')
      
      await fetchBookmakers()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Gestion des Bookmakers</h1>
            <button
              onClick={() => router.push('/admin')}
              className="text-blue-600 hover:text-blue-800"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              Ajouter un bookmaker
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddBookmaker} className="p-6 bg-gray-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nom du bookmaker"
                  value={newBookmaker.nom}
                  onChange={(e) => setNewBookmaker({...newBookmaker, nom: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm">Couleur:</label>
                  <input
                    type="color"
                    value={newBookmaker.couleur}
                    onChange={(e) => setNewBookmaker({...newBookmaker, couleur: e.target.value})}
                    className="h-10 w-20"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Couleur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'ajout
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookmakers.map((bookmaker) => (
                  <tr key={bookmaker.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === bookmaker.id ? (
                        <input
                          type="text"
                          value={editForm.nom}
                          onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        <span className="font-medium">{bookmaker.nom}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === bookmaker.id ? (
                        <input
                          type="color"
                          value={editForm.couleur}
                          onChange={(e) => setEditForm({...editForm, couleur: e.target.value})}
                          className="h-8 w-20"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: bookmaker.couleur }}
                          />
                          <span className="text-sm text-gray-600">{bookmaker.couleur}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bookmaker.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === bookmaker.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(bookmaker)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(bookmaker.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}