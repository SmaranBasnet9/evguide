import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { usedEvListings } from "@/data/usedEvListings";
import { applyRateLimit } from "@/lib/security/rate-limit";

export async function GET() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("used_ev_listings")
    .select("*")
    .eq("status", "active")
    .order("listed_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return NextResponse.json(usedEvListings.filter((l) => l.status === "active"));
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "used-listings", 3, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to list your EV." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";
  const year = typeof body.year === "number" ? body.year : null;
  const price = typeof body.price === "number" ? body.price : null;
  const mileage = typeof body.mileage === "number" ? body.mileage : null;
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const contactEmail = typeof body.contact_email === "string" ? body.contact_email.trim() : user.email ?? "";
  const contactPhone = typeof body.contact_phone === "string" ? body.contact_phone.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim().slice(0, 1000) : "";
  const colour = typeof body.colour === "string" ? body.colour.trim() : "";
  const wallboxIncluded = body.wallbox_included === true;
  const serviceHistoryFull = body.service_history_full === true;

  if (!brand || !model) return NextResponse.json({ error: "Brand and model are required." }, { status: 400 });
  if (!year || year < 2010 || year > 2026) return NextResponse.json({ error: "Valid year required." }, { status: 400 });
  if (!price || price < 1000) return NextResponse.json({ error: "Valid asking price required." }, { status: 400 });
  if (!mileage && mileage !== 0) return NextResponse.json({ error: "Mileage is required." }, { status: 400 });
  if (!location) return NextResponse.json({ error: "Location is required." }, { status: 400 });
  if (!contactEmail) return NextResponse.json({ error: "Contact email required." }, { status: 400 });

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("used_ev_listings")
    .insert({
      user_id: user.id,
      brand,
      model,
      year,
      price,
      mileage,
      location,
      colour: colour || null,
      description: description || null,
      wallbox_included: wallboxIncluded,
      service_history_full: serviceHistoryFull,
      contact_email: contactEmail,
      contact_phone: contactPhone || null,
      seller_type: "private",
      seller_name: user.user_metadata?.full_name ?? "Private Seller",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[used-listings] insert failed:", error.message);
    return NextResponse.json({ error: "Could not submit your listing. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
