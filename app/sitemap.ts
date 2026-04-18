import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ventesiteinternet.ch";
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/annonces`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/auth/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/auth/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Published listings
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase
      .from("vsi_listings")
      .select("id, created_at")
      .eq("status", "published");

    if (data) {
      for (const listing of data as { id: string; created_at: string }[]) {
        entries.push({
          url: `${baseUrl}/annonces/${listing.id}`,
          lastModified: new Date(listing.created_at),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch {}

  return entries;
}
