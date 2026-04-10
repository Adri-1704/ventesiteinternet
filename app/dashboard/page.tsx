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

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create">("list");

  // Create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("vitrine");
  const [price, setPrice] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyTraffic, setMonthlyTraffic] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [techStack, setTechStack] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }
    setUser(user);
    setContactEmail(user.email || "");

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
    if (!user || !title.trim()) return;
    await supabase.from("vsi_listings").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      category,
      price: parseFloat(price) || 0,
      monthly_revenue: parseFloat(monthlyRevenue) || 0,
      monthly_traffic: parseInt(monthlyTraffic) || 0,
      age_years: parseInt(ageYears) || 0,
      tech_stack: techStack.trim(),
      contact_email: contactEmail.trim(),
      contact_whatsapp: contactWhatsapp.trim(),
      status: "published",
    });
    setTitle(""); setDescription(""); setUrl(""); setPrice("");
    setMonthlyRevenue(""); setMonthlyTraffic(""); setAgeYears("");
    setTechStack(""); setContactWhatsapp("");
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold">Vente<span className="text-emerald-400">SiteInternet</span>.ch</Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500">{user?.email}</span>
            <button onClick={logout} className="text-sm text-neutral-400 hover:text-white">Déconnexion</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mon espace vendeur</h1>
          <button
            onClick={() => setView(view === "list" ? "create" : "list")}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {view === "list" ? "+ Nouvelle annonce" : "← Mes annonces"}
          </button>
        </div>

        {/* Create form */}
        {view === "create" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-4">
              <h2 className="text-sm font-semibold text-neutral-400">Informations de l&apos;annonce</h2>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'annonce *" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description détaillée..." rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL du site" className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none">
                  <option value="vitrine">🖥️ Site vitrine</option>
                  <option value="ecommerce">🛒 E-commerce</option>
                  <option value="saas">⚡ SaaS</option>
                  <option value="domaines">🌐 Nom de domaine</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-4">
              <h2 className="text-sm font-semibold text-neutral-400">Chiffres clés</h2>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Prix de vente (CHF)" className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
                <input type="number" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(e.target.value)} placeholder="Revenu mensuel (CHF)" className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
                <input type="number" value={monthlyTraffic} onChange={(e) => setMonthlyTraffic(e.target.value)} placeholder="Trafic mensuel (visites)" className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
                <input type="number" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} placeholder="Ancienneté (années)" className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
              </div>
              <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Stack technique (ex: Next.js, Shopify, WordPress...)" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
            </div>

            <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-4">
              <h2 className="text-sm font-semibold text-neutral-400">Contact</h2>
              <div className="grid grid-cols-2 gap-3">
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Email de contact" className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
                <input type="tel" value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder="WhatsApp (ex: +41 79...)" className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
              </div>
            </div>

            <button
              onClick={createListing}
              disabled={!title.trim()}
              className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              Publier l&apos;annonce
            </button>
          </div>
        )}

        {/* Listings */}
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
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold">{listing.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.color}`}>{st.label}</span>
                        <span className="text-[10px] text-neutral-500">{CATEGORY_LABELS[listing.category]}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{listing.price > 0 ? `${formatCHF(listing.price)} CHF` : "Prix sur demande"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">{listing.views} vues</span>
                      <div className="flex gap-1">
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
