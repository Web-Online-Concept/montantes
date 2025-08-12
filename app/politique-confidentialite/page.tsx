'use client'

import Link from 'next/link'

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-900">
          Politique de Confidentialité
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="bg-blue-50 p-6 rounded-lg space-y-4 text-gray-700">
              <p className="font-semibold">
                Dernière mise à jour : Août 2025
              </p>
              <p>
                Web Online Concept ("nous", "notre" ou "nos") exploite le site web Montantes.pro (le "Service").
              </p>
              <p>
                Cette politique de confidentialité vous informe de nos pratiques concernant la collecte, 
                l'utilisation et la divulgation des données personnelles lorsque vous utilisez notre Service, 
                conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) 
                et à la loi française "Informatique et Libertés".
              </p>
              <p>
                Nous attachons une grande importance à la protection de vos données personnelles et nous nous 
                engageons à assurer leur confidentialité et leur sécurité.
              </p>
            </div>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              1. Responsable du traitement
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>Le responsable du traitement des données personnelles est :</p>
              <div className="ml-4 space-y-1">
                <p><strong>Web Online Concept</strong></p>
                <p>Auto-Entreprise</p>
                <p>Rue Paul Estival</p>
                <p>31200 Toulouse, France</p>
                <p>Email : web.online.concept@gmail.com</p>
                <p>SIRET : 510 583 800 00048</p>
              </div>
            </div>
          </section>

          {/* Types de données collectées */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              2. Types de données collectées
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous collectons plusieurs types de données pour fournir et améliorer notre Service :
              </p>

              <h3 className="text-lg font-semibold text-blue-700">2.1 Données d'identification</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Nom d'utilisateur (pseudonyme)</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">2.2 Données de connexion</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Mot de passe (stocké de manière chiffrée)</li>
                <li>Date et heure de connexion</li>
                <li>Adresse IP</li>
                <li>Type et version du navigateur</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">2.3 Données d'utilisation</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Pages visitées et fonctionnalités utilisées</li>
                <li>Données relatives aux montantes créées</li>
                <li>Statistiques de performance</li>
                <li>Préférences d'affichage</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">2.4 Données techniques</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>Système d'exploitation</li>
                <li>Résolution d'écran</li>
                <li>Langue du navigateur</li>
                <li>Données de cookies (voir section dédiée)</li>
              </ul>
            </div>
          </section>

          {/* Base légale et finalités */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              3. Base légale et finalités du traitement
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous traitons vos données personnelles sur les bases légales suivantes et pour les finalités 
                correspondantes :
              </p>

              <h3 className="text-lg font-semibold text-blue-700">3.1 Exécution du contrat</h3>
              <p>Pour :</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Fournir l'accès aux fonctionnalités du Service</li>
                <li>Sauvegarder vos montantes et préférences</li>
                <li>Assurer le support technique</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">3.2 Intérêts légitimes</h3>
              <p>Pour :</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Améliorer et optimiser notre Service</li>
                <li>Assurer la sécurité du Service</li>
                <li>Prévenir la fraude et les abus</li>
                <li>Établir des statistiques anonymisées</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">3.3 Consentement</h3>
              <p>Pour :</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Envoyer des communications marketing (si vous y avez consenti)</li>
                <li>Utiliser des cookies non essentiels</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">3.4 Obligation légale</h3>
              <p>Pour :</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Répondre aux demandes des autorités compétentes</li>
                <li>Respecter nos obligations comptables et fiscales</li>
              </ul>
            </div>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              4. Durée de conservation des données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités 
                pour lesquelles elles sont traitées :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Données de compte :</strong> pendant toute la durée de vie de votre compte et 
                  3 ans après sa clôture
                </li>
                <li>
                  <strong>Données de connexion :</strong> 12 mois à compter de la collecte
                </li>
                <li>
                  <strong>Données de cookies :</strong> selon la durée spécifiée pour chaque cookie 
                  (maximum 13 mois)
                </li>
                <li>
                  <strong>Données comptables :</strong> 10 ans conformément aux obligations légales
                </li>
                <li>
                  <strong>Données relatives aux demandes d'exercice de droits :</strong> 5 ans à compter 
                  de la demande
                </li>
              </ul>
              <p>
                À l'expiration de ces délais, vos données sont supprimées ou anonymisées de manière irréversible.
              </p>
            </div>
          </section>

          {/* Destinataires des données */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              5. Destinataires des données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Vos données personnelles peuvent être communiquées aux destinataires suivants :
              </p>

              <h3 className="text-lg font-semibold text-blue-700">5.1 Prestataires techniques</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Vercel :</strong> hébergement du site web</li>
                <li><strong>Github :</strong> stockage du code source</li>
                <li><strong>Neon :</strong> hébergement de la base de données</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">5.2 Autorités compétentes</h3>
              <p>
                Uniquement sur demande légale (autorités judiciaires, administratives, etc.)
              </p>

              <p className="mt-4">
                Nous exigeons de tous nos prestataires qu'ils s'engagent à respecter la confidentialité 
                et la sécurité de vos données personnelles.
              </p>
            </div>
          </section>

          {/* Transferts internationaux */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              6. Transferts de données hors Union Européenne
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Certains de nos prestataires techniques sont situés aux États-Unis. Les transferts de données 
                vers ces prestataires sont encadrés par :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Les clauses contractuelles types de la Commission européenne</li>
                <li>Des garanties appropriées conformément au RGPD</li>
              </ul>
              <p>
                Vous pouvez obtenir une copie de ces garanties en nous contactant à l'adresse indiquée 
                dans cette politique.
              </p>
            </div>
          </section>

          {/* Sécurité des données */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              7. Sécurité des données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour assurer 
                un niveau de sécurité adapté au risque, notamment :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Chiffrement des mots de passe avec des algorithmes robustes</li>
                <li>Connexion sécurisée HTTPS pour toutes les pages du site</li>
                <li>Authentification à deux facteurs disponible</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Contrôle d'accès strict aux données</li>
                <li>Formation du personnel à la protection des données</li>
                <li>Tests de sécurité réguliers</li>
              </ul>
              <p>
                Malgré ces mesures, aucune méthode de transmission sur Internet ou de stockage électronique 
                n'est sûre à 100%. Nous ne pouvons donc garantir une sécurité absolue.
              </p>
            </div>
          </section>

          {/* Droits des personnes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              8. Vos droits
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
              </p>

              <h3 className="text-lg font-semibold text-blue-700">8.1 Droit d'accès</h3>
              <p>
                Vous pouvez obtenir la confirmation que des données vous concernant sont traitées et 
                demander une copie de ces données.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">8.2 Droit de rectification</h3>
              <p>
                Vous pouvez demander la rectification de vos données si elles sont inexactes ou incomplètes.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">8.3 Droit à l'effacement ("droit à l'oubli")</h3>
              <p>
                Vous pouvez demander l'effacement de vos données dans certains cas prévus par le RGPD.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">8.4 Droit à la limitation du traitement</h3>
              <p>
                Vous pouvez demander la limitation du traitement de vos données dans certains cas.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">8.5 Droit à la portabilité</h3>
              <p>
                Vous pouvez recevoir vos données dans un format structuré et les transmettre à un autre 
                responsable de traitement.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">8.6 Droit d'opposition</h3>
              <p>
                Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre 
                situation particulière.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">8.7 Droit de retirer votre consentement</h3>
              <p>
                Lorsque le traitement est fondé sur votre consentement, vous pouvez le retirer à tout moment.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">8.8 Droit de définir des directives post-mortem</h3>
              <p>
                Vous pouvez définir des directives relatives à la conservation, à l'effacement et à la 
                communication de vos données après votre décès.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <p className="font-semibold mb-2">Pour exercer vos droits :</p>
                <p>Contactez-nous à : <strong>web.online.concept@gmail.com</strong></p>
                <p className="mt-2 text-sm">
                  Nous répondrons à votre demande dans un délai d'un mois. Ce délai peut être prolongé 
                  de deux mois en cas de complexité de la demande.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              9. Cookies et technologies similaires
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold text-blue-700">9.1 Qu'est-ce qu'un cookie ?</h3>
              <p>
                Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">9.2 Cookies utilisés</h3>
              <p>Nous utilisons les types de cookies suivants :</p>
              
              <div className="ml-4 space-y-4">
                <div>
                  <p className="font-semibold">Cookies strictement nécessaires</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Cookies de session pour maintenir votre connexion</li>
                    <li>Cookies de sécurité (protection CSRF)</li>
                    <li>Cookies de préférences linguistiques</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Cookies de fonctionnalité</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Mémorisation de vos préférences d'affichage</li>
                    <li>Personnalisation de l'interface</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Cookies analytiques (soumis à consentement)</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Analyse de l'utilisation du site</li>
                    <li>Amélioration des performances</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">9.3 Gestion des cookies</h3>
              <p>
                Vous pouvez gérer vos préférences en matière de cookies via notre bandeau de consentement 
                ou les paramètres de votre navigateur. Le refus des cookies peut affecter certaines 
                fonctionnalités du site.
              </p>
            </div>
          </section>

          {/* Mineurs */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              10. Protection des mineurs
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Notre Service n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas 
                sciemment de données personnelles auprès de mineurs.
              </p>
              <p>
                Si vous êtes parent ou tuteur et que vous découvrez que votre enfant nous a fourni des 
                données personnelles, veuillez nous contacter. Si nous apprenons que nous avons collecté 
                des données personnelles d'enfants sans vérification du consentement parental, nous prenons 
                des mesures pour supprimer ces informations de nos serveurs.
              </p>
            </div>
          </section>

          {/* Violation de données */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              11. Notification en cas de violation de données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                En cas de violation de données personnelles susceptible d'engendrer un risque élevé pour 
                vos droits et libertés, nous nous engageons à :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Notifier la CNIL dans les 72 heures</li>
                <li>Vous informer dans les meilleurs délais si le risque est élevé</li>
                <li>Prendre toutes les mesures nécessaires pour limiter les conséquences</li>
              </ul>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              12. Modifications de cette politique
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité. Nous vous informerons de 
                tout changement en publiant la nouvelle politique sur cette page et en mettant à jour 
                la date de "Dernière mise à jour".
              </p>
              <p>
                Pour les changements substantiels, nous vous en informerons par email ou via une 
                notification bien visible sur notre Service.
              </p>
              <p>
                Nous vous conseillons de consulter régulièrement cette politique pour rester informé 
                de nos pratiques en matière de protection des données.
              </p>
            </div>
          </section>

          {/* Réclamation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              13. Droit de réclamation
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Si vous estimez que le traitement de vos données personnelles constitue une violation 
                du RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL :
              </p>
              <div className="ml-4 mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">Commission Nationale de l'Informatique et des Libertés (CNIL)</p>
                <p>3 Place de Fontenoy - TSA 80715</p>
                <p>75334 PARIS CEDEX 07</p>
                <p>Téléphone : 01 53 73 22 22</p>
                <p>Site web : <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              14. Nous contacter
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Pour toute question concernant cette politique de confidentialité ou vos données 
                personnelles, vous pouvez nous contacter :
              </p>
              <div className="ml-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold mb-2">Web Online Concept</p>
                <p><strong>Email :</strong> web.online.concept@gmail.com</p>
                <p><strong>Adresse postale :</strong></p>
                <p className="ml-4">
                  Web Online Concept<br />
                  Rue Paul Estival<br />
                  31200 Toulouse<br />
                  France
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Nous nous engageons à répondre à vos demandes dans les meilleurs délais et au plus 
                tard dans le délai d'un mois prévu par le RGPD.
              </p>
            </div>
          </section>

          {/* Liens vers autres pages légales */}
          <section className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Voir aussi</h3>
            <div className="space-y-2">
              <p>
                <Link href="/mentions-legales" className="text-blue-600 hover:underline">
                  → Mentions légales
                </Link>
              </p>
              <p>
                <Link href="/conditions-generales" className="text-blue-600 hover:underline">
                  → Conditions générales d'utilisation
                </Link>
              </p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Dernière mise à jour : Août 2025
            </p>
            <p className="text-sm text-gray-600 text-center">
              Version : 1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}