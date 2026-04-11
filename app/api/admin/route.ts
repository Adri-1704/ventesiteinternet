import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_PASSWORD = "Adrien2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action } = body;

    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    if (action === "load") {
      const [usersRes, listingsRes] = await Promise.all([
        supabase.auth.admin.listUsers({ perPage: 1000 }),
        supabase.from("vsi_listings").select("id, title, category, price, status, views, created_at, contact_email, user_id").order("created_at", { ascending: false }),
      ]);

      const users = (usersRes.data?.users || []).map((u) => ({
        id: u.id,
        email: u.email || "",
        created_at: u.created_at,
      }));

      return Response.json({
        users,
        listings: listingsRes.data || [],
      });
    }

    if (action === "updateStatus") {
      const { listingId, status } = body;
      await supabase.from("vsi_listings").update({ status }).eq("id", listingId);
      return Response.json({ ok: true });
    }

    if (action === "delete") {
      const { listingId } = body;
      await supabase.from("vsi_listings").delete().eq("id", listingId);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
