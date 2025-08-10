'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function MontanteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [montante, setMontante] = useState(null)
  const [bookmakers, setBookmakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPalierForm, setShowPalierForm] = useState(false)
  
  // État pour le formulaire de nouveau palier
  const [palierForm, setPalierForm] = useState({
    typePari: 'Simple',
    sports: [''],
    matchs: [''],
    typeParis: [''], // Nouveau : type de pari pour chaque match
    pronostics: [''], // Nouveau : pronostic exact
    dateParis: [''], // Nouveau : date/heure du match
    cotes: [''],
    bookmakerId: ''
  })

  // Charger la montante et les bookmakers
  useEffect(() => {
    fetchMontante()
    fetchBookmakers()
  }, [params.id])

  const fetchMontante = async () => {
    try {
      const response = await fetch(`/api/montantes/${params.id}`)
      if (!response.ok) throw new Error('Montante non trouvée')
      const data = await response.json()
      setMontante(data.montante) // FIX: L'API retourne { montante: {...} }
    } catch (error) {
      setError('Erreur lors du chargement de la montante')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookmakers = async () => {
    try {
      const response = await fetch('/api/bookmakers')
      if (!response.ok) throw new Error('Erreur de chargement')
      const data = await response.json()
      setBookmakers(data.bookmakers || []) // FIX: L'API retourne { bookmakers: [...] }
    } catch (error) {
      console.error('Erreur lors du chargement des bookmakers:', error)
    }
  }

  // Ajouter un match/sport/cote au formulaire
  const addField = (field) => {
    setPalierForm({
      ...palierForm,
      [field]: [...palierForm[field], '']
    })
  }

  // Supprimer un match/sport/cote
  const removeField = (field, index) => {
    const newValues = [...palierForm[field]]
    newValues.splice(index, 1)
    setPalierForm({
      ...palierForm,
      [field]: newValues
    })
  }

  // Mettre à jour un champ du formulaire
  const updateField = (field, index, value) => {
    const newValues = [...palierForm[field]]
    newValues[index] = value
    setPalierForm({
      ...palierForm,
      [field]: newValues
    })
  }

  // Calculer la cote totale
  const calculateCoteTotale = () => {
    return palierForm.cotes
      .filter(c => c && !isNaN(parseFloat(c)))
      .reduce((acc, cote) => acc * parseFloat(cote), 1)
      .toFixed(2)
  }

  // Calculer la mise du palier
  const calculateMisePalier = () => {
    if (!montante) return 0
    
    // Si c'est le premier palier, la mise est la mise initiale
    if (!montante.paliers || montante.paliers.length === 0) {
      return montante.miseInitiale
    }
    
    // Sinon, c'est le gain potentiel du dernier palier gagné
    const dernierPalierGagne = [...montante.paliers]
      .reverse()
      .find(p => p.statut === 'GAGNE')
    
    return dernierPalierGagne ? dernierPalierGagne.gainPotentiel : montante.miseInitiale
  }

  // Soumettre le nouveau palier
  const handleSubmitPalier = async (e) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!palierForm.bookmakerId) {
        alert('Veuillez sélectionner un bookmaker')
        return
      }
      
      // Filtrer les champs vides
      const sports = palierForm.sports.filter(s => s.trim())
      const matchs = palierForm.matchs.filter(m => m.trim())
      const typeParis = palierForm.typeParis.filter(t => t.trim())
      const pronostics = palierForm.pronostics.filter(p => p.trim())
      const dateParis = palierForm.dateParis.filter(d => d.trim())
      const cotes = palierForm.cotes.filter(c => c && !isNaN(parseFloat(c))).map(c => parseFloat(c))
      
      if (sports.length === 0 || matchs.length === 0 || cotes.length === 0 || typeParis.length === 0 || pronostics.length === 0) {
        alert('Veuillez remplir tous les champs obligatoires')
        return
      }
      
      const mise = calculateMisePalier()
      const coteTotale = parseFloat(calculateCoteTotale())
      
      const response = await fetch(`/api/montantes/${params.id}/paliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mise,
          cote: coteTotale,
          description: `${palierForm.typePari} - ${matchs.join(', ')}`
        })
      })
      
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du palier')
      
      // Recharger la montante
      fetchMontante()
      
      // Réinitialiser le formulaire
      setPalierForm({
        typePari: 'Simple',
        sports: [''],
        matchs: [''],
        typeParis: [''],
        pronostics: [''],
        dateParis: [''],
        cotes: [''],
        bookmakerId: ''
      })
      setShowPalierForm(false)
    } catch (error) {
      alert('Erreur lors de l\'ajout du palier')
      console.error(error)
    }
  }

  // Mettre à jour le statut d'un palier
  const updatePalierStatus = async (palierId, status) => {
    try {
      const response = await fetch(`/api/montantes/${params.id}/paliers/${palierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      
      // Recharger la montante
      fetchMontante()
    } catch (error) {
      alert('Erreur lors de la mise à jour du palier')
      console.error(error)
    }
  }

  // Clôturer manuellement la montante
  const closeMontante = async () => {
    const dernierPalierGagne = montante.paliers?.slice().reverse().find(p => p.statut === 'GAGNE')
    const gainActuel = dernierPalierGagne ? dernierPalierGagne.gainPotentiel : montante.miseInitiale
    const gainNet = dernierPalierGagne ? (gainActuel - montante.miseInitiale) : -montante.miseInitiale
    
    const message = dernierPalierGagne 
      ? `Êtes-vous sûr de vouloir clôturer cette montante ?\n\nGain actuel : ${gainActuel.toFixed(2)} €\nGain net : ${gainNet.toFixed(2)} €\n\nL'objectif ${montante.objectif} (${(montante.miseInitiale * parseInt(montante.objectif.slice(1))).toFixed(2)} €) n'est pas atteint.`
      : `Êtes-vous sûr de vouloir clôturer cette montante ?\n\nAucun palier gagné.\nPerte : ${montante.miseInitiale.toFixed(2)} €`
    
    if (!confirm(message)) return
    
    try {
      const response = await fetch(`/api/montantes/${params.id}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statut: dernierPalierGagne ? 'GAGNEE' : 'PERDUE'
        })
      })
      
      if (!response.ok) throw new Error('Erreur lors de la clôture')
      
      alert('Montante clôturée avec succès')
      
      // Recharger la montante
      fetchMontante()
    } catch (error) {
      alert('Erreur lors de la clôture de la montante')
      console.error(error)
    }
  }

  // Supprimer un palier
  const deletePalier = async (palierId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce palier ?')) return
    
    try {
      const response = await fetch(`/api/montantes/${params.id}/paliers/${palierId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      // Recharger la montante
      fetchMontante()
    } catch (error) {
      alert('Erreur lors de la suppression du palier')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  if (!montante) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Montante non trouvée</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Montante #{montante.id}</h1>
              <p className="text-gray-600 mt-1">
                Mise initiale: {montante.miseInitiale.toFixed(2)} € | 
                Objectif: {montante.objectif} ({(montante.miseInitiale * parseInt(montante.objectif.slice(1))).toFixed(2)} €)
              </p>
            </div>
            <a 
              href="/admin/montantes"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Retour aux montantes
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Informations de la montante */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Informations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold">
                    {montante.statut === 'en_cours' && <span className="text-blue-600">En cours</span>}
                    {montante.statut === 'GAGNEE' && <span className="text-green-600">Gagnée</span>}
                    {montante.statut === 'PERDUE' && <span className="text-red-600">Perdue</span>}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mise actuelle</p>
                  <p className="font-semibold">{calculateMisePalier().toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre de paliers</p>
                  <p className="font-semibold">{montante.paliers?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de début</p>
                  <p className="font-semibold">{new Date(montante.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              {montante.statut !== 'en_cours' && montante.gainFinal !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Résultat final:</strong> {montante.gainFinal >= 0 ? '+' : ''}{montante.gainFinal.toFixed(2)} €
                  </p>
                  {montante.dateFin && (
                    <p className="text-sm text-gray-600">
                      <strong>Date de fin:</strong> {new Date(montante.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              )}
            </div>
            {montante.statut === 'en_cours' && (
              <div className="ml-4">
                <button
                  onClick={closeMontante}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Clôturer la montante
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Paliers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Paliers</h2>
            {montante.statut === 'en_cours' && (
              <button
                onClick={() => setShowPalierForm(!showPalierForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                + Ajouter un palier
              </button>
            )}
          </div>

          {/* Formulaire d'ajout de palier */}
          {showPalierForm && (
            <form onSubmit={handleSubmitPalier} className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">Nouveau palier</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type de pari */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de pari
                  </label>
                  <select
                    value={palierForm.typePari}
                    onChange={(e) => setPalierForm({ ...palierForm, typePari: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Combiné">Combiné</option>
                  </select>
                </div>

                {/* Bookmaker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bookmaker
                  </label>
                  <select
                    value={palierForm.bookmakerId}
                    onChange={(e) => setPalierForm({ ...palierForm, bookmakerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Sélectionner un bookmaker</option>
                    {bookmakers.map(book => (
                      <option key={book.id} value={book.id}>{book.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sports, Matchs et Cotes */}
              <div className="mt-4 space-y-4">
                {palierForm.sports.map((sport, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sport {index + 1}
                        </label>
                        <input
                          type="text"
                          value={sport}
                          onChange={(e) => updateField('sports', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Football"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Match {index + 1}
                        </label>
                        <input
                          type="text"
                          value={palierForm.matchs[index] || ''}
                          onChange={(e) => updateField('matchs', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="PSG - Lyon"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type de pari
                        </label>
                        <select
                          value={palierForm.typeParis[index] || ''}
                          onChange={(e) => updateField('typeParis', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Sélectionner</option>
                          <option value="1X2">1X2</option>
                          <option value="Over/Under">Over/Under</option>
                          <option value="Handicap">Handicap</option>
                          <option value="Double Chance">Double Chance</option>
                          <option value="BTTS">Les deux équipes marquent</option>
                          <option value="Score exact">Score exact</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pronostic
                        </label>
                        <input
                          type="text"
                          value={palierForm.pronostics[index] || ''}
                          onChange={(e) => updateField('pronostics', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="1, X, Plus 2.5..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cote
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={palierForm.cotes[index] || ''}
                          onChange={(e) => updateField('cotes', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="1.50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date/Heure du match
                        </label>
                        <input
                          type="datetime-local"
                          value={palierForm.dateParis[index] || ''}
                          onChange={(e) => updateField('dateParis', index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    {palierForm.sports.length > 1 && (
                      <div className="mt-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            removeField('sports', index)
                            removeField('matchs', index)
                            removeField('typeParis', index)
                            removeField('pronostics', index)
                            removeField('dateParis', index)
                            removeField('cotes', index)
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Supprimer ce match
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bouton ajouter un match */}
              {(palierForm.typePari === 'Combiné' || palierForm.sports.length === 0) && (
                <button
                  type="button"
                  onClick={() => {
                    addField('sports')
                    addField('matchs')
                    addField('typeParis')
                    addField('pronostics')
                    addField('dateParis')
                    addField('cotes')
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Ajouter un match
                </button>
              )}

              {/* Résumé */}
              <div className="mt-4 bg-blue-50 p-3 rounded">
                <p className="text-sm">
                  <strong>Mise:</strong> {calculateMisePalier().toFixed(2)} € | 
                  <strong> Cote totale:</strong> {calculateCoteTotale()} | 
                  <strong> Gain potentiel:</strong> {(calculateMisePalier() * parseFloat(calculateCoteTotale())).toFixed(2)} €
                </p>
              </div>

              {/* Boutons */}
              <div className="mt-4 flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Ajouter le palier
                </button>
                <button
                  type="button"
                  onClick={() => setShowPalierForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Liste des paliers */}
          {(!montante.paliers || montante.paliers.length === 0) ? (
            <p className="text-gray-500">Aucun palier pour le moment</p>
          ) : (
            <div className="space-y-4">
              {montante.paliers.map((palier) => (
                <div key={palier.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-semibold">Palier {palier.numero}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          palier.statut === 'en_attente' ? 'bg-gray-100 text-gray-700' :
                          palier.statut === 'GAGNE' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {palier.statut === 'en_attente' ? 'En attente' :
                           palier.statut === 'GAGNE' ? 'Gagné' : 'Perdu'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{palier.description}</p>
                        <p className="font-semibold">
                          Cote: {palier.cote} | Mise: {palier.mise.toFixed(2)} € → Gain potentiel: {palier.gainPotentiel.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2 ml-4">
                      {palier.statut === 'en_attente' && montante.statut === 'en_cours' && (
                        <>
                          <button
                            onClick={() => updatePalierStatus(palier.id, 'GAGNE')}
                            className="text-green-600 hover:text-green-800"
                          >
                            ✓ Gagné
                          </button>
                          <button
                            onClick={() => updatePalierStatus(palier.id, 'PERDU')}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✗ Perdu
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deletePalier(palier.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        🗑 Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}