"use client";
import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Email ou mot de passe incorrect"); setLoading(false); }
    else router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Vente<span className="text-emerald-600">SiteInternet</span>.ch</h1>
          <p className="mt-2 text-sm text-gray-500">Connectez-vous à votre espace vendeur</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mot de passe" className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-neutral-500 outline-none focus:border-emerald-500/50" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-gray-900 hover:bg-emerald-600 disabled:opacity-50">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link href="/auth/reset" className="text-gray-500 hover:text-emerald-600">Mot de passe oublié ?</Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          Pas encore de compte ? <Link href="/auth/signup" className="font-semibold text-emerald-600">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
