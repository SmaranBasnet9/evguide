import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "enquiries", 10, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const listingId = typeof body.listingId === "string" ? body.listingId.trim() : "";
  const fullName  = typeof body.fullName  === "string" ? body.fullName.trim()  : "";
  const email     = typeof body.email     === "string" ? body.email.trim().toLowerCase() : "";
  const phone     = typeof body.phone     === "string" ? body.phone.trim()     : null;
  const message   = typeof body.message   === "string" ? body.message.trim()   : null;

  if (!listingId) return NextResponse.json({ error: "Listing not specified."  }, { status: 400 });
  if (!fullName)  return NextResponse.json({ error: "Full name is required."  }, { status: 400 });
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email is required." }, { status: 400 });

  const admin = createAdminClient();

  // Resolve dealer_id from the listing (verify listing is live)
  const { data: listing, error: listingError } = await admin
    .from("dealer_listings")
    .select("id, dealer_id")
    .eq("id", listingId)
    .eq("status", "live")
    .single();

  if (listingError || !listing) {
    return NextResponse.json({ error: "Listing not found or no longer available." }, { status: 404 });
  }

  const { error } = await admin.from("dealer_enquiries").insert({
    listing_id: listing.id,
    dealer_id:  listing.dealer_id,
    full_name:  fullName,
    email,
    phone:      phone || null,
    message:    message || null,
  });

  if (error) {
    console.error("[enquiries POST]", error.message);
    return NextResponse.json({ error: "Failed to send enquiry. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
