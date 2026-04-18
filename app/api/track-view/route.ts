import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json();
    if (!listingId) return Response.json({ error: "Missing id" }, { status: 400 });

    const { data } = await supabase.from("vsi_listings").select("views").eq("id", listingId).single();
    const currentViews = (data as { views: number } | null)?.views || 0;
    await supabase.from("vsi_listings").update({ views: currentViews + 1 }).eq("id", listingId);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
