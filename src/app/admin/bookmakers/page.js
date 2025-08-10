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
    code: '',
    ordre: 0,
    actif: true
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
      setBookmakers(data)
    } catch (error) {
      console.error('Erreur:', error)
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
      setNewBookmaker({ nom: '', code: '', ordre: 0, actif: true })
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'ajout')
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={newBookmaker.nom}
                  onChange={(e) => setNewBookmaker({...newBookmaker, nom: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Code"
                  value={newBookmaker.code}
                  onChange={(e) => setNewBookmaker({...newBookmaker, code: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Ordre"
                  value={newBookmaker.ordre}
                  onChange={(e) => setNewBookmaker({...newBookmaker, ordre: parseInt(e.target.value)})}
                  className="px-3 py-2 border rounded"
                />
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
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
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
                        bookmaker.nom
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === bookmaker.id ? (
                        <input
                          type="text"
                          value={editForm.code}
                          onChange={(e) => setEditForm({...editForm, code: e.target.value})}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {bookmaker.code}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === bookmaker.id ? (
                        <input
                          type="number"
                          value={editForm.ordre}
                          onChange={(e) => setEditForm({...editForm, ordre: parseInt(e.target.value)})}
                          className="px-2 py-1 border rounded w-20"
                        />
                      ) : (
                        bookmaker.ordre
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === bookmaker.id ? (
                        <select
                          value={editForm.actif}
                          onChange={(e) => setEditForm({...editForm, actif: e.target.value === 'true'})}
                          className="px-2 py-1 border rounded"
                        >
                          <option value="true">Actif</option>
                          <option value="false">Inactif</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${
                          bookmaker.actif 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bookmaker.actif ? 'Actif' : 'Inactif'}
                        </span>
                      )}
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
                        <button
                          onClick={() => handleEdit(bookmaker)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
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