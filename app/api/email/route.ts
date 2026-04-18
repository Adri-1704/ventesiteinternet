import { sendWelcomeEmail, sendNewListingAdminEmail } from "@/app/lib/email";

export async function POST(request: Request) {
  try {
    const { action, email, listingTitle } = await request.json();

    if (action === "welcome" && email) {
      await sendWelcomeEmail(email);
      return Response.json({ ok: true });
    }

    if (action === "newListing" && listingTitle && email) {
      await sendNewListingAdminEmail(listingTitle, email);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
