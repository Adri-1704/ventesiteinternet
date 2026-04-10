"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/app/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  price: number;
  monthly_revenue: number;
  monthly_traffic: number;
  age_years: number;
  tech_stack: string;
  contact_email: string;
  contact_whatsapp: string;
  views: number;
  created_at: string;
}

const CATEGORIES = [
  { slug: "", label: "Toutes" },
  { slug: "vitrine", label: "🖥️ Sites vitrine" },
  { slug: "ecommerce", label: "🛒 E-commerce" },
  { slug: "saas", label: "⚡ SaaS" },
  { slug: "domaines", label: "🌐 Domaines" },
];

function formatCHF(n: number) {
  return n?.toLocaleString("fr-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || "—";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days} jours`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

export default function Annonces() {
  return <Suspense><AnnoncesContent /></Suspense>;
}

function AnnoncesContent() {
  const supabase = createClient();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("cat") || "");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    async function load() {
      let query = supabase.from("vsi_listings").select("*").eq("status", "published");
      if (category) query = query.eq("category", category);
      if (sort === "recent") query = query.order("created_at", { ascending: false });
      else if (sort === "price_asc") query = query.order("price", { ascending: true });
      else if (sort === "price_desc") query = query.order("price", { ascending: false });

      const { data } = await query;
      let results = data || [];
      if (search) {
        const q = search.toLowerCase();
        results = results.filter((l) => l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q));
      }
      setListings(results);
      setLoading(false);
    }
    load();
  }, [category, sort, search, supabase]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold">
            Vente<span className="text-emerald-400">SiteInternet</span>.ch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-neutral-400 hover:text-white">Connexion</Link>
            <Link href="/auth/signup" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Vendre</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <h1 className="mb-6 text-3xl font-bold">Annonces</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  category === cat.slug ? "bg-emerald-500 text-white" : "border border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
          >
            <option value="recent">Plus récentes</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#111] p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg font-semibold">Aucune annonce pour le moment</p>
            <p className="mt-2 text-sm text-neutral-500">Soyez le premier à publier votre site !</p>
            <Link href="/auth/signup" className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
              Vendre mon site
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/annonces/${listing.id}`}
                className="group rounded-2xl border border-white/5 bg-[#111] p-6 transition-all hover:border-emerald-500/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium text-neutral-400">
                    {CATEGORIES.find((c) => c.slug === listing.category)?.label || listing.category}
                  </span>
                  <span className="text-[10px] text-neutral-500">{timeAgo(listing.created_at)}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold group-hover:text-emerald-400">{listing.title}</h3>
                <p className="mb-4 text-sm text-neutral-400 line-clamp-2">{listing.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {listing.price > 0 && (
                    <div className="rounded-lg bg-white/5 p-2">
                      <span className="text-neutral-500">Prix</span>
                      <p className="font-bold text-emerald-400">{formatCHF(listing.price)} CHF</p>
                    </div>
                  )}
                  {listing.monthly_revenue > 0 && (
                    <div className="rounded-lg bg-white/5 p-2">
                      <span className="text-neutral-500">Revenu/mois</span>
                      <p className="font-bold">{formatCHF(listing.monthly_revenue)} CHF</p>
                    </div>
                  )}
                  {listing.monthly_traffic > 0 && (
                    <div className="rounded-lg bg-white/5 p-2">
                      <span className="text-neutral-500">Trafic/mois</span>
                      <p className="font-bold">{formatCHF(listing.monthly_traffic)} visites</p>
                    </div>
                  )}
                  {listing.age_years > 0 && (
                    <div className="rounded-lg bg-white/5 p-2">
                      <span className="text-neutral-500">Ancienneté</span>
                      <p className="font-bold">{listing.age_years} an{listing.age_years > 1 ? "s" : ""}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
