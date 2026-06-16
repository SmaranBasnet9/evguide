import { NextResponse } from "next/server";
import { requireDealer } from "@/lib/security/dealer";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inspectListing, applyInspectionResult, type ListingForInspection } from "@/lib/ai/listingInspector";
import { stripUnsupportedColumns } from "@/lib/dealer/conditionColumn";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("dealer_listings")
    .select("id, status")
    .eq("id", id)
    .eq("dealer_id", guard.dealerProfileId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const brand   = typeof body.brand   === "string" ? body.brand.trim()  : "";
  const model   = typeof body.model   === "string" ? body.model.trim()  : "";
  const year    = typeof body.year    === "number" ? body.year    : null;
  const price   = typeof body.price   === "number" ? body.price   : null;
  const mileage = typeof body.mileage === "number" ? body.mileage : null;

  if (!brand || !model) return NextResponse.json({ error: "Brand and model are required." }, { status: 400 });
  if (!year || year < 2011 || year > 2027) return NextResponse.json({ error: "Valid year required." }, { status: 400 });
  if (price === null || price < 0) return NextResponse.json({ error: "Valid price required." }, { status: 400 });
  if (mileage === null || mileage < 0) return NextResponse.json({ error: "Valid mileage required." }, { status: 400 });

  const images = Array.isArray(body.images)
    ? (body.images as unknown[]).filter((u): u is string => typeof u === "string" && u.startsWith("https://")).slice(0, 8)
    : [];

  // Re-submit for AI inspection whenever a dealer saves a non-draft listing
  const newStatus = "pending";

  const listingPayload: Record<string, unknown> = {
    status:            newStatus,
    condition:         body.condition === "new" ? "new" : "used",
    vin:               typeof body.vin               === "string" ? body.vin.trim().toUpperCase() || null : null,
    brand,
    model,
    year,
    price,
    mileage,
    colour:            typeof body.colour            === "string" ? body.colour            : null,
    description:       typeof body.description       === "string" ? body.description       : null,
    images,
    range_km:          typeof body.range_km          === "number" ? body.range_km          : null,
    battery_kwh:       typeof body.battery_kwh       === "number" ? body.battery_kwh       : null,
    drive:             typeof body.drive             === "string" ? body.drive             : null,
    body_type:         typeof body.body_type         === "string" ? body.body_type         : null,
    charging_standard: typeof body.charging_standard === "string" ? body.charging_standard : null,
    seats:             typeof body.seats             === "number" ? body.seats             : null,
    location:          typeof body.location          === "string" ? body.location          : null,
    variant:           typeof body.variant           === "string" ? body.variant           : null,
    dc_charge_kw:      typeof body.dc_charge_kw      === "number" ? body.dc_charge_kw      : null,
    ac_charge_kw:      typeof body.ac_charge_kw      === "number" ? body.ac_charge_kw      : null,
    charge_to_80_mins: typeof body.charge_to_80_mins === "number" ? body.charge_to_80_mins : null,
    rejection_reason:  null,
    ai_decision:       null,
    ai_inspection_notes: null,
    ai_inspected_at:   null,
  };

  const { error: updateError } = await supabase
    .from("dealer_listings")
    .update(await stripUnsupportedColumns(listingPayload))
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // Trigger AI inspection (non-blocking)
  runAIInspection(id).catch((err) => {
    console.error("[AI inspect] background error on update:", err);
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("dealer_listings")
    .select("id, status")
    .eq("id", id)
    .eq("dealer_id", guard.dealerProfileId)
    .single();

  if (!existing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.action !== "withdraw") {
    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  }

  if (existing.status !== "live") {
    return NextResponse.json({ error: "Only live listings can be withdrawn." }, { status: 400 });
  }

  const { error } = await supabase
    .from("dealer_listings")
    .update({ status: "draft" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("dealer_listings")
    .select("id, status")
    .eq("id", id)
    .eq("dealer_id", guard.dealerProfileId)
    .single();

  if (!existing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  if (existing.status === "live") {
    return NextResponse.json(
      { error: "Live listings cannot be deleted. Please contact support to remove a live listing." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("dealer_listings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// ─── Background AI inspection ───────────────────────────────────────────────

async function runAIInspection(listingId: string) {
  const admin = createAdminClient();

  const { data: full } = await admin
    .from("dealer_listings")
    .select("*")
    .eq("id", listingId)
    .single();

  const subject: ListingForInspection = { id: listingId, ...full };

  let result;
  try {
    result = await inspectListing(subject);
  } catch (err) {
    console.error("[AI inspect] inspectListing failed:", err);
    return;
  }

  await applyInspectionResult(admin, listingId, result);
}
