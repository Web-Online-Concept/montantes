'use client'

import { useEffect } from 'react'

export default function MentionsLegalesPage() {
  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = 'Mentions Légales - Montantes.pro'
    
    // Mise à jour de la description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Mentions légales de Montantes.pro - Informations légales, éditeur du site, hébergement, propriété intellectuelle et conditions d\'utilisation.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Mentions Légales",
            "description": "Mentions légales et informations juridiques de Montantes.pro",
            "url": "https://montantes.pro/mentions-legales",
            "isPartOf": {
              "@type": "WebSite",
              "@id": "https://montantes.pro"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rue Paul Estival",
                "addressLocality": "Toulouse",
                "postalCode": "31200",
                "addressCountry": "FR"
              },
              "email": "web.online.concept@gmail.com",
              "taxID": "510 583 800 00048"
            }
          })
        }}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
          
          {/* Éditeur du site */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Éditeur du site</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Raison sociale :</strong> Web Online Concept - Auto Entreprise</p>
              <p><strong>Siège social :</strong> Rue Paul Estival - 31200 Toulouse</p>
              <p><strong>Email :</strong> web.online.concept@gmail.com</p>
              <p><strong>SIRET :</strong> 510 583 800 00048</p>
              <p><strong>Directeur de la publication :</strong> Le représentant légal de Web Online Concept</p>
            </div>
          </section>

          {/* Hébergement */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Hébergement</h2>
            <div className="space-y-2 text-gray-700">
              <p>Ce site est hébergé par Vercel Inc.</p>
              <p>440 N Barranca Ave #4133</p>
              <p>Covina, CA 91723</p>
              <p>Email: support@vercel.com</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Propriété intellectuelle</h2>
            <p className="text-gray-700 mb-4">
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p className="text-gray-700">
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse 
              du directeur de la publication.
            </p>
          </section>

          {/* Limitation de responsabilité */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Limitation de responsabilité</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
                mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
              </p>
              <p className="font-semibold">
                Web Online Concept décline toute responsabilité concernant :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Les dommages directs ou indirects causés à l'utilisateur lors de l'accès au site</li>
                <li>L'utilisation ou l'impossibilité d'utiliser le site</li>
                <li>Les pertes financières résultant de l'utilisation des informations présentes sur le site</li>
                <li>Les erreurs, omissions ou inexactitudes pouvant figurer sur le site</li>
                <li>Les contenus des sites externes vers lesquels des liens sont proposés</li>
              </ul>
            </div>
          </section>

          {/* Avertissement paris sportifs */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Avertissement sur les paris sportifs</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800 mb-4 font-semibold">
                AVERTISSEMENT IMPORTANT :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-red-700">
                <li>Les paris sportifs comportent des risques financiers importants</li>
                <li>Les performances passées ne garantissent en aucun cas les résultats futurs</li>
                <li>Ce site fournit des informations à titre indicatif uniquement</li>
                <li>Web Online Concept n'est pas responsable des pertes financières subies par les utilisateurs</li>
                <li>Les paris sportifs sont interdits aux mineurs</li>
                <li>Jouer comporte des risques : endettement, isolement, dépendance</li>
                <li>Pour être aidé, appelez le 09-74-75-13-13 (appel non surtaxé)</li>
              </ul>
            </div>
          </section>

          {/* Clause de non-responsabilité */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Clause de non-responsabilité</h2>
            <div className="space-y-4 text-gray-700">
              <p className="font-semibold">
                Web Online Concept ne saurait être tenu responsable :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Des décisions prises par les utilisateurs sur la base des informations fournies</li>
                <li>Des pertes financières résultant de l'utilisation des stratégies présentées</li>
                <li>De l'exactitude, de l'exhaustivité ou de la pertinence des informations</li>
                <li>Des actions entreprises par les utilisateurs suite à la consultation du site</li>
                <li>Des conséquences de l'utilisation des informations par des tiers</li>
              </ul>
              <p className="font-semibold mt-4">
                L'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Protection des données personnelles</h2>
            <p className="text-gray-700 mb-4">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
              vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant.
            </p>
            <p className="text-gray-700">
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse : web.online.concept@gmail.com
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Cookies</h2>
            <p className="text-gray-700">
              Ce site peut utiliser des cookies pour améliorer l'expérience utilisateur. En naviguant sur ce site, 
              vous acceptez l'utilisation de cookies conformément à notre politique de confidentialité.
            </p>
          </section>

          {/* Droit applicable */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Droit applicable et juridiction compétente</h2>
            <p className="text-gray-700">
              Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, 
              le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Contact</h2>
            <p className="text-gray-700">
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter à l'adresse email : 
              web.online.concept@gmail.com
            </p>
          </section>

          <div className="mt-8 pt-8 border-t text-sm text-gray-500">
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </main>
    </div>
  )
}