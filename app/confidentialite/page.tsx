import Link from "next/link";
export const metadata = { title: "Politique de confidentialité — VenteSiteInternet.ch" };
export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm"><div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4"><Link href="/" className="text-lg font-bold">Vente<span className="text-emerald-600">SiteInternet</span>.ch</Link></div></header>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Responsable du traitement</h2><p>Adrien Haubrich, Chemin du Langins 30, 1895 Vionnaz, Suisse.<br/>Email : contact@ventesiteinternet.ch</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Données collectées</h2><p>Nous collectons les données suivantes :<br/>• Adresse email et mot de passe (inscription)<br/>• Informations des annonces (titre, description, prix, statistiques)<br/>• Données de contact (email, WhatsApp) fournies volontairement<br/>• Données techniques (adresse IP, navigateur) pour la sécurité</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Finalité du traitement</h2><p>Vos données sont utilisées pour :<br/>• Gérer votre compte et vos annonces<br/>• Permettre la mise en relation entre vendeurs et acheteurs<br/>• Assurer la sécurité de la plateforme<br/>• Communiquer sur votre compte (notifications, support)</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Base légale</h2><p>Le traitement est fondé sur votre consentement (inscription) et l'exécution du contrat (utilisation de la plateforme). Conforme à la LPD (Loi fédérale sur la protection des données) et au RGPD.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Durée de conservation</h2><p>Vos données sont conservées tant que votre compte est actif. Après suppression du compte, les données sont effacées sous 30 jours, sauf obligation légale de conservation.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Sous-traitants</h2><p>• Supabase Inc. (base de données, hébergement EU)<br/>• Vercel Inc. (hébergement site web)<br/>• Stripe Inc. (paiements, si applicable)</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Vos droits</h2><p>Vous pouvez exercer vos droits d'accès, de rectification, de suppression et de portabilité en nous contactant à contact@ventesiteinternet.ch. Nous répondons sous 30 jours.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies</h2><p>Nous utilisons uniquement des cookies essentiels au fonctionnement de la plateforme (authentification, préférences). Aucun cookie de tracking publicitaire n'est utilisé.</p></section>
        </div>
      </div>
    </main>
  );
}
