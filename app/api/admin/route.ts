import { createClient } from "@supabase/supabase-js";
import { sendListingValidatedEmail, sendListingRejectedEmail } from "@/app/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Adrien2026";

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
        banned: u.banned_until ? true : false,
      }));

      return Response.json({
        users,
        listings: listingsRes.data || [],
      });
    }

    if (action === "updateStatus") {
      const { listingId, status } = body;
      // Get listing info for email
      const { data: listing } = await supabase.from("vsi_listings").select("title, contact_email").eq("id", listingId).single() as { data: { title: string; contact_email: string } | null };
      await supabase.from("vsi_listings").update({ status }).eq("id", listingId);
      // Send email notification to seller
      if (listing?.contact_email) {
        if (status === "published") {
          sendListingValidatedEmail(listing.contact_email, listing.title).catch(() => {});
        } else if (status === "rejected") {
          sendListingRejectedEmail(listing.contact_email, listing.title).catch(() => {});
        }
      }
      return Response.json({ ok: true });
    }

    if (action === "delete") {
      const { listingId } = body;
      await supabase.from("vsi_listings").delete().eq("id", listingId);
      return Response.json({ ok: true });
    }

    // Increment views for a listing (called from public listing page)
    if (action === "trackView") {
      const { listingId } = body;
      const { data } = await supabase.from("vsi_listings").select("views").eq("id", listingId).single();
      const currentViews = (data as { views: number } | null)?.views || 0;
      await supabase.from("vsi_listings").update({ views: currentViews + 1 }).eq("id", listingId);
      return Response.json({ ok: true });
    }

    // Ban user
    if (action === "banUser") {
      const { userId } = body;
      await supabase.auth.admin.updateUserById(userId, { ban_duration: "876000h" }); // ~100 years
      // Archive all their listings
      await supabase.from("vsi_listings").update({ status: "archived" }).eq("user_id", userId);
      return Response.json({ ok: true });
    }

    // Unban user
    if (action === "unbanUser") {
      const { userId } = body;
      await supabase.auth.admin.updateUserById(userId, { ban_duration: "none" });
      return Response.json({ ok: true });
    }

    // Delete user
    if (action === "deleteUser") {
      const { userId } = body;
      // Delete their listings first
      await supabase.from("vsi_listings").delete().eq("user_id", userId);
      // Delete auth user
      await supabase.auth.admin.deleteUser(userId);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
