'use client'

import { useEffect } from 'react'

export default function CGUPage() {
  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = 'Conditions Générales d\'Utilisation - Montantes.pro'
    
    // Mise à jour de la description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'CGU de Montantes.pro - Conditions d\'utilisation, responsabilités, obligations des utilisateurs et règles d\'utilisation du site de paris sportifs.')
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
            "name": "Conditions Générales d'Utilisation",
            "description": "Conditions générales d'utilisation du site Montantes.pro",
            "url": "https://montantes.pro/cgu",
            "isPartOf": {
              "@type": "WebSite",
              "@id": "https://montantes.pro"
            },
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString(),
            "inLanguage": "fr-FR",
            "about": {
              "@type": "Thing",
              "name": "Paris sportifs",
              "description": "Conditions d'utilisation pour un site de suivi de montantes"
            }
          })
        }}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
          
          {/* Préambule */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Préambule</h2>
            <p className="text-gray-700 mb-4">
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation du site internet Montantes.pro 
              (ci-après "le Site") édité par Web Online Concept.
            </p>
            <p className="text-gray-700">
              L'utilisation du Site implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, 
              vous devez cesser immédiatement toute utilisation du Site.
            </p>
          </section>

          {/* Article 1 - Objet */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 1 - Objet du Site</h2>
            <p className="text-gray-700 mb-4">
              Le Site a pour objet de fournir des informations et analyses sur les montantes dans le domaine des paris sportifs. 
              Ces informations sont fournies à titre purement informatif et ne constituent en aucun cas :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Des conseils en investissement</li>
              <li>Des incitations aux paris sportifs</li>
              <li>Des garanties de gains</li>
              <li>Des recommandations personnalisées</li>
            </ul>
          </section>

          {/* Article 2 - Accès */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 2 - Conditions d'accès</h2>
            <div className="space-y-4 text-gray-700">
              <p>L'accès au Site est strictement réservé aux personnes majeures (18 ans et plus).</p>
              <p>
                En accédant au Site, l'utilisateur certifie sur l'honneur :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Être majeur selon la législation de son pays de résidence</li>
                <li>Avoir la capacité juridique de contracter</li>
                <li>Ne pas être interdit de jeux</li>
                <li>Utiliser le Site à des fins personnelles et non commerciales</li>
              </ul>
            </div>
          </section>

          {/* Article 3 - Exclusion de responsabilité */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 3 - Exclusion totale de responsabilité</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <p className="font-semibold text-yellow-800 mb-4">
                CLAUSE D'EXCLUSION DE RESPONSABILITÉ :
              </p>
              <div className="space-y-4 text-gray-700">
                <p>
                  Web Online Concept décline toute responsabilité, sans aucune exception, concernant :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Les pertes financières, directes ou indirectes, subies par les utilisateurs</li>
                  <li>L'utilisation ou l'interprétation des informations publiées sur le Site</li>
                  <li>Les décisions prises sur la base des contenus du Site</li>
                  <li>Les erreurs, omissions ou inexactitudes dans les informations fournies</li>
                  <li>Les dommages résultant de l'impossibilité d'utiliser le Site</li>
                  <li>Les préjudices de toute nature résultant de l'utilisation du Site</li>
                  <li>Les conséquences de l'addiction aux jeux d'argent</li>
                </ul>
                <p className="font-semibold mt-4">
                  L'UTILISATEUR ASSUME L'ENTIÈRE RESPONSABILITÉ ET TOUS LES RISQUES LIÉS À L'UTILISATION DU SITE ET DES INFORMATIONS QU'IL CONTIENT.
                </p>
              </div>
            </div>
          </section>

          {/* Article 4 - Nature des informations */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 4 - Nature des informations fournies</h2>
            <div className="space-y-4 text-gray-700">
              <p>Les informations publiées sur le Site :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sont fournies "en l'état" sans aucune garantie</li>
                <li>Ne constituent pas des conseils personnalisés</li>
                <li>Peuvent contenir des erreurs ou des imprécisions</li>
                <li>Ne garantissent aucun résultat</li>
                <li>Reflètent uniquement l'opinion de leurs auteurs</li>
              </ul>
              <p className="font-semibold mt-4">
                Les performances passées ne préjugent en rien des performances futures.
              </p>
            </div>
          </section>

          {/* Article 5 - Obligations de l'utilisateur */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 5 - Obligations et responsabilités de l'utilisateur</h2>
            <p className="text-gray-700 mb-4">
              L'utilisateur s'engage à :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Utiliser le Site conformément aux présentes CGU</li>
              <li>Ne pas reproduire ou diffuser le contenu du Site sans autorisation</li>
              <li>Ne pas utiliser le Site à des fins illégales ou non autorisées</li>
              <li>Assumer l'entière responsabilité de ses décisions de paris</li>
              <li>Ne jamais parier plus qu'il ne peut se permettre de perdre</li>
              <li>Respecter la législation en vigueur dans son pays de résidence</li>
            </ul>
            <p className="text-gray-700 font-semibold">
              L'utilisateur reconnaît que les paris sportifs peuvent créer une dépendance et s'engage à jouer de manière responsable.
            </p>
          </section>

          {/* Article 6 - Propriété intellectuelle */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 6 - Propriété intellectuelle</h2>
            <p className="text-gray-700">
              Tous les contenus présents sur le Site (textes, images, graphiques, logo, etc.) sont la propriété exclusive 
              de Web Online Concept ou de ses partenaires. Toute reproduction, distribution, modification ou utilisation 
              de ces contenus est strictement interdite sans autorisation écrite préalable.
            </p>
          </section>

          {/* Article 7 - Limitation de garantie */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 7 - Absence de garantie</h2>
            <div className="space-y-4 text-gray-700">
              <p className="font-semibold">
                Web Online Concept ne garantit pas :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>L'exactitude, la complétude ou l'actualité des informations</li>
                <li>Que le Site fonctionnera sans interruption ou sans erreur</li>
                <li>Que les défauts seront corrigés</li>
                <li>Que le Site est exempt de virus ou d'éléments nuisibles</li>
                <li>Les résultats qui pourraient être obtenus par l'utilisation des informations</li>
              </ul>
            </div>
          </section>

          {/* Article 8 - Indemnisation */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 8 - Indemnisation</h2>
            <p className="text-gray-700">
              L'utilisateur s'engage à indemniser, défendre et dégager de toute responsabilité Web Online Concept, 
              ses dirigeants, employés et partenaires contre toute réclamation, demande, action, dommages et intérêts, 
              pertes, coûts et dépenses (y compris les frais d'avocat) découlant de ou liés à son utilisation du Site 
              ou à la violation des présentes CGU.
            </p>
          </section>

          {/* Article 9 - Modification des CGU */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 9 - Modification des CGU</h2>
            <p className="text-gray-700">
              Web Online Concept se réserve le droit de modifier les présentes CGU à tout moment. 
              Les modifications entrent en vigueur dès leur publication sur le Site. 
              Il appartient à l'utilisateur de consulter régulièrement les CGU.
            </p>
          </section>

          {/* Article 10 - Jeu responsable */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 10 - Avertissement sur le jeu responsable</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="font-semibold text-red-800 mb-4">
                JOUER COMPORTE DES RISQUES :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-red-700">
                <li>Endettement</li>
                <li>Isolement social</li>
                <li>Dépendance</li>
                <li>Problèmes familiaux</li>
              </ul>
              <p className="mt-4 font-semibold text-red-800">
                Si vous avez besoin d'aide : 09-74-75-13-13 (appel non surtaxé)
              </p>
            </div>
          </section>

          {/* Article 11 - Droit applicable */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 11 - Droit applicable et juridiction</h2>
            <p className="text-gray-700">
              Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation 
              ou à leur exécution relève de la compétence exclusive des tribunaux français.
            </p>
          </section>

          {/* Article 12 - Contact */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Article 12 - Contact</h2>
            <p className="text-gray-700">
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
            </p>
            <p className="text-gray-700 mt-2">
              Email : web.online.concept@gmail.com
            </p>
          </section>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500">
              Date d'entrée en vigueur : {new Date().toLocaleDateString('fr-FR')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              En continuant à utiliser ce site, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}