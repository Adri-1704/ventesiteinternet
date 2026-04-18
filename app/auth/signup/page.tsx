"use client";
import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("6 caractères minimum"); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    if (error) { setError(error.message); setLoading(false); return; }
    // Auto-login
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!loginErr) router.push("/dashboard");
    else router.push("/auth/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Vente<span className="text-emerald-600">SiteInternet</span>.ch</h1>
          <p className="mt-2 text-sm text-gray-500">Créez votre compte vendeur</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mot de passe (6 car. min)" className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Confirmer le mot de passe" className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-gray-900 hover:bg-emerald-600 disabled:opacity-50">
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ? <Link href="/auth/login" className="font-semibold text-emerald-600">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
