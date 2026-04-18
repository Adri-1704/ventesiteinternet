import Link from "next/link";
export const metadata = { title: "Mentions légales — VenteSiteInternet.ch" };
export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm"><div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4"><Link href="/" className="text-lg font-bold">Vente<span className="text-emerald-600">SiteInternet</span>.ch</Link></div></header>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Éditeur du site</h2><p>Adrien Haubrich<br/>Chemin du Langins 30<br/>1895 Vionnaz, Valais, Suisse<br/>Email : contact@ventesiteinternet.ch</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Hébergement</h2><p>Vercel Inc.<br/>440 N Barranca Ave #4133<br/>Covina, CA 91723, États-Unis<br/>vercel.com</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Base de données</h2><p>Supabase Inc.<br/>San Francisco, CA, États-Unis<br/>Données hébergées en Europe (AWS eu-west)</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Propriété intellectuelle</h2><p>L'ensemble du contenu de ce site (textes, images, logo, code) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Responsabilité</h2><p>VenteSiteInternet.ch est une plateforme de mise en relation. Nous ne sommes pas partie aux transactions entre vendeurs et acheteurs. Chaque utilisateur est responsable de la véracité des informations publiées.</p></section>
        </div>
      </div>
    </main>
  );
}
