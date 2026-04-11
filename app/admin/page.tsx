"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  views: number;
  created_at: string;
  contact_email: string;
  user_id: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Brouillon", color: "bg-zinc-700 text-zinc-300" },
  published: { label: "Publié", color: "bg-emerald-500/20 text-emerald-400" },
  sold: { label: "Vendu", color: "bg-blue-500/20 text-blue-400" },
  archived: { label: "Archivé", color: "bg-neutral-500/20 text-neutral-400" },
};

const CATEGORY_LABELS: Record<string, string> = {
  vitrine: "🖥️ Vitrine",
  ecommerce: "🛒 E-commerce",
  saas: "⚡ SaaS",
  domaines: "🌐 Domaine",
};

function formatCHF(n: number) {
  return n?.toLocaleString("fr-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || "—";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("vsi-admin-auth") === "1";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [view, setView] = useState<"users" | "listings">("listings");

  // Auto-load if session exists
  useEffect(() => {
    if (authenticated && users.length === 0) {
      const pwd = sessionStorage.getItem("vsi-admin-pwd") || "";
      fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd, action: "load" }),
      }).then(r => r.json()).then(data => {
        if (data.users) setUsers(data.users);
        if (data.listings) setListings(data.listings);
      }).catch(() => { setAuthenticated(false); sessionStorage.removeItem("vsi-admin-auth"); });
    }
  }, [authenticated]);

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "load" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur"); setLoading(false); return; }
      setUsers(data.users || []);
      setListings(data.listings || []);
      setAuthenticated(true);
      sessionStorage.setItem("vsi-admin-auth", "1");
      sessionStorage.setItem("vsi-admin-pwd", password);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  async function updateListingStatus(id: string, status: string) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "updateStatus", listingId: id, status }),
    });
    // Refresh
    login();
  }

  async function deleteListing(id: string) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "delete", listingId: id }),
    });
    login();
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-2xl font-bold text-center">Admin</h1>
          <p className="mb-6 text-sm text-neutral-500 text-center">VenteSiteInternet.ch</p>
          <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-neutral-500 outline-none focus:border-emerald-500/50"
              autoFocus
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
              {loading ? "Chargement..." : "Connexion"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="text-lg font-bold">Vente<span className="text-emerald-400">SiteInternet</span>.ch</Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-400 font-semibold">ADMIN</span>
            <button onClick={() => { setAuthenticated(false); sessionStorage.removeItem("vsi-admin-auth"); sessionStorage.removeItem("vsi-admin-pwd"); }} className="text-sm text-neutral-400 hover:text-white">Déconnexion</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
          <div className="rounded-xl border border-white/5 bg-[#111] p-4">
            <p className="text-[10px] text-neutral-500 mb-1">Utilisateurs</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#111] p-4">
            <p className="text-[10px] text-neutral-500 mb-1">Annonces totales</p>
            <p className="text-2xl font-bold">{listings.length}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#111] p-4">
            <p className="text-[10px] text-neutral-500 mb-1">Publiées</p>
            <p className="text-2xl font-bold text-emerald-400">{listings.filter((l) => l.status === "published").length}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#111] p-4">
            <p className="text-[10px] text-neutral-500 mb-1">Vendues</p>
            <p className="text-2xl font-bold text-blue-400">{listings.filter((l) => l.status === "sold").length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-[#111] p-1 mb-6 border border-white/5">
          <button onClick={() => setView("listings")} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${view === "listings" ? "bg-emerald-500 text-white" : "text-neutral-500"}`}>
            Annonces ({listings.length})
          </button>
          <button onClick={() => setView("users")} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${view === "users" ? "bg-emerald-500 text-white" : "text-neutral-500"}`}>
            Utilisateurs ({users.length})
          </button>
        </div>

        {/* Listings */}
        {view === "listings" && (
          <div className="space-y-2">
            {listings.map((l) => {
              const st = STATUS_LABELS[l.status] || STATUS_LABELS.draft;
              return (
                <div key={l.id} className="rounded-xl border border-white/5 bg-[#111] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold">{l.title}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.color}`}>{st.label}</span>
                      <span className="text-[10px] text-neutral-500">{CATEGORY_LABELS[l.category]}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{l.price > 0 ? `${formatCHF(l.price)} CHF` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">
                      {l.contact_email} · {l.views} vues · {timeAgo(l.created_at)}
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {l.status === "draft" && (
                        <button onClick={() => updateListingStatus(l.id, "published")} className="rounded-lg bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-400">Publier</button>
                      )}
                      {l.status === "published" && (
                        <button onClick={() => updateListingStatus(l.id, "archived")} className="rounded-lg bg-neutral-500/20 px-2 py-1 text-[10px] font-medium text-neutral-400">Archiver</button>
                      )}
                      <button onClick={() => deleteListing(l.id)} className="rounded-lg bg-red-500/20 px-2 py-1 text-[10px] font-medium text-red-400">Supprimer</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Users */}
        {view === "users" && (
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="rounded-xl border border-white/5 bg-[#111] p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{u.email}</p>
                  <p className="text-[10px] text-neutral-500">Inscrit {timeAgo(u.created_at)}</p>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono">{u.id.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
