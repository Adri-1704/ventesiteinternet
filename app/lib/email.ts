import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.FROM_EMAIL || "VenteSiteInternet <contact@just-tag.app>";

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn(`[Email] No RESEND_API_KEY — skipping email to ${to}: "${subject}"`);
    return;
  }
  await resend.emails.send({ from, to, subject, html }).catch((err) => {
    console.error("[Email] Failed:", err);
  });
}

function layout(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;"><tr><td align="center" style="padding:32px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <tr><td style="background:#059669;padding:20px 28px;"><span style="font-size:20px;font-weight:800;color:#fff;">Vente</span><span style="font-size:20px;font-weight:800;color:#d1fae5;">SiteInternet</span><span style="font-size:20px;font-weight:800;color:#fff;">.ch</span></td></tr>
      <tr><td style="padding:28px;">${content}</td></tr>
      <tr><td style="background:#f9fafb;padding:16px 28px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#9ca3af;">ventesiteinternet.ch · Suisse 🇨🇭</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function h(text: string) { return `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#111827;">${text}</h1>`; }
function p(text: string) { return `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#374151;">${text}</p>`; }
function btn(url: string, label: string) { return `<table style="margin:20px 0;"><tr><td style="background:#059669;border-radius:8px;padding:12px 24px;"><a href="${url}" style="color:#fff;text-decoration:none;font-weight:600;font-size:14px;">${label}</a></td></tr></table>`; }
function divider() { return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>`; }

// ─── Email templates ─────────────────────────────────────────

export async function sendWelcomeEmail(email: string) {
  const html = layout([
    h("Bienvenue sur VenteSiteInternet.ch ! 🎉"),
    p("Votre compte a été créé avec succès. Vous pouvez dès maintenant publier vos annonces et commencer à vendre vos sites web."),
    btn("https://ventesiteinternet.ch/dashboard", "Accéder à mon espace vendeur"),
    divider(),
    p("Si vous êtes acheteur, parcourez les annonces disponibles :"),
    btn("https://ventesiteinternet.ch/annonces", "Voir les annonces"),
    p("<span style='color:#9ca3af;font-size:13px;'>Si vous n'avez pas créé de compte, ignorez cet email.</span>"),
  ].join(""));
  await send(email, "Bienvenue sur VenteSiteInternet.ch 🇨🇭", html);
}

export async function sendListingValidatedEmail(email: string, listingTitle: string) {
  const html = layout([
    h("Votre annonce a été validée ✅"),
    p(`Bonne nouvelle ! Votre annonce <strong>"${listingTitle}"</strong> a été vérifiée et approuvée par notre équipe.`),
    p("Elle est maintenant visible par tous les acheteurs sur la plateforme."),
    btn("https://ventesiteinternet.ch/dashboard", "Voir mon annonce"),
    divider(),
    p("<span style='color:#9ca3af;font-size:13px;'>Merci de votre confiance. L'équipe VenteSiteInternet.ch</span>"),
  ].join(""));
  await send(email, `✅ Annonce validée : ${listingTitle}`, html);
}

export async function sendListingRejectedEmail(email: string, listingTitle: string) {
  const html = layout([
    h("Votre annonce n'a pas été validée"),
    p(`Nous avons examiné votre annonce <strong>"${listingTitle}"</strong> et nous ne pouvons malheureusement pas la publier en l'état.`),
    p("Raisons possibles : informations incomplètes, contenu non conforme à nos critères, ou données non vérifiables."),
    p("Vous pouvez modifier votre annonce et la soumettre à nouveau depuis votre espace vendeur."),
    btn("https://ventesiteinternet.ch/dashboard", "Modifier mon annonce"),
    divider(),
    p("Si vous avez des questions, contactez-nous par email : <a href='mailto:contact@ventesiteinternet.ch' style='color:#059669;'>contact@ventesiteinternet.ch</a>"),
  ].join(""));
  await send(email, `Annonce non validée : ${listingTitle}`, html);
}

export async function sendNewListingAdminEmail(listingTitle: string, sellerEmail: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "contact@ventesiteinternet.ch";
  const html = layout([
    h("🔔 Nouvelle annonce à valider"),
    p(`Un vendeur vient de soumettre une nouvelle annonce.`),
    divider(),
    p(`<strong>Annonce :</strong> ${listingTitle}`),
    p(`<strong>Vendeur :</strong> ${sellerEmail}`),
    divider(),
    btn("https://ventesiteinternet.ch/admin", "Ouvrir l'admin"),
  ].join(""));
  await send(adminEmail, `🔔 Nouvelle annonce : ${listingTitle}`, html);
}
