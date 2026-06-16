import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireVerifiedVendor } from "@/lib/security/vendor";
import { applyRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = admin
    .from("vendor_listings")
    .select("id, make, model, variant, year, price, mileage, condition, status, images, view_count, lead_count, published_at, created_at")
    .eq("vendor_id", guard.vendorId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to load listings." }, { status: 500 });

  return NextResponse.json({ listings: data ?? [] });
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "vendor-create-listing", 20, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many listing submissions. Please wait." }, { status: 429 });
  }

  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();

  // Check permissions cap
  const { data: perms } = await admin
    .from("vendor_permissions")
    .select("can_publish_listings, max_active_listings")
    .eq("vendor_id", guard.vendorId)
    .single();

  const { count: activeCount } = await admin
    .from("vendor_listings")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", guard.vendorId)
    .in("status", ["live", "pending_review"])
    .eq("is_deleted", false);

  if ((activeCount ?? 0) >= (perms?.max_active_listings ?? 10)) {
    return NextResponse.json({
      error: `You've reached your limit of ${perms?.max_active_listings ?? 10} active listings.`,
    }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const make  = typeof body.make  === "string" ? body.make.trim()  : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";
  const year  = typeof body.year  === "number" ? body.year : parseInt(String(body.year ?? "0"));
  const price = typeof body.price === "number" ? body.price : parseFloat(String(body.price ?? "0"));

  if (!make || !model || !year || !price) {
    return NextResponse.json({ error: "Make, model, year and price are required." }, { status: 400 });
  }

  const { data: listing, error: insertError } = await admin
    .from("vendor_listings")
    .insert({
      vendor_id: guard.vendorId,
      status: "draft",
      make,
      model,
      variant:              typeof body.variant             === "string" ? body.variant.trim()             : null,
      year,
      condition:            typeof body.condition           === "string" ? body.condition                  : "used",
      mileage:              typeof body.mileage             === "number" ? body.mileage                    : null,
      price,
      registration_number:  typeof body.registrationNumber  === "string" ? body.registrationNumber.trim()  : null,
      vin:                  typeof body.vin                 === "string" ? body.vin.trim()                 : null,
      colour:               typeof body.colour              === "string" ? body.colour.trim()              : null,
      engine_type:          typeof body.engineType          === "string" ? body.engineType                 : null,
      horsepower:           typeof body.horsepower          === "number" ? body.horsepower                 : null,
      torque_nm:            typeof body.torqueNm            === "number" ? body.torqueNm                   : null,
      transmission:         typeof body.transmission        === "string" ? body.transmission               : null,
      drivetrain:           typeof body.drivetrain          === "string" ? body.drivetrain                 : null,
      battery_kwh:          typeof body.batteryKwh          === "number" ? body.batteryKwh                 : null,
      charging_speed_kw:    typeof body.chargingSpeedKw     === "number" ? body.chargingSpeedKw            : null,
      range_km:             typeof body.rangeKm             === "number" ? body.rangeKm                    : null,
      safety_features:      Array.isArray(body.safetyFeatures)  ? body.safetyFeatures  : [],
      comfort_features:     Array.isArray(body.comfortFeatures) ? body.comfortFeatures : [],
      tech_features:        Array.isArray(body.techFeatures)    ? body.techFeatures    : [],
      images:               Array.isArray(body.images)          ? body.images          : [],
      youtube_url:          typeof body.youtubeUrl         === "string" ? body.youtubeUrl.trim()          : null,
      description:          typeof body.description        === "string" ? body.description.trim()         : null,
      location:             typeof body.location           === "string" ? body.location.trim()            : null,
    })
    .select("id")
    .single();

  if (insertError || !listing) {
    console.error("[vendor/listings POST]", insertError?.message);
    return NextResponse.json({ error: "Could not create listing." }, { status: 500 });
  }

  await admin.from("vendor_audit_logs").insert({
    vendor_id: guard.vendorId,
    actor_user_id: guard.userId,
    action: "listing_submitted",
    details: { listing_id: listing.id, make, model, year },
  });

  return NextResponse.json({ ok: true, listingId: listing.id }, { status: 201 });
}
