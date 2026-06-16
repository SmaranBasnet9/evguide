import { NextResponse } from "next/server";
import { requireDealer } from "@/lib/security/dealer";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inspectListing, applyInspectionResult, type ListingForInspection } from "@/lib/ai/listingInspector";
import { hasConditionColumn, stripUnsupportedColumns } from "@/lib/dealer/conditionColumn";

export async function GET() {
  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

  const supabase = await createClient();
  const conditionCol = await hasConditionColumn();
  const { data, error } = await supabase
    .from("dealer_listings")
    .select(`id, brand, model, year, price, mileage, status,${conditionCol ? " condition," : ""} created_at, rejection_reason`)
    .eq("dealer_id", guard.dealerProfileId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listings: data });
}

export async function POST(request: Request) {
  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

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

  const isDraft = body.status === "draft";

  if (!isDraft) {
    if (price === null || price < 0) return NextResponse.json({ error: "Valid price required." }, { status: 400 });
    if (mileage === null || mileage < 0) return NextResponse.json({ error: "Valid mileage required." }, { status: 400 });
  }

  const images = Array.isArray(body.images)
    ? (body.images as unknown[]).filter((u): u is string => typeof u === "string" && u.startsWith("https://")).slice(0, 8)
    : [];

  const condition = body.condition === "new" ? "new" : "used";

  const listingPayload: Record<string, unknown> = {
    dealer_id:         guard.dealerProfileId,
    status:            isDraft ? "draft" : "pending",
    condition,
    vin:               typeof body.vin               === "string" ? body.vin.trim().toUpperCase() || null : null,
    brand,
    model,
    year,
    price:             price ?? 0,
    mileage:           mileage ?? 0,
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
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dealer_listings")
    .insert(await stripUnsupportedColumns(listingPayload))
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fire AI inspection for non-draft submissions (non-blocking)
  if (!isDraft) {
    runAIInspection(data.id).catch((err) => {
      console.error("[AI inspect] background error:", err);
    });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

// ─── Background AI inspection ───────────────────────────────────────────────

async function runAIInspection(listingId: string) {
  const admin = createAdminClient();

  // Fetch complete listing (in case partial payload was passed)
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
