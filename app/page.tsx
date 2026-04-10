import Link from "next/link";

const categories = [
  { icon: "🖥️", name: "Sites vitrine", count: 0, slug: "vitrine" },
  { icon: "🛒", name: "E-commerce", count: 0, slug: "ecommerce" },
  { icon: "⚡", name: "SaaS", count: 0, slug: "saas" },
  { icon: "🌐", name: "Noms de domaine", count: 0, slug: "domaines" },
];

const features = [
  {
    icon: "🇨🇭",
    title: "100% Suisse",
    description: "Plateforme dédiée au marché suisse. Vendeurs et acheteurs vérifiés.",
  },
  {
    icon: "🔒",
    title: "Annonces sécurisées",
    description: "Chaque annonce est vérifiée manuellement avant publication.",
  },
  {
    icon: "💬",
    title: "Contact direct",
    description: "Contactez les vendeurs par email ou WhatsApp. Pas d'intermédiaire.",
  },
  {
    icon: "📊",
    title: "Statistiques incluses",
    description: "Trafic, revenus, ancienneté — toutes les infos pour décider.",
  },
  {
    icon: "🏷️",
    title: "Prix transparent",
    description: "Un seul abonnement pour les vendeurs. Gratuit pour les acheteurs.",
  },
  {
    icon: "🚀",
    title: "Visibilité maximale",
    description: "Votre annonce visible par tous les entrepreneurs suisses.",
  },
];

const faqs = [
  {
    q: "C'est gratuit pour les acheteurs ?",
    a: "Oui, 100% gratuit. Parcourez les annonces et contactez les vendeurs sans frais.",
  },
  {
    q: "Comment fonctionne la mise en relation ?",
    a: "Les acheteurs contactent directement les vendeurs par email ou WhatsApp. Nous ne prenons aucune commission sur les transactions.",
  },
  {
    q: "Quels types de sites peut-on vendre ?",
    a: "Sites vitrine, e-commerces, SaaS et noms de domaine. Tous les projets digitaux basés en Suisse.",
  },
  {
    q: "Puis-je annuler mon abonnement ?",
    a: "Oui, sans engagement. Vous pouvez annuler à tout moment depuis votre espace vendeur.",
  },
  {
    q: "Les annonces sont-elles vérifiées ?",
    a: "Oui, chaque annonce est vérifiée manuellement par notre équipe avant publication.",
  },
];

const pricing = [
  { name: "Mensuel", price: 29.95, period: "/mois", badge: null, perMonth: 29.95 },
  { name: "Trimestriel", price: 80.85, period: "/3 mois", badge: "-10%", perMonth: 26.95 },
  { name: "Semestriel", price: 143.70, period: "/6 mois", badge: "-20%", perMonth: 23.95 },
  { name: "Annuel", price: 251.55, period: "/an", badge: "-30%", perMonth: 20.97, popular: true },
];

function formatCHF(n: number) {
  return n.toLocaleString("fr-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold">
            Vente<span className="text-emerald-400">SiteInternet</span>.ch
          </span>
          <div className="flex items-center gap-6">
            <a href="#annonces" className="hidden sm:block text-sm text-neutral-400 hover:text-white">Annonces</a>
            <a href="#pricing" className="hidden sm:block text-sm text-neutral-400 hover:text-white">Tarifs</a>
            <Link href="/auth/login" className="text-sm text-neutral-400 hover:text-white">Connexion</Link>
            <Link href="/auth/signup" className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
              Vendre mon site
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden pt-20 px-6">
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/8 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            La marketplace suisse pour les sites web
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Achetez et vendez
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              des sites web en Suisse
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
            Sites vitrine, e-commerces, SaaS et noms de domaine.
            Trouvez votre prochain projet digital ou vendez le vôtre.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/annonces"
              className="w-full rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black hover:bg-neutral-200 sm:w-auto"
            >
              Parcourir les annonces
            </Link>
            <Link
              href="/auth/signup"
              className="w-full rounded-full border border-emerald-500/50 px-8 py-3.5 text-base font-semibold text-emerald-400 hover:bg-emerald-500/10 sm:w-auto"
            >
              Vendre mon site
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="annonces" className="border-t border-white/5 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Catégories</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/annonces?cat=${cat.slug}`}
                className="group rounded-2xl border border-white/5 bg-[#111] p-6 text-center transition-all hover:border-emerald-500/30 hover:bg-[#151515]"
              >
                <div className="mb-3 text-4xl">{cat.icon}</div>
                <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                <p className="mt-1 text-xs text-neutral-500">{cat.count} annonces</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Pourquoi <span className="text-emerald-400">VenteSiteInternet</span> ?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-neutral-400">
            La première marketplace suisse dédiée à l&apos;achat-vente de sites web.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/5 bg-[#111] p-6 transition-all hover:border-white/10">
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-neutral-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/5 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Tarifs <span className="text-emerald-400">vendeurs</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-neutral-400">
            Gratuit pour les acheteurs. Un seul abonnement tout inclus pour les vendeurs.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 transition-all ${
                  "popular" in plan && plan.popular
                    ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent"
                    : "border-white/5 bg-[#111]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    {plan.badge}
                  </span>
                )}
                <div className="mb-1 text-sm font-medium text-neutral-400">{plan.name}</div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatCHF(plan.price)}</span>
                  <span className="text-sm text-neutral-500">CHF{plan.period}</span>
                </div>
                <p className="mb-4 text-xs text-neutral-500">soit {formatCHF(plan.perMonth)} CHF/mois</p>
                <ul className="mb-6 space-y-2 text-sm text-neutral-400">
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Annonces illimitées</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Contact direct acheteurs</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Statistiques de vues</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Badge vendeur vérifié</li>
                </ul>
                <Link
                  href="/auth/signup"
                  className={`block w-full rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                    "popular" in plan && plan.popular
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "border border-white/10 text-white hover:bg-white/5"
                  }`}
                >
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Comment ça marche ?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Créez votre annonce", desc: "Décrivez votre site, ajoutez les stats et fixez votre prix." },
              { step: "2", title: "Recevez des contacts", desc: "Les acheteurs vous contactent directement par email ou WhatsApp." },
              { step: "3", title: "Concluez la vente", desc: "Négociez et finalisez la transaction entre vous, sans commission." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-bold text-emerald-400">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-neutral-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-white/5 bg-[#111]">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4">
                  <span className="pr-4 font-medium">{faq.q}</span>
                  <svg className="h-5 w-5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-sm text-neutral-400">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-blue-600 px-8 py-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
              Prêt à vendre
              <br />
              votre site web ?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-emerald-100">
              Rejoignez la première marketplace suisse et trouvez un acheteur pour votre projet digital.
            </p>
            <Link href="/auth/signup" className="inline-block rounded-full bg-white px-10 py-4 text-base font-semibold text-emerald-600 hover:bg-neutral-100">
              Créer mon compte vendeur
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <span className="text-lg font-bold">Vente<span className="text-emerald-400">SiteInternet</span>.ch</span>
            <div className="flex items-center gap-6">
              <a href="https://wa.me/41794517496" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-white">WhatsApp</a>
              <a href="mailto:contact@ventesiteinternet.ch" className="text-sm text-neutral-500 hover:text-white">Contact</a>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} VenteSiteInternet.ch — Le Bouveret, Valais, Suisse.
          </p>
        </div>
      </footer>
    </div>
  );
}
