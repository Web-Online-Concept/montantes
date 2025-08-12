'use client'

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-900">
          Mentions Légales
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <div className="text-gray-700 leading-relaxed">
            <p>
              Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), 
              nous vous informons des mentions légales relatives au site web Montantes.pro.
            </p>
          </div>

          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              1. Éditeur du site
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Raison sociale :</strong> Web Online Concept - Auto Entreprise</p>
              <p><strong>Statut juridique :</strong> Entrepreneur individuel (EI)</p>
              <p><strong>Siège social :</strong> Rue Paul Estival - 31200 Toulouse</p>
              <p><strong>Email :</strong> web.online.concept@gmail.com</p>
              <p><strong>SIRET :</strong> 510 583 800 00048</p>
              <p><strong>Numéro de TVA intracommunautaire :</strong> FR 05 510583800</p>
              <p><strong>Directeur de la publication :</strong> Le représentant légal de Web Online Concept</p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              2. Hébergement
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold">Le site est hébergé par :</p>
                <p><strong>Vercel Inc.</strong></p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789, USA</p>
                <p>Site web : <a href="https://vercel.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://vercel.com</a></p>
              </div>
              
              <div className="mt-4">
                <p className="font-semibold">Les données sont stockées chez :</p>
                <div className="ml-4 mt-2">
                  <p><strong>Github</strong> (code source)</p>
                  <p>88 Colin P Kelly Jr St</p>
                  <p>San Francisco, CA 94107, USA</p>
                  <p className="mt-2"><strong>Neon</strong> (base de données)</p>
                  <p>San Francisco, CA, USA</p>
                </div>
              </div>
            </div>
          </section>

          {/* Conception et réalisation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              3. Conception et réalisation
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Entreprise :</strong> Web Online Concept</p>
              <p><strong>Email :</strong> web.online.concept@gmail.com</p>
              <p><strong>Technologies utilisées :</strong> Next.js, React, TypeScript, Tailwind CSS</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              4. Propriété intellectuelle
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La structure générale du site, ainsi que les textes, graphiques, images, sons et vidéos la 
                composant, sont la propriété de l'éditeur ou de ses partenaires. Toute représentation et/ou 
                reproduction et/ou exploitation partielle ou totale des contenus et services proposés par le 
                site, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de 
                Web Online Concept et/ou de ses partenaires est strictement interdite et serait susceptible 
                de constituer une contrefaçon au sens des articles L 335-2 et suivants du Code de la propriété 
                intellectuelle.
              </p>
              <p>
                La marque "Montantes.pro" est une marque déposée par Web Online Concept. Toute reproduction 
                totale ou partielle de cette marque sans autorisation expresse est interdite.
              </p>
            </div>
          </section>

          {/* Données personnelles et RGPD */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              5. Protection des données personnelles
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) 
                et à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée, vous disposez des droits suivants :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement ("droit à l'oubli")</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement à tout moment</li>
                <li>Droit d'introduire une réclamation auprès de la CNIL</li>
              </ul>
              <p>
                Pour exercer ces droits ou pour toute question sur le traitement de vos données dans ce dispositif, 
                vous pouvez nous contacter :
              </p>
              <ul className="list-none ml-4 space-y-1">
                <li><strong>Par email :</strong> web.online.concept@gmail.com</li>
                <li><strong>Par courrier :</strong> Web Online Concept - Rue Paul Estival - 31200 Toulouse</li>
              </ul>
              <p>
                Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez 
                adresser une réclamation à la CNIL :
              </p>
              <div className="ml-4 mt-2">
                <p>Commission Nationale de l'Informatique et des Libertés</p>
                <p>3 Place de Fontenoy - TSA 80715</p>
                <p>75334 PARIS CEDEX 07</p>
                <p>Site web : <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              6. Cookies et traceurs
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Ces cookies ne 
                collectent aucune donnée personnelle identifiable et sont essentiels pour assurer la sécurité 
                et les fonctionnalités de base du site.
              </p>
              <p>
                Les cookies utilisés incluent :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Cookies de session :</strong> pour maintenir votre connexion sécurisée</li>
                <li><strong>Cookies de préférences :</strong> pour mémoriser vos choix de configuration</li>
                <li><strong>Cookies de sécurité :</strong> pour protéger contre les attaques CSRF</li>
              </ul>
              <p>
                Conformément à la directive ePrivacy et au RGPD, nous vous informons que vous pouvez configurer 
                votre navigateur pour refuser les cookies. Cependant, cela pourrait affecter le fonctionnement 
                de certaines parties du site.
              </p>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              7. Limitation de responsabilité
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site est 
                périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions 
                ou des lacunes.
              </p>
              <p>
                Web Online Concept décline toute responsabilité quant à :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>L'utilisation qui pourrait être faite des informations et contenus présents sur le site</li>
                <li>L'impossibilité d'utiliser le site</li>
                <li>Les éventuels problèmes techniques rencontrés</li>
                <li>Les dommages directs ou indirects résultant de l'utilisation du site</li>
              </ul>
              <p>
                L'utilisateur est seul responsable de l'utilisation qu'il fait des contenus et informations 
                présents sur le site.
              </p>
            </div>
          </section>

          {/* Liens hypertextes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              8. Liens hypertextes
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Le site peut contenir des liens hypertextes vers d'autres sites. Web Online Concept n'exerce 
                aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux 
                dommages qui pourraient résulter de leur utilisation.
              </p>
              <p>
                La mise en place de liens hypertextes vers le site Montantes.pro est soumise à autorisation 
                préalable. Veuillez nous contacter pour toute demande.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              9. Droit applicable et juridiction compétente
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige et après 
                échec de toute tentative de recherche d'une solution amiable, les tribunaux français seront 
                seuls compétents pour connaître de ce litige.
              </p>
              <p>
                Pour toute question relative aux présentes mentions légales ou à l'utilisation du site, vous 
                pouvez nous contacter à l'adresse : web.online.concept@gmail.com
              </p>
            </div>
          </section>

          {/* Crédits */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              10. Crédits
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                Les crédits photos et images utilisées sur ce site appartiennent à leurs propriétaires respectifs.
              </p>
              <p>
                Icônes et illustrations : License libre de droits ou création originale.
              </p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Dernière mise à jour : Août 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}