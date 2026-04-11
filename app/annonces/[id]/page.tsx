import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORY_LABELS: Record<string, string> = {
  vitrine: "🖥️ Site vitrine",
  ecommerce: "🛒 E-commerce",
  saas: "⚡ SaaS",
  domaines: "🌐 Nom de domaine",
};

function formatCHF(n: number) {
  return n?.toLocaleString("fr-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || "—";
}

function Stat({ label, value, suffix }: { label: string; value: string | number | null | undefined; suffix?: string }) {
  if (!value || value === 0 || value === "0") return null;
  return (
    <div className="rounded-xl border border-white/5 bg-[#111] p-4">
      <p className="text-[10px] text-neutral-500 mb-1">{label}</p>
      <p className="text-sm font-bold">{typeof value === "number" ? formatCHF(value) : value}{suffix ? ` ${suffix}` : ""}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-emerald-400">{title}</h2>
      {children}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-white/5 bg-[#111] p-4">
      <p className="text-[10px] text-neutral-500 mb-1">{label}</p>
      <p className="text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: listing } = await supabase
    .from("vsi_listings")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!listing) notFound();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="text-lg font-bold">Vente<span className="text-emerald-400">SiteInternet</span>.ch</Link>
          <Link href="/annonces" className="text-sm text-neutral-400 hover:text-white">← Toutes les annonces</Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8">
        {/* Badge + views */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-neutral-400">
            {CATEGORY_LABELS[listing.category] || listing.category}
          </span>
          {listing.sector && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-500">{listing.sector}</span>}
          {listing.creation_date && <span className="text-xs text-neutral-500">Créé en {listing.creation_date}</span>}
          {listing.views > 0 && <span className="text-xs text-neutral-500">{listing.views} vues</span>}
        </div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{listing.title}</h1>

        {/* Price */}
        {listing.price > 0 && (
          <p className="mb-8 text-3xl font-bold text-emerald-400">{formatCHF(listing.price)} CHF</p>
        )}

        {/* Photos */}
        {listing.images && listing.images.length > 0 && (
          <Section title="Photos">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {listing.images.map((url: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`${listing.title} - Photo ${i + 1}`} className="w-full h-48 object-cover rounded-xl border border-white/5" />
              ))}
            </div>
          </Section>
        )}

        {/* Chiffres clés */}
        <Section title="Chiffres clés">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="CA mensuel" value={listing.monthly_revenue} suffix="CHF" />
            <Stat label="CA annuel (12 mois)" value={listing.yearly_revenue} suffix="CHF" />
            <Stat label="CA N-1" value={listing.yearly_revenue_n1} suffix="CHF" />
            <Stat label="CA N-2" value={listing.yearly_revenue_n2} suffix="CHF" />
            <Stat label="Charges mensuelles" value={listing.monthly_costs} suffix="CHF" />
            <Stat label="Bénéfice net/mois" value={listing.monthly_profit} suffix="CHF" />
            <Stat label="Marge" value={listing.margin_percent ? `${listing.margin_percent}%` : null} />
            <Stat label="Ancienneté" value={listing.age_years ? `${listing.age_years} an${listing.age_years > 1 ? "s" : ""}` : null} />
          </div>
        </Section>

        {/* Trafic & Audience */}
        <Section title="Trafic & Audience">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Visiteurs/mois" value={listing.monthly_traffic} suffix="visites" />
            <Stat label="Clients" value={listing.nb_clients} />
            <Stat label="Abonnés email" value={listing.email_subscribers} />
            <Stat label="Followers" value={listing.social_followers} />
            <Stat label="Domain Authority" value={listing.domain_authority} />
            <Stat label="Fournisseurs" value={listing.nb_suppliers} />
          </div>
          {listing.traffic_sources && (
            <div className="mt-3 rounded-xl border border-white/5 bg-[#111] p-4">
              <p className="text-[10px] text-neutral-500 mb-1">Sources de trafic</p>
              <p className="text-sm text-neutral-300">{listing.traffic_sources}</p>
            </div>
          )}
          {listing.main_keywords && (
            <div className="mt-3 rounded-xl border border-white/5 bg-[#111] p-4">
              <p className="text-[10px] text-neutral-500 mb-1">Mots-clés principaux</p>
              <p className="text-sm text-neutral-300">{listing.main_keywords}</p>
            </div>
          )}
        </Section>

        {/* Description */}
        {listing.description && (
          <Section title="Description">
            <div className="rounded-xl border border-white/5 bg-[#111] p-6">
              <p className="text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap">{listing.description}</p>
            </div>
          </Section>
        )}

        {/* Business model */}
        {(listing.business_model || listing.competitors || listing.reason_for_sale || listing.growth_potential || listing.included_in_sale) && (
          <Section title="Business model">
            <div className="space-y-3">
              <InfoBlock label="Modèle économique" value={listing.business_model} />
              {listing.has_stock && (
                <div className="rounded-xl border border-white/5 bg-[#111] p-4">
                  <p className="text-[10px] text-neutral-500 mb-1">Stock</p>
                  <p className="text-sm text-neutral-300">Vente avec stock{listing.stock_value > 0 ? ` — Valeur : ${formatCHF(listing.stock_value)} CHF` : ""}</p>
                </div>
              )}
              <InfoBlock label="Concurrents" value={listing.competitors} />
              <InfoBlock label="Raison de la vente" value={listing.reason_for_sale} />
              <InfoBlock label="Potentiel de croissance" value={listing.growth_potential} />
              <InfoBlock label="Inclus dans la vente" value={listing.included_in_sale} />
            </div>
          </Section>
        )}

        {/* Technique */}
        {(listing.tech_stack || listing.hosting) && (
          <Section title="Technique">
            <div className="grid grid-cols-2 gap-3">
              {listing.tech_stack && (
                <div className="rounded-xl border border-white/5 bg-[#111] p-4">
                  <p className="text-[10px] text-neutral-500 mb-1">Technologies</p>
                  <p className="text-sm text-neutral-300">{listing.tech_stack}</p>
                </div>
              )}
              {listing.hosting && (
                <div className="rounded-xl border border-white/5 bg-[#111] p-4">
                  <p className="text-[10px] text-neutral-500 mb-1">Hébergeur</p>
                  <p className="text-sm text-neutral-300">{listing.hosting}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* URL */}
        {listing.url && (
          <Section title="Site web">
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-[#111] px-6 py-3 text-sm text-emerald-400 hover:border-emerald-500/30 transition-all"
            >
              {listing.url}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </Section>
        )}

        {/* Contact */}
        <Section title="Contacter le vendeur">
          <div className="flex flex-col gap-3 sm:flex-row">
            {listing.contact_email && (
              <a
                href={`mailto:${listing.contact_email}?subject=Intéressé par : ${listing.title}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyer un email
              </a>
            )}
            {listing.contact_whatsapp && (
              <a
                href={`https://wa.me/${listing.contact_whatsapp.replace(/[^0-9+]/g, "")}?text=Bonjour, je suis intéressé par : ${encodeURIComponent(listing.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:brightness-110 transition-all"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
