"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  views: number;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  vitrine: "🖥️ Site vitrine",
  ecommerce: "🛒 E-commerce",
  saas: "⚡ SaaS",
  domaines: "🌐 Nom de domaine",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Brouillon", color: "bg-zinc-700 text-zinc-300" },
  published: { label: "Publié", color: "bg-emerald-500/20 text-emerald-400" },
  sold: { label: "Vendu", color: "bg-blue-500/20 text-blue-400" },
  archived: { label: "Archivé", color: "bg-neutral-500/20 text-neutral-400" },
};

function formatCHF(n: number) {
  return n?.toLocaleString("fr-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || "—";
}

const inputClass = "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create">("list");
  const [step, setStep] = useState(1);

  // Form fields
  const [f, setF] = useState({
    title: "", description: "", url: "", category: "vitrine",
    price: "", monthlyRevenue: "", yearlyRevenue: "", monthlyTraffic: "",
    ageYears: "", techStack: "", marginPercent: "", hasStock: false,
    stockValue: "", competitors: "", businessModel: "", reasonForSale: "",
    growthPotential: "", includedInSale: "", monthlyCosts: "",
    emailSubscribers: "", socialFollowers: "", domainAuthority: "",
    contactEmail: "", contactWhatsapp: "",
    sector: "", hosting: "", nbClients: "", nbSuppliers: "",
    yearlyRevenueN1: "", yearlyRevenueN2: "", monthlyProfit: "",
    trafficSources: "", mainKeywords: "", creationDate: "",
  });

  function updateF(key: string, value: string | boolean) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }
    setUser(user);
    setF((prev) => ({ ...prev, contactEmail: user.email || "" }));

    const { data } = await supabase
      .from("vsi_listings")
      .select("id, title, category, price, status, views, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setListings(data || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { loadData(); }, [loadData]);

  async function createListing() {
    if (!user || !f.title.trim()) return;
    await supabase.from("vsi_listings").insert({
      user_id: user.id,
      title: f.title.trim(),
      description: f.description.trim(),
      url: f.url.trim(),
      category: f.category,
      price: parseFloat(f.price) || 0,
      monthly_revenue: parseFloat(f.monthlyRevenue) || 0,
      yearly_revenue: parseFloat(f.yearlyRevenue) || 0,
      monthly_traffic: parseInt(f.monthlyTraffic) || 0,
      age_years: parseInt(f.ageYears) || 0,
      tech_stack: f.techStack.trim(),
      margin_percent: parseFloat(f.marginPercent) || 0,
      has_stock: f.hasStock,
      stock_value: parseFloat(f.stockValue) || 0,
      competitors: f.competitors.trim(),
      business_model: f.businessModel.trim(),
      reason_for_sale: f.reasonForSale.trim(),
      growth_potential: f.growthPotential.trim(),
      included_in_sale: f.includedInSale.trim(),
      monthly_costs: parseFloat(f.monthlyCosts) || 0,
      email_subscribers: parseInt(f.emailSubscribers) || 0,
      social_followers: parseInt(f.socialFollowers) || 0,
      domain_authority: parseInt(f.domainAuthority) || 0,
      sector: f.sector.trim(),
      hosting: f.hosting.trim(),
      nb_clients: parseInt(f.nbClients) || 0,
      nb_suppliers: parseInt(f.nbSuppliers) || 0,
      yearly_revenue_n1: parseFloat(f.yearlyRevenueN1) || 0,
      yearly_revenue_n2: parseFloat(f.yearlyRevenueN2) || 0,
      monthly_profit: parseFloat(f.monthlyProfit) || 0,
      traffic_sources: f.trafficSources.trim(),
      main_keywords: f.mainKeywords.trim(),
      creation_date: f.creationDate.trim(),
      contact_email: f.contactEmail.trim(),
      contact_whatsapp: f.contactWhatsapp.trim(),
      status: "published",
    });
    setF({
      title: "", description: "", url: "", category: "vitrine",
      price: "", monthlyRevenue: "", yearlyRevenue: "", monthlyTraffic: "",
      ageYears: "", techStack: "", marginPercent: "", hasStock: false,
      stockValue: "", competitors: "", businessModel: "", reasonForSale: "",
      growthPotential: "", includedInSale: "", monthlyCosts: "",
      emailSubscribers: "", socialFollowers: "", domainAuthority: "",
      contactEmail: user?.email || "", contactWhatsapp: "",
      sector: "", hosting: "", nbClients: "", nbSuppliers: "",
      yearlyRevenueN1: "", yearlyRevenueN2: "", monthlyProfit: "",
      trafficSources: "", mainKeywords: "", creationDate: "",
    });
    setStep(1);
    setView("list");
    loadData();
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("vsi_listings").update({ status }).eq("id", id);
    loadData();
  }

  async function deleteListing(id: string) {
    await supabase.from("vsi_listings").delete().eq("id", id);
    loadData();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="text-lg font-bold">Vente<span className="text-emerald-400">SiteInternet</span>.ch</Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-neutral-500">{user?.email}</span>
            <button onClick={logout} className="text-sm text-neutral-400 hover:text-white">Déconnexion</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Mon espace vendeur</h1>
          <button
            onClick={() => { setView(view === "list" ? "create" : "list"); setStep(1); }}
            className="rounded-full bg-emerald-500 px-4 sm:px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {view === "list" ? "+ Nouvelle annonce" : "← Mes annonces"}
          </button>
        </div>

        {/* ═══ CREATE FORM (Multi-step) ═══ */}
        {view === "create" && (
          <div className="space-y-4">
            {/* Progress */}
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? "bg-emerald-500" : "bg-white/10"}`} />
              ))}
            </div>
            <p className="text-xs text-neutral-500">Étape {step}/4</p>

            {/* Step 1: Infos de base */}
            {step === 1 && (
              <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-4">
                <h2 className="text-sm font-semibold text-emerald-400">1. Informations générales</h2>
                <input type="text" value={f.title} onChange={(e) => updateF("title", e.target.value)} placeholder="Titre de l'annonce *" className={inputClass} />
                <textarea value={f.description} onChange={(e) => updateF("description", e.target.value)} placeholder="Décrivez votre site en détail : ce qu'il fait, son historique, ses points forts..." rows={5} className={inputClass + " resize-none"} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="url" value={f.url} onChange={(e) => updateF("url", e.target.value)} placeholder="URL du site *" className={inputClass} />
                  <select value={f.category} onChange={(e) => updateF("category", e.target.value)} className={inputClass}>
                    <option value="vitrine">🖥️ Site vitrine</option>
                    <option value="ecommerce">🛒 E-commerce</option>
                    <option value="saas">⚡ SaaS</option>
                    <option value="domaines">🌐 Nom de domaine</option>
                  </select>
                  <input type="text" value={f.sector} onChange={(e) => updateF("sector", e.target.value)} placeholder="Secteur d'activité (ex: Mode, Food, Tech...)" className={inputClass} />
                  <input type="text" value={f.creationDate} onChange={(e) => updateF("creationDate", e.target.value)} placeholder="Date de création (ex: 03/2022)" className={inputClass} />
                  <input type="text" value={f.techStack} onChange={(e) => updateF("techStack", e.target.value)} placeholder="Technologies (WordPress, Shopify, Next.js...)" className={inputClass} />
                  <input type="text" value={f.hosting} onChange={(e) => updateF("hosting", e.target.value)} placeholder="Hébergeur (Infomaniak, OVH, Vercel...)" className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 2: Chiffres */}
            {step === 2 && (
              <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-4">
                <h2 className="text-sm font-semibold text-emerald-400">2. Chiffres clés & Financiers</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Prix de vente (CHF)</label>
                    <input type="number" value={f.price} onChange={(e) => updateF("price", e.target.value)} placeholder="Ex: 15000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">CA mensuel (CHF)</label>
                    <input type="number" value={f.monthlyRevenue} onChange={(e) => updateF("monthlyRevenue", e.target.value)} placeholder="Ex: 2000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">CA HT 12 derniers mois (CHF)</label>
                    <input type="number" value={f.yearlyRevenue} onChange={(e) => updateF("yearlyRevenue", e.target.value)} placeholder="Ex: 24000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">CA HT année N-1 (CHF)</label>
                    <input type="number" value={f.yearlyRevenueN1} onChange={(e) => updateF("yearlyRevenueN1", e.target.value)} placeholder="Ex: 20000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">CA HT année N-2 (CHF)</label>
                    <input type="number" value={f.yearlyRevenueN2} onChange={(e) => updateF("yearlyRevenueN2", e.target.value)} placeholder="Ex: 15000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Charges mensuelles (CHF)</label>
                    <input type="number" value={f.monthlyCosts} onChange={(e) => updateF("monthlyCosts", e.target.value)} placeholder="Ex: 500" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Bénéfice net mensuel (CHF)</label>
                    <input type="number" value={f.monthlyProfit} onChange={(e) => updateF("monthlyProfit", e.target.value)} placeholder="Ex: 1500" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Marge (%)</label>
                    <input type="number" value={f.marginPercent} onChange={(e) => updateF("marginPercent", e.target.value)} placeholder="Ex: 40" className={inputClass} />
                  </div>
                </div>
                <h3 className="text-xs font-semibold text-neutral-500 pt-2">Trafic & Audience</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Visiteurs/mois</label>
                    <input type="number" value={f.monthlyTraffic} onChange={(e) => updateF("monthlyTraffic", e.target.value)} placeholder="Ex: 5000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Nombre de clients</label>
                    <input type="number" value={f.nbClients} onChange={(e) => updateF("nbClients", e.target.value)} placeholder="Ex: 200" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Abonnés email</label>
                    <input type="number" value={f.emailSubscribers} onChange={(e) => updateF("emailSubscribers", e.target.value)} placeholder="Ex: 500" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Followers réseaux sociaux</label>
                    <input type="number" value={f.socialFollowers} onChange={(e) => updateF("socialFollowers", e.target.value)} placeholder="Ex: 2000" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Sources de trafic</label>
                  <input type="text" value={f.trafficSources} onChange={(e) => updateF("trafficSources", e.target.value)} placeholder="Ex: SEO 60%, Pub 20%, Direct 15%, Réseaux 5%" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Mots-clés principaux</label>
                  <input type="text" value={f.mainKeywords} onChange={(e) => updateF("mainKeywords", e.target.value)} placeholder="Ex: chaussettes fun, chaussettes originales suisse" className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 3: Business model */}
            {step === 3 && (
              <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-4">
                <h2 className="text-sm font-semibold text-emerald-400">3. Business model</h2>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Modèle économique</label>
                  <textarea value={f.businessModel} onChange={(e) => updateF("businessModel", e.target.value)} placeholder="Comment le site génère-t-il des revenus ? (abonnements, vente de produits, publicité, affiliation...)" rows={3} className={inputClass + " resize-none"} />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateF("hasStock", !f.hasStock)}
                    className={`flex h-6 w-11 items-center rounded-full transition-colors ${f.hasStock ? "bg-emerald-500" : "bg-white/10"}`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${f.hasStock ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-sm text-neutral-400">Vente avec stock</span>
                </div>
                {f.hasStock && (
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Valeur du stock (CHF)</label>
                    <input type="number" value={f.stockValue} onChange={(e) => updateF("stockValue", e.target.value)} placeholder="Ex: 5000" className={inputClass} />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Nombre de fournisseurs</label>
                  <input type="number" value={f.nbSuppliers} onChange={(e) => updateF("nbSuppliers", e.target.value)} placeholder="Ex: 3" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Concurrents principaux</label>
                  <textarea value={f.competitors} onChange={(e) => updateF("competitors", e.target.value)} placeholder="Listez les concurrents directs et votre avantage par rapport à eux" rows={3} className={inputClass + " resize-none"} />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Raison de la vente</label>
                  <textarea value={f.reasonForSale} onChange={(e) => updateF("reasonForSale", e.target.value)} placeholder="Pourquoi vendez-vous ce site ?" rows={2} className={inputClass + " resize-none"} />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Potentiel de croissance</label>
                  <textarea value={f.growthPotential} onChange={(e) => updateF("growthPotential", e.target.value)} placeholder="Quelles opportunités de développement voyez-vous ?" rows={2} className={inputClass + " resize-none"} />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Ce qui est inclus dans la vente</label>
                  <textarea value={f.includedInSale} onChange={(e) => updateF("includedInSale", e.target.value)} placeholder="Domaine, code source, base clients, comptes réseaux sociaux, stock..." rows={2} className={inputClass + " resize-none"} />
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {step === 4 && (
              <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-4">
                <h2 className="text-sm font-semibold text-emerald-400">4. Vos coordonnées</h2>
                <p className="text-xs text-neutral-500">Ces informations seront visibles par les acheteurs potentiels.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">Email de contact</label>
                    <input type="email" value={f.contactEmail} onChange={(e) => updateF("contactEmail", e.target.value)} placeholder="votre@email.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1">WhatsApp</label>
                    <input type="tel" value={f.contactWhatsapp} onChange={(e) => updateF("contactWhatsapp", e.target.value)} placeholder="+41 79 000 00 00" className={inputClass} />
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 rounded-lg bg-white/5 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-neutral-400">Résumé de votre annonce</h3>
                  <p className="text-sm font-bold">{f.title || "—"}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-neutral-500">Catégorie :</span> {CATEGORY_LABELS[f.category]}</div>
                    {f.price && <div><span className="text-neutral-500">Prix :</span> <span className="text-emerald-400 font-bold">{formatCHF(parseFloat(f.price))} CHF</span></div>}
                    {f.monthlyRevenue && <div><span className="text-neutral-500">CA/mois :</span> {formatCHF(parseFloat(f.monthlyRevenue))} CHF</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="flex-1 rounded-lg border border-white/10 py-3 text-sm font-medium text-neutral-400 hover:bg-white/5">
                  ← Précédent
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !f.title.trim()}
                  className="flex-1 rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  onClick={createListing}
                  disabled={!f.title.trim()}
                  className="flex-1 rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  Publier l&apos;annonce
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ LISTINGS ═══ */}
        {view === "list" && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-[#111] p-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-lg font-semibold">Aucune annonce</p>
                <p className="mt-2 text-sm text-neutral-500">Créez votre première annonce pour commencer à vendre.</p>
                <button onClick={() => setView("create")} className="mt-4 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
                  Créer une annonce
                </button>
              </div>
            ) : (
              listings.map((listing) => {
                const st = STATUS_LABELS[listing.status] || STATUS_LABELS.draft;
                return (
                  <div key={listing.id} className="rounded-xl border border-white/5 bg-[#111] p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-sm font-bold">{listing.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.color}`}>{st.label}</span>
                        <span className="text-[10px] text-neutral-500">{CATEGORY_LABELS[listing.category]}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{listing.price > 0 ? `${formatCHF(listing.price)} CHF` : "Sur demande"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">{listing.views} vues</span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {listing.status === "draft" && (
                          <button onClick={() => updateStatus(listing.id, "published")} className="rounded-lg bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/30">Publier</button>
                        )}
                        {listing.status === "published" && (
                          <>
                            <button onClick={() => updateStatus(listing.id, "sold")} className="rounded-lg bg-blue-500/20 px-2 py-1 text-[10px] font-medium text-blue-400 hover:bg-blue-500/30">Vendu</button>
                            <button onClick={() => updateStatus(listing.id, "archived")} className="rounded-lg bg-neutral-500/20 px-2 py-1 text-[10px] font-medium text-neutral-400 hover:bg-neutral-500/30">Archiver</button>
                          </>
                        )}
                        <button onClick={() => deleteListing(listing.id)} className="rounded-lg bg-red-500/20 px-2 py-1 text-[10px] font-medium text-red-400 hover:bg-red-500/30">Supprimer</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
