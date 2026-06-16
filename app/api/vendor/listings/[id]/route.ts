import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireVerifiedVendor } from "@/lib/security/vendor";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("vendor_listings")
    .select("*")
    .eq("id", id)
    .eq("vendor_id", guard.vendorId)
    .eq("is_deleted", false)
    .single();

  if (error || !data) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  return NextResponse.json({ listing: data });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("vendor_listings")
    .select("id, status, vendor_id")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (!existing || existing.vendor_id !== guard.vendorId) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  if (existing.status === "live") {
    return NextResponse.json({ error: "Pause the listing before editing a live listing." }, { status: 409 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const patch: Record<string, unknown> = {};
  const str = (k: string) => typeof body[k] === "string" ? (body[k] as string).trim() : undefined;
  const num = (k: string) => typeof body[k] === "number" ? body[k] : undefined;
  const arr = (k: string) => Array.isArray(body[k]) ? body[k] : undefined;

  if (str("make"))    patch.make    = str("make");
  if (str("model"))   patch.model   = str("model");
  if (str("variant")) patch.variant = str("variant");
  if (num("year"))    patch.year    = num("year");
  if (num("price"))   patch.price   = num("price");
  if (num("mileage")) patch.mileage = num("mileage");
  if (str("condition"))           patch.condition           = str("condition");
  if (str("registrationNumber"))  patch.registration_number = str("registrationNumber");
  if (str("vin"))                 patch.vin                 = str("vin");
  if (str("colour"))              patch.colour              = str("colour");
  if (str("engineType"))          patch.engine_type         = str("engineType");
  if (num("horsepower"))          patch.horsepower          = num("horsepower");
  if (num("torqueNm"))            patch.torque_nm           = num("torqueNm");
  if (str("transmission"))        patch.transmission        = str("transmission");
  if (str("drivetrain"))          patch.drivetrain          = str("drivetrain");
  if (num("batteryKwh"))          patch.battery_kwh         = num("batteryKwh");
  if (num("chargingSpeedKw"))     patch.charging_speed_kw   = num("chargingSpeedKw");
  if (num("rangeKm"))             patch.range_km            = num("rangeKm");
  if (arr("safetyFeatures"))      patch.safety_features     = arr("safetyFeatures");
  if (arr("comfortFeatures"))     patch.comfort_features    = arr("comfortFeatures");
  if (arr("techFeatures"))        patch.tech_features       = arr("techFeatures");
  if (arr("images"))              patch.images              = arr("images");
  if (str("youtubeUrl"))          patch.youtube_url         = str("youtubeUrl");
  if (str("description"))         patch.description         = str("description");
  if (str("location"))            patch.location            = str("location");

  // Allow vendor to submit for review from draft
  if (body.submitForReview === true && existing.status === "draft") {
    patch.status = "pending_review";
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const { error: updateError } = await admin
    .from("vendor_listings")
    .update(patch)
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("vendor_listings")
    .select("id, vendor_id, status")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (!existing || existing.vendor_id !== guard.vendorId) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  await admin.from("vendor_listings").update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ ok: true });
}
