'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { formatEuro } from '@/types'

interface AdminInfo {
  id: string
  email: string
  createdAt: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function AdminSettingsPage() {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null)
  const [bankrollInitiale, setBankrollInitiale] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Formulaires
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [newEmail, setNewEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Récupérer les infos admin
      const authRes = await fetch('/api/auth/login')
      if (authRes.ok) {
        const authData = await authRes.json()
        if (authData.authenticated && authData.admin) {
          setAdminInfo({
            ...authData.admin,
            createdAt: new Date().toISOString() // Placeholder
          })
          setNewEmail(authData.admin.email)
        }
      }

      // Récupérer la bankroll initiale
      const bankrollRes = await fetch('/api/bankroll')
      if (bankrollRes.ok) {
        const bankrollData = await bankrollRes.json()
        setBankrollInitiale(bankrollData.bankrollInitiale.toString())
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Mot de passe actuel requis'
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Nouveau mot de passe requis'
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (response.ok) {
        alert('Mot de passe modifié avec succès')
        setShowPasswordForm(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const data = await response.json()
        setErrors({ password: data.error || 'Erreur lors de la modification' })
      }
    } catch (error) {
      console.error('Erreur modification mot de passe:', error)
      setErrors({ password: 'Erreur lors de la modification' })
    } finally {
      setSaving(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!newEmail || !newEmail.includes('@')) {
      setErrors({ email: 'Email invalide' })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      })

      if (response.ok) {
        alert('Email modifié avec succès')
        setShowEmailForm(false)
        fetchSettings()
      } else {
        const data = await response.json()
        setErrors({ email: data.error || 'Erreur lors de la modification' })
      }
    } catch (error) {
      console.error('Erreur modification email:', error)
      setErrors({ email: 'Erreur lors de la modification' })
    } finally {
      setSaving(false)
    }
  }

  const handleBankrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const montant = parseFloat(bankrollInitiale)
    if (isNaN(montant) || montant <= 0) {
      setErrors({ bankroll: 'Montant invalide' })
      return
    }

    if (!confirm(`Êtes-vous sûr de vouloir modifier la bankroll initiale à ${formatEuro(montant)} ?\n\nCela affectera tous les calculs de performance.`)) {
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/bankroll-initiale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ montant })
      })

      if (response.ok) {
        alert('Bankroll initiale modifiée avec succès')
      } else {
        const data = await response.json()
        setErrors({ bankroll: data.error || 'Erreur lors de la modification' })
      }
    } catch (error) {
      console.error('Erreur modification bankroll:', error)
      setErrors({ bankroll: 'Erreur lors de la modification' })
    } finally {
      setSaving(false)
    }
  }

  const handleResetDatabase = async () => {
    const confirmed = confirm(
      '⚠️ ATTENTION ⚠️\n\n' +
      'Cette action va SUPPRIMER DÉFINITIVEMENT :\n' +
      '- Toutes les montantes\n' +
      '- Tous les paliers\n' +
      '- Tout l\'historique de bankroll\n\n' +
      'La bankroll sera réinitialisée à sa valeur initiale.\n\n' +
      'Cette action est IRRÉVERSIBLE !\n\n' +
      'Êtes-vous absolument sûr de vouloir continuer ?'
    )

    if (!confirmed) return

    const doubleConfirm = prompt(
      'Pour confirmer la réinitialisation complète, tapez "REINITIALISER" en majuscules :'
    )

    if (doubleConfirm !== 'REINITIALISER') {
      alert('Réinitialisation annulée')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        alert('Base de données réinitialisée avec succès')
        window.location.href = '/admin'
      } else {
        alert('Erreur lors de la réinitialisation')
      }
    } catch (error) {
      console.error('Erreur réinitialisation:', error)
      alert('Erreur lors de la réinitialisation')
    } finally {
      setSaving(false)
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

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Gérez les paramètres de l'application et votre compte admin</p>
        </div>

        {/* Informations du compte */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Compte administrateur</h2>
          
          {adminInfo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{adminInfo.email}</p>
                </div>
                {!showEmailForm && (
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="text-[#1e40af] hover:text-[#fbbf24] transition-colors text-sm font-medium"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {showEmailForm && (
                <form onSubmit={handleEmailSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Nouvel email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailForm(false)
                        setNewEmail(adminInfo.email)
                        setErrors({})
                      }}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50"
                    >
                      {saving ? 'Modification...' : 'Modifier'}
                    </button>
                  </div>
                </form>
              )}

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-gray-600">Mot de passe</p>
                  <p className="font-medium">••••••••</p>
                </div>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-[#1e40af] hover:text-[#fbbf24] transition-colors text-sm font-medium"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                        setErrors({})
                      }}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50"
                    >
                      {saving ? 'Modification...' : 'Modifier'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Paramètres de l'application */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres de l'application</h2>
          
          <form onSubmit={handleBankrollSubmit} className="space-y-4">
            <div>
              <label htmlFor="bankrollInitiale" className="block text-sm font-medium text-gray-700 mb-2">
                Bankroll initiale
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    id="bankrollInitiale"
                    value={bankrollInitiale}
                    onChange={(e) => setBankrollInitiale(e.target.value)}
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] ${
                      errors.bankroll ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50"
                >
                  {saving ? 'Modification...' : 'Modifier'}
                </button>
              </div>
              {errors.bankroll && (
                <p className="mt-1 text-sm text-red-600">{errors.bankroll}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Modifiez ce montant uniquement si vous souhaitez recalculer toutes les performances
              </p>
            </div>
          </form>
        </div>

        {/* Zone danger */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-red-200">
          <h2 className="text-xl font-semibold text-red-900 mb-6">Zone danger</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Réinitialiser la base de données</h3>
              <p className="text-sm text-gray-600 mb-4">
                Cette action supprimera définitivement toutes les montantes, paliers et l'historique de bankroll. 
                La bankroll sera réinitialisée à sa valeur initiale.
              </p>
              <button
                onClick={handleResetDatabase}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Réinitialiser la base de données
              </button>
            </div>
          </div>
        </div>

        {/* Informations système */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">Informations système</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Version de l'application</dt>
              <dd className="font-medium">1.0.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Base de données</dt>
              <dd className="font-medium">PostgreSQL (Neon)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Framework</dt>
              <dd className="font-medium">Next.js 14</dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminLayout>
  )
}