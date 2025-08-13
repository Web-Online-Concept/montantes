'use client'

import Link from 'next/link'

export default function ConditionsGeneralesPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-900">
          Conditions Générales d&apos;Utilisation
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Préambule */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Préambule
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (ci-après &quot;CGU&quot;) régissent l&apos;utilisation du site 
                internet Montantes.pro (ci-après le &quot;Site&quot;), édité par Web Online Concept.
              </p>
              <p>
                L&apos;accès et l&apos;utilisation du Site sont soumis à l&apos;acceptation et au respect des présentes CGU. 
                En utilisant le Site, vous reconnaissez avoir pris connaissance de ces conditions et les accepter 
                sans réserve.
              </p>
              <p>
                Web Online Concept se réserve le droit de modifier à tout moment les présentes CGU. Les modifications 
                entrent en vigueur dès leur publication sur le Site. Il appartient à l&apos;utilisateur de consulter 
                régulièrement les CGU.
              </p>
            </div>
          </section>

          {/* Définitions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 1 - Définitions
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>&quot;Site&quot; :</strong> désigne le site internet accessible à l&apos;adresse www.montantes.pro</p>
              <p><strong>&quot;Éditeur&quot; :</strong> désigne Web Online Concept, éditeur du Site</p>
              <p><strong>&quot;Utilisateur&quot; :</strong> désigne toute personne physique ou morale accédant au Site</p>
              <p><strong>&quot;Contenu&quot; :</strong> désigne l&apos;ensemble des informations, textes, images, vidéos présents sur le Site</p>
              <p><strong>&quot;Services&quot; :</strong> désigne l&apos;ensemble des fonctionnalités proposées par le Site</p>
              <p><strong>&quot;Montante&quot; :</strong> désigne une stratégie de paris sportifs progressive</p>
            </div>
          </section>

          {/* Objet */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 2 - Objet
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Les présentes CGU ont pour objet de définir les modalités et conditions d&apos;utilisation du Site 
                ainsi que les droits et obligations des parties dans ce cadre.
              </p>
              <p>
                Le Site a pour objet de :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Fournir des informations et des outils de suivi pour les stratégies de paris sportifs de type &quot;montante&quot;</li>
                <li>Permettre aux utilisateurs de créer et gérer leurs montantes</li>
                <li>Offrir des statistiques et analyses sur les performances des montantes</li>
                <li>Proposer du contenu éducatif sur les paris sportifs responsables</li>
              </ul>
            </div>
          </section>

          {/* Accès au site */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 3 - Accès au Site
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="text-lg font-semibold text-blue-700">3.1 Conditions d&apos;accès</h3>
              <p>
                L&apos;accès au Site est réservé aux personnes majeures (18 ans révolus). En accédant au Site, 
                l&apos;Utilisateur certifie être majeur et avoir la capacité juridique pour accepter les présentes CGU.
              </p>
              
              <h3 className="text-lg font-semibold text-blue-700 mt-4">3.2 Disponibilité du Site</h3>
              <p>
                Le Site est accessible 24h/24 et 7j/7, sous réserve d&apos;interruptions, programmées ou non, 
                pour les besoins de maintenance ou en cas de force majeure.
              </p>
              <p>
                L&apos;Éditeur ne saurait être tenu responsable de toute impossibilité d&apos;accès au Site ou de 
                toute dégradation des conditions d&apos;accès pour des raisons indépendantes de sa volonté.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">3.3 Compatibilité technique</h3>
              <p>
                L&apos;Utilisateur reconnaît disposer des moyens techniques nécessaires pour accéder au Site et 
                l&apos;utiliser correctement. L&apos;Éditeur ne garantit pas que le Site fonctionne sans interruption 
                ou erreur sur tous les équipements.
              </p>
            </div>
          </section>

          {/* Inscription et compte utilisateur */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 4 - Inscription et Compte Utilisateur
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="text-lg font-semibold text-blue-700">4.1 Création de compte</h3>
              <p>
                L&apos;accès à certaines fonctionnalités du Site nécessite la création d&apos;un compte utilisateur. 
                L&apos;inscription est gratuite et s&apos;effectue en remplissant le formulaire prévu à cet effet.
              </p>
              
              <h3 className="text-lg font-semibold text-blue-700 mt-4">4.2 Exactitude des informations</h3>
              <p>
                L&apos;Utilisateur s&apos;engage à fournir des informations exactes, complètes et à jour lors de son 
                inscription et à les maintenir à jour.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">4.3 Confidentialité des identifiants</h3>
              <p>
                L&apos;Utilisateur est responsable de la confidentialité de ses identifiants de connexion. Toute 
                utilisation du Site avec ses identifiants est réputée avoir été effectuée par l&apos;Utilisateur.
              </p>
              <p>
                En cas de perte, vol ou utilisation frauduleuse de ses identifiants, l&apos;Utilisateur doit 
                immédiatement en informer l&apos;Éditeur.
              </p>
            </div>
          </section>

          {/* Utilisation du site */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 5 - Utilisation du Site
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="text-lg font-semibold text-blue-700">5.1 Utilisation conforme</h3>
              <p>
                L&apos;Utilisateur s&apos;engage à utiliser le Site conformément aux présentes CGU, à la législation 
                en vigueur et aux bonnes mœurs.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">5.2 Comportements interdits</h3>
              <p>Il est notamment interdit de :</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Utiliser le Site à des fins illégales ou non autorisées</li>
                <li>Tenter d&apos;accéder sans autorisation à d&apos;autres comptes ou à des parties non publiques du Site</li>
                <li>Perturber ou interrompre le fonctionnement du Site</li>
                <li>Transmettre des virus ou tout code malveillant</li>
                <li>Collecter des données personnelles d&apos;autres utilisateurs</li>
                <li>Utiliser des robots ou méthodes automatisées pour accéder au Site</li>
                <li>Contourner les mesures de sécurité du Site</li>
                <li>Reproduire, copier ou revendre tout ou partie du Site</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">5.3 Contenu utilisateur</h3>
              <p>
                Si le Site permet aux utilisateurs de publier du contenu, l&apos;Utilisateur garantit que ce contenu :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Ne viole aucun droit de propriété intellectuelle</li>
                <li>N&apos;est pas diffamatoire, injurieux ou discriminatoire</li>
                <li>Ne contient pas de propos incitant à la haine ou à la violence</li>
                <li>Respecte la vie privée d&apos;autrui</li>
                <li>Est conforme à la législation en vigueur</li>
              </ul>
            </div>
          </section>

          {/* Avertissement paris sportifs */}
          <section className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-800">
              Article 6 - Avertissement sur les Paris Sportifs
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 font-bold text-xl">⚠️</span>
                <p className="font-semibold">
                  LES PARIS SPORTIFS COMPORTENT DES RISQUES FINANCIERS IMPORTANTS
                </p>
              </div>
              
              <p>
                Le Site fournit des outils et informations à titre purement informatif. Les stratégies de 
                montantes présentées ne garantissent aucun gain et peuvent entraîner des pertes importantes.
              </p>
              
              <p className="font-semibold">L&apos;Utilisateur reconnaît que :</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Les paris sportifs peuvent créer une dépendance</li>
                <li>Il ne doit jamais parier plus qu&apos;il ne peut se permettre de perdre</li>
                <li>Les performances passées ne préjugent pas des résultats futurs</li>
                <li>Le Site n&apos;encourage pas les paris sportifs et ne prend aucune commission</li>
                <li>La décision de parier relève de sa seule responsabilité</li>
              </ul>
              
              <p className="mt-4">
                <strong>Jouez responsablement.</strong> Si vous pensez avoir un problème avec les jeux d&apos;argent, 
                consultez : <a href="https://www.joueurs-info-service.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.joueurs-info-service.fr</a> ou 
                appelez le <strong>09 74 75 13 13</strong> (appel non surtaxé).
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 7 - Propriété Intellectuelle
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                L&apos;ensemble des éléments du Site (structure, textes, images, logos, marques, graphismes, etc.) 
                est protégé par le droit de la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite sans 
                autorisation écrite préalable de l&apos;Éditeur.
              </p>
              <p>
                L&apos;Utilisateur s&apos;interdit notamment de :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Extraire ou réutiliser une partie substantielle du contenu du Site</li>
                <li>Reproduire à des fins commerciales tout élément du Site</li>
                <li>Modifier ou altérer tout élément du Site</li>
              </ul>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 8 - Données Personnelles
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                La collecte et le traitement des données personnelles sont effectués dans le respect du 
                Règlement Général sur la Protection des Données (RGPD) et de la législation française.
              </p>
              <p>
                Pour plus d&apos;informations sur le traitement de vos données personnelles, veuillez consulter 
                notre <Link href="/politique-confidentialite" className="text-blue-600 hover:underline">Politique de Confidentialité</Link>.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 9 - Responsabilité
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="text-lg font-semibold text-blue-700">9.1 Responsabilité de l&apos;Éditeur</h3>
              <p>
                L&apos;Éditeur ne pourra être tenu responsable des dommages directs ou indirects résultant de :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>L&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le Site</li>
                <li>L&apos;utilisation des informations ou outils fournis sur le Site</li>
                <li>Les pertes financières liées aux paris sportifs</li>
                <li>Les interruptions ou dysfonctionnements du Site</li>
                <li>Les virus ou éléments malveillants provenant de tiers</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">9.2 Responsabilité de l&apos;Utilisateur</h3>
              <p>
                L&apos;Utilisateur est seul responsable de :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>L&apos;utilisation qu&apos;il fait du Site et de ses fonctionnalités</li>
                <li>Ses décisions en matière de paris sportifs</li>
                <li>La protection de ses données de connexion</li>
                <li>Tout dommage causé à des tiers du fait de son utilisation du Site</li>
              </ul>
            </div>
          </section>

          {/* Liens hypertextes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 10 - Liens Hypertextes
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Le Site peut contenir des liens vers des sites tiers. L&apos;Éditeur n&apos;exerce aucun contrôle 
                sur ces sites et décline toute responsabilité quant à leur contenu ou pratiques.
              </p>
              <p>
                L&apos;existence d&apos;un lien depuis le Site ne constitue pas une validation ou recommandation 
                du site lié par l&apos;Éditeur.
              </p>
            </div>
          </section>

          {/* Modification et résiliation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 11 - Modification et Résiliation
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="text-lg font-semibold text-blue-700">11.1 Modification des CGU</h3>
              <p>
                L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications 
                entrent en vigueur dès leur publication sur le Site.
              </p>

              <h3 className="text-lg font-semibold text-blue-700 mt-4">11.2 Résiliation</h3>
              <p>
                L&apos;Éditeur peut suspendre ou résilier l&apos;accès de l&apos;Utilisateur au Site en cas de :
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Non-respect des présentes CGU</li>
                <li>Comportement frauduleux ou illégal</li>
                <li>Atteinte aux intérêts de l&apos;Éditeur ou d&apos;autres utilisateurs</li>
              </ul>
              <p>
                L&apos;Utilisateur peut cesser d&apos;utiliser le Site à tout moment et demander la suppression 
                de son compte en contactant l&apos;Éditeur.
              </p>
            </div>
          </section>

          {/* Force majeure */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 12 - Force Majeure
            </h2>
            <p className="text-gray-700 leading-relaxed">
              L&apos;Éditeur ne pourra être tenu responsable de l&apos;inexécution de ses obligations en cas de 
              force majeure, notamment en cas de catastrophe naturelle, incendie, grève, guerre, 
              émeute, défaillance des réseaux de télécommunication ou acte de piratage informatique.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 13 - Droit Applicable et Juridiction
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Les présentes CGU sont régies par le droit français.
              </p>
              <p>
                En cas de litige relatif à l&apos;interprétation ou l&apos;exécution des présentes CGU, les parties 
                s&apos;efforceront de trouver une solution amiable.
              </p>
              <p>
                À défaut d&apos;accord amiable, tout litige sera soumis aux tribunaux compétents de Toulouse.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Article 14 - Contact
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                Pour toute question concernant les présentes CGU ou l&apos;utilisation du Site, vous pouvez 
                nous contacter :
              </p>
              <ul className="list-none ml-4 space-y-1">
                <li><strong>Par email :</strong> web.online.concept@gmail.com</li>
                <li><strong>Par courrier :</strong> Web Online Concept - Rue Paul Estival - 31200 Toulouse</li>
              </ul>
            </div>
          </section>

          {/* Date de mise à jour */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Date d&apos;entrée en vigueur : Août 2025
            </p>
            <p className="text-sm text-gray-600 text-center">
              Dernière mise à jour : Août 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}