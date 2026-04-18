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
  images: string[];
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
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold">
            Vente<span className="text-emerald-400">SiteInternet</span>.ch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">Connexion</Link>
            <Link href="/auth/signup" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-600">Vendre</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <h1 className="mb-6 text-3xl font-bold">Annonces</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-neutral-500 outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  category === cat.slug ? "bg-emerald-500 text-gray-900" : "border border-gray-300 text-gray-600 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-900 outline-none"
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
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg font-semibold">Aucune annonce pour le moment</p>
            <p className="mt-2 text-sm text-gray-500">Soyez le premier à publier votre site !</p>
            <Link href="/auth/signup" className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-emerald-600">
              Vendre mon site
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/annonces/${listing.id}`}
                className="group rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden transition-all hover:border-emerald-300"
              >
                {listing.images && listing.images.length > 0 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover" loading="lazy" />
                )}
                <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-600">
                    {CATEGORIES.find((c) => c.slug === listing.category)?.label || listing.category}
                  </span>
                  <span className="text-[10px] text-gray-500">{timeAgo(listing.created_at)}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold group-hover:text-emerald-400">{listing.title}</h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {listing.price > 0 && (
                    <div className="rounded-lg bg-gray-100 p-2">
                      <span className="text-gray-500">Prix</span>
                      <p className="font-bold text-emerald-400">{formatCHF(listing.price)} CHF</p>
                    </div>
                  )}
                  {listing.monthly_revenue > 0 && (
                    <div className="rounded-lg bg-gray-100 p-2">
                      <span className="text-gray-500">Revenu/mois</span>
                      <p className="font-bold">{formatCHF(listing.monthly_revenue)} CHF</p>
                    </div>
                  )}
                  {listing.monthly_traffic > 0 && (
                    <div className="rounded-lg bg-gray-100 p-2">
                      <span className="text-gray-500">Trafic/mois</span>
                      <p className="font-bold">{formatCHF(listing.monthly_traffic)} visites</p>
                    </div>
                  )}
                  {listing.age_years > 0 && (
                    <div className="rounded-lg bg-gray-100 p-2">
                      <span className="text-gray-500">Ancienneté</span>
                      <p className="font-bold">{listing.age_years} an{listing.age_years > 1 ? "s" : ""}</p>
                    </div>
                  )}
                </div>
                {listing.contact_whatsapp && (
                  <div className="mt-4 pt-3 border-t border-gray-200" onClick={(e) => e.preventDefault()}>
                    <a
                      href={`https://wa.me/${listing.contact_whatsapp.replace(/[^0-9+]/g, "")}?text=Bonjour, je suis intéressé par : ${encodeURIComponent(listing.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition-all"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Discuter sur WhatsApp
                    </a>
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
