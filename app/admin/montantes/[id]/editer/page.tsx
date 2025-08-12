'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MontanteAvecNumero, PalierAvecInfos, Objectif, OBJECTIFS_CONFIG, VALIDATION, ETATS_CONFIG, formatEuro, formatPourcentage } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'
import FormulairePalier from '@/components/admin/FormulairePalier'
import ValidationMatchsCombine from '@/components/admin/ValidationMatchsCombine'

export default function EditerMontantePage() {
  const params = useParams()
  const router = useRouter()
  const montanteId = params.id as string

  const [montante, setMontante] = useState<MontanteAvecNumero | null>(null)
  const [paliers, setPaliers] = useState<PalierAvecInfos[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPalierForm, setShowPalierForm] = useState(false)
  const [updatingPalier, setUpdatingPalier] = useState<string | null>(null)
  const [showValidationCombine, setShowValidationCombine] = useState<string | null>(null)
  
  // État du formulaire d'édition
  const [formData, setFormData] = useState({
    nom: '',
    objectif: 'X3' as Objectif
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchMontante()
  }, [montanteId])

  const fetchMontante = async () => {
    try {
      const response = await fetch(`/api/montantes/${montanteId}`)
      if (!response.ok) {
        router.push('/admin/montantes')
        return
      }

      const data = await response.json()
      setMontante(data.montante)
      setPaliers(data.paliers)
      setFormData({
        nom: data.montante.nom,
        objectif: data.montante.objectif
      })
    } catch (error) {
      console.error('Erreur chargement montante:', error)
      router.push('/admin/montantes')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch(`/api/montantes/${montanteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchMontante() // Recharger les données
        alert('Montante mise à jour avec succès')
      } else {
        alert('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleArreterMontante = async () => {
    if (!montante) return

    const gainActuel = montante.gainActuel || montante.miseInitiale
    const confirmMessage = `Êtes-vous sûr de vouloir arrêter cette montante et sécuriser ${formatEuro(gainActuel)} de gain ?`

    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/montantes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: montanteId,
          action: 'arreter',
          gainFinal: gainActuel
        })
      })

      if (response.ok) {
        router.push('/admin/montantes')
      } else {
        alert('Erreur lors de l\'arrêt de la montante')
      }
    } catch (error) {
      console.error('Erreur action:', error)
      alert('Erreur lors de l\'arrêt')
    }
  }

  const handleUpdatePalierStatut = async (palierId: string, nouveauStatut: 'GAGNE' | 'PERDU' | 'ANNULE') => {
    setUpdatingPalier(palierId)
    
    try {
      const response = await fetch(`/api/paliers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          palierId,
          statut: nouveauStatut
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        // Vérifier si l'objectif a été atteint
        if (nouveauStatut === 'GAGNE' && data.objectifAtteint) {
          alert('🎉 Félicitations ! L\'objectif de la montante a été atteint !\n\nLa montante est maintenant terminée avec succès.')
          router.push('/admin/montantes')
        } else {
          // Recharger les données pour les autres cas
          fetchMontante()
        }
      } else {
        alert(data.error || 'Erreur lors de la mise à jour du palier')
      }
    } catch (error) {
      console.error('Erreur mise à jour palier:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setUpdatingPalier(null)
    }
  }

  const handleValidationCombine = async (palierId: string, matchsStatuts: { matchIndex: number; statut: 'GAGNE' | 'PERDU' | 'ANNULE' }[]) => {
    setUpdatingPalier(palierId)
    
    try {
      const response = await fetch(`/api/paliers/combine`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          palierId,
          matchsStatuts
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setShowValidationCombine(null)
        
        // Vérifier si l'objectif a été atteint
        if (data.statutGlobal === 'GAGNE' && data.objectifAtteint) {
          alert('🎉 Félicitations ! L\'objectif de la montante a été atteint !\n\nLa montante est maintenant terminée avec succès.')
          router.push('/admin/montantes')
        } else {
          // Recharger les données pour les autres cas
          fetchMontante()
        }
      } else {
        alert(data.error || 'Erreur lors de la validation du combiné')
      }
    } catch (error) {
      console.error('Erreur validation combiné:', error)
      alert('Erreur lors de la validation')
    } finally {
      setUpdatingPalier(null)
    }
  }

  const handleDeletePalier = async (palierId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce palier ?')) return

    try {
      const response = await fetch(`/api/paliers?id=${palierId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchMontante() // Recharger
      } else {
        alert('Erreur lors de la suppression du palier')
      }
    } catch (error) {
      console.error('Erreur suppression palier:', error)
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fbbf24]"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!montante) return null

  const etatConfig = ETATS_CONFIG[montante.etat]
  const objectifConfig = OBJECTIFS_CONFIG[montante.objectif]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div>
          <Link
            href="/admin/montantes"
            className="inline-flex items-center text-gray-600 hover:text-[#1e40af] transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux montantes
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Éditer la montante n°{montante.numeroAffichage}
              </h1>
              <p className="text-gray-600 mt-1">Modifiez les informations et gérez les paliers</p>
            </div>
            <Link
              href={`/montante/${montante.id}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Voir sur le site
            </Link>
          </div>
        </div>

        {/* État et progression */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">État</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{etatConfig.emoji}</span>
                <span 
                  className="font-semibold text-lg"
                  style={{ color: etatConfig.couleur }}
                >
                  {etatConfig.label}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Mise initiale</p>
              <p className="text-xl font-semibold">{formatEuro(montante.miseInitiale)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {montante.etat === 'EN_COURS' ? 'Gain actuel' : 'Gain final'}
              </p>
              <p className="text-xl font-semibold">{formatEuro(montante.gainActuel || montante.miseInitiale)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Progression</p>
              <p className={`text-xl font-semibold ${montante.progression > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPourcentage(montante.progression)}
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progression vers l'objectif {objectifConfig.label}</span>
              <span className="text-sm font-medium">
                {formatEuro(montante.gainActuel || montante.miseInitiale)} / {formatEuro(montante.miseInitiale * objectifConfig.multiplicateur)}
              </span>
            </div>
            <div className="progress-bar h-4">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${Math.min(((montante.gainActuel || montante.miseInitiale) / (montante.miseInitiale * objectifConfig.multiplicateur)) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de la montante</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la montante
              </label>
              <input
                type="text"
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                disabled={montante.etat !== 'EN_COURS'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                } ${montante.etat !== 'EN_COURS' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            {/* Objectif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif
              </label>
              <select
                value={formData.objectif}
                onChange={(e) => setFormData({ ...formData, objectif: e.target.value as Objectif })}
                disabled={montante.etat !== 'EN_COURS'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                  montante.etat !== 'EN_COURS' ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                }`}
              >
                {Object.entries(OBJECTIFS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label} ({formatEuro(montante.miseInitiale * config.multiplicateur)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {montante.etat === 'EN_COURS' && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          )}
        </div>

        {/* Actions sur la montante */}
        {montante.etat === 'EN_COURS' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <div>
              <button
                onClick={handleArreterMontante}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Arrêter et sécuriser les gains ({formatEuro(montante.gainActuel || montante.miseInitiale)})
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Cette action arrêtera la montante et la marquera comme gagnée avec le gain actuel.
              </p>
            </div>
          </div>
        )}

        {/* Gestion des paliers */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Paliers ({paliers.length})
            </h2>
            {montante.etat === 'EN_COURS' && (
              <button
                onClick={() => setShowPalierForm(!showPalierForm)}
                className="inline-flex items-center px-4 py-2 bg-[#fbbf24] text-[#1e40af] rounded-lg hover:bg-[#f59e0b] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un palier
              </button>
            )}
          </div>

          {/* Formulaire d'ajout de palier */}
          {showPalierForm && montante.etat === 'EN_COURS' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <FormulairePalier
                montanteId={montanteId}
                numeroPalier={paliers.length + 1}
                miseCalculee={
                  paliers.length > 0 && paliers[paliers.length - 1].gain
                    ? paliers[paliers.length - 1].gain!
                    : montante.miseInitiale
                }
                onSuccess={() => {
                  setShowPalierForm(false)
                  fetchMontante()
                }}
                onCancel={() => setShowPalierForm(false)}
              />
            </div>
          )}

          {/* Liste des paliers */}
          {paliers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun palier ajouté pour le moment</p>
          ) : (
            <div className="space-y-4">
              {paliers.map((palier) => (
                <div key={palier.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-semibold">Palier n°{palier.numeroPalier}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          palier.statut === 'GAGNE' ? 'bg-green-100 text-green-800' :
                          palier.statut === 'PERDU' ? 'bg-red-100 text-red-800' :
                          palier.statut === 'ANNULE' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {palier.statut === 'GAGNE' ? '✓ Gagné' :
                           palier.statut === 'PERDU' ? '✗ Perdu' :
                           palier.statut === 'ANNULE' ? '↺ Annulé' :
                           '⏳ En attente'}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Mise:</span>
                          <span className="ml-1 font-medium">{formatEuro(palier.mise)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cote:</span>
                          <span className="ml-1 font-medium">@ {palier.cote.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gain:</span>
                          <span className="ml-1 font-medium">
                            {palier.gain ? formatEuro(palier.gain) : '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Progression:</span>
                          <span className={`ml-1 font-medium ${palier.progressionTotale > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPourcentage(palier.progressionTotale)}
                          </span>
                        </div>
                      </div>
                      {/* Détails des matchs */}
                      {palier.detailsMatchs && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          {palier.detailsMatchs.matchs.map((match, idx) => (
                            <div key={idx} className="flex items-center justify-between mb-2 last:mb-0">
                              <div className="flex items-center gap-2">
                                <span>{match.sport}</span>
                                <span className="font-medium">{match.equipe1} - {match.equipe2}</span>
                                <span className="text-gray-600">→ {match.pronostic}</span>
                                <span className="font-medium">@ {match.cote ? match.cote.toFixed(2) : '1.00'}</span>
                              </div>
                              {match.statut && (
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                  match.statut === 'GAGNE' ? 'bg-green-100 text-green-800' :
                                  match.statut === 'PERDU' ? 'bg-red-100 text-red-800' :
                                  match.statut === 'ANNULE' ? 'bg-gray-100 text-gray-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {match.statut === 'GAGNE' ? '✓ Gagné' :
                                   match.statut === 'PERDU' ? '✗ Perdu' :
                                   match.statut === 'ANNULE' ? '↺ Annulé' :
                                   '⏳ En attente'}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {/* Boutons pour changer le statut */}
                      {montante.etat === 'EN_COURS' && palier.statut === 'EN_ATTENTE' && (
                        <>
                          {/* Si c'est un combiné avec plusieurs matchs, afficher le bouton de validation combiné */}
                          {palier.typePari === 'COMBINE' && palier.detailsMatchs.matchs.length > 1 ? (
                            <button
                              onClick={() => setShowValidationCombine(palier.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              title="Valider chaque match du combiné"
                            >
                              Valider le combiné
                            </button>
                          ) : (
                            // Si c'est un pari simple, afficher les boutons normaux
                            <>
                              <button
                                onClick={() => handleUpdatePalierStatut(palier.id, 'GAGNE')}
                                disabled={updatingPalier === palier.id}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                title="Valider comme gagné"
                              >
                                {updatingPalier === palier.id ? '...' : '✓ Gagné'}
                              </button>
                              <button
                                onClick={() => handleUpdatePalierStatut(palier.id, 'ANNULE')}
                                disabled={updatingPalier === palier.id}
                                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                title="Match annulé (remboursé)"
                              >
                                {updatingPalier === palier.id ? '...' : '↺ Annulé'}
                              </button>
                              <button
                                onClick={() => handleUpdatePalierStatut(palier.id, 'PERDU')}
                                disabled={updatingPalier === palier.id}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                                title="Valider comme perdu"
                              >
                                {updatingPalier === palier.id ? '...' : '✗ Perdu'}
                              </button>
                            </>
                          )}
                        </>
                      )}
                      
                      {/* Bouton supprimer (uniquement dernier palier) */}
                      {montante.etat === 'EN_COURS' && palier.numeroPalier === paliers.length && (
                        <button
                          onClick={() => handleDeletePalier(palier.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Supprimer ce palier"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de validation du combiné */}
      {showValidationCombine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Validation du combiné</h3>
              <button
                onClick={() => setShowValidationCombine(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {paliers.find(p => p.id === showValidationCombine) && (
                <ValidationMatchsCombine
                  palierId={showValidationCombine}
                  matchs={paliers.find(p => p.id === showValidationCombine)!.detailsMatchs.matchs}
                  mise={paliers.find(p => p.id === showValidationCombine)!.mise}
                  onValidation={(matchsStatuts) => handleValidationCombine(showValidationCombine, matchsStatuts)}
                  loading={updatingPalier === showValidationCombine}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}