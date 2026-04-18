"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-bold text-gray-900">
          Vente<span className="text-emerald-600">SiteInternet</span>.ch
        </Link>
        {sent ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
            <p className="text-2xl mb-2">✉️</p>
            <p className="font-semibold text-gray-900">Email envoyé !</p>
            <p className="mt-2 text-sm text-gray-600">Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.</p>
            <Link href="/auth/login" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">Retour à la connexion</Link>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-2xl font-bold text-center text-gray-900">Mot de passe oublié</h1>
            <p className="mb-6 text-sm text-gray-500 text-center">Entrez votre email, nous vous enverrons un lien de réinitialisation.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-500"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                {loading ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              <Link href="/auth/login" className="text-emerald-600 hover:underline">Retour à la connexion</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
