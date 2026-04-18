import Link from "next/link";
export const metadata = { title: "Conditions Générales — VenteSiteInternet.ch" };
export default function CGV() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm"><div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4"><Link href="/" className="text-lg font-bold">Vente<span className="text-emerald-600">SiteInternet</span>.ch</Link></div></header>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales d&apos;Utilisation</h1>
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">1. Objet</h2><p>VenteSiteInternet.ch est une plateforme de mise en relation entre vendeurs et acheteurs de sites web, e-commerces, SaaS et noms de domaine en Suisse. Nous ne sommes pas partie aux transactions.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">2. Inscription</h2><p>L'inscription est gratuite pour les acheteurs. Les vendeurs doivent souscrire à un abonnement payant pour publier des annonces. Chaque utilisateur doit fournir des informations exactes.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">3. Annonces</h2><p>Les annonces sont soumises à validation par notre équipe. Nous nous réservons le droit de refuser ou supprimer toute annonce ne respectant pas nos critères (contenu illicite, informations fausses, spam). Le vendeur est seul responsable de l'exactitude des informations publiées.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">4. Abonnements vendeurs</h2><p>Les abonnements sont facturés selon la période choisie (mensuel, trimestriel, semestriel, annuel). Annulation possible à tout moment. Le remboursement des périodes non-utilisées est possible au prorata. Aucune commission n'est prélevée sur les transactions.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">5. Transactions</h2><p>VenteSiteInternet.ch n'est pas partie aux transactions entre utilisateurs. Nous recommandons l'utilisation d'un contrat de vente et d'un séquestre pour les transactions importantes. Nous ne garantissons pas la solvabilité des parties ni la conformité des sites vendus.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">6. Responsabilité</h2><p>Notre responsabilité est limitée au fonctionnement technique de la plateforme. Nous ne sommes pas responsables des litiges entre utilisateurs, de la véracité des annonces, ni des pertes financières liées aux transactions.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">7. Propriété intellectuelle</h2><p>Le contenu du site (logo, textes, code, design) est protégé par le droit d'auteur suisse. Les annonces restent la propriété de leurs auteurs.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">8. Résiliation</h2><p>L'utilisateur peut supprimer son compte à tout moment. Nous pouvons suspendre ou supprimer un compte en cas de violation des présentes conditions.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">9. Droit applicable</h2><p>Les présentes conditions sont soumises au droit suisse. En cas de litige, le for est au tribunal compétent de Monthey, Valais, Suisse.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">10. Modification</h2><p>Nous nous réservons le droit de modifier ces conditions. Les utilisateurs seront informés par email de tout changement significatif.</p></section>
        </div>
      </div>
    </main>
  );
}
