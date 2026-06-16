/**
 * AI listing inspector — uses GPT-4o to validate dealer EV listings.
 * Checks make/model authenticity, spec plausibility, and listing quality.
 * Auto-approves clean listings (status → "live") or rejects with a reason.
 */

import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export type ListingForInspection = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  colour?: string | null;
  description?: string | null;
  range_km?: number | null;
  battery_kwh?: number | null;
  drive?: string | null;
  body_type?: string | null;
  charging_standard?: string | null;
  seats?: number | null;
  location?: string | null;
  variant?: string | null;
  dc_charge_kw?: number | null;
  ac_charge_kw?: number | null;
  charge_to_80_mins?: number | null;
};

export type InspectionResult = {
  decision: "approved" | "rejected" | "flagged";
  summary: string;
  notes: string;
  issues: string[];
  enriched: {
    battery_kwh?: number | null;
    range_km?: number | null;
    dc_charge_kw?: number | null;
    charging_standard?: string | null;
  };
};

const SYSTEM_PROMPT = `You are an expert EV (electric vehicle) listing inspector for a UK automotive marketplace called EV Guide.
Review dealer listings and decide: APPROVE, REJECT, or FLAG for human review.

APPROVE if:
- Make/model/year is a real EV actually sold (not a concept or prototype unless clearly stated)
- Specs (battery kWh, WLTP range, charging speed) are plausible for this vehicle
- Price is reasonable for this age/mileage in the UK market
- No spam, contact details, or external URLs in description

REJECT if:
- Vehicle doesn't exist as a production EV (e.g. "2015 Honda Civic EV", "2018 F-150 Electric")
- Specs are physically impossible (e.g. 900 km WLTP range, 500 kWh battery on a hatchback)
- Price is fraudulently low (e.g. £500 for a Tesla Model 3) or absurdly high (e.g. £400,000 for a Nissan Leaf)
- Description contains phone numbers, email addresses, external URLs, or spam text

FLAG for human review if:
- Vehicle exists but you're unsure about a specific spec
- Price seems unusual but there could be a legitimate reason
- Something looks suspicious but isn't clearly fraudulent

Always respond with valid JSON.`;

export async function inspectListing(listing: ListingForInspection): Promise<InspectionResult> {
  const prompt = `Review this EV listing and return your decision as JSON.

VEHICLE: ${listing.year} ${listing.brand} ${listing.model}${listing.variant ? ` (${listing.variant})` : ""}
PRICE: £${listing.price?.toLocaleString() ?? "not set"}
MILEAGE: ${listing.mileage?.toLocaleString() ?? "not set"} miles
COLOUR: ${listing.colour ?? "not specified"}
BODY TYPE: ${listing.body_type ?? "not specified"}
SEATS: ${listing.seats ?? "not specified"}
LOCATION: ${listing.location ?? "not specified"}

EV SPECS:
- Battery: ${listing.battery_kwh ? `${listing.battery_kwh} kWh` : "not specified"}
- WLTP Range: ${listing.range_km ? `${listing.range_km} km` : "not specified"}
- Drivetrain: ${listing.drive ?? "not specified"}
- Charging standard: ${listing.charging_standard ?? "not specified"}
- DC fast charge: ${listing.dc_charge_kw ? `${listing.dc_charge_kw} kW` : "not specified"}
- AC charge: ${listing.ac_charge_kw ? `${listing.ac_charge_kw} kW` : "not specified"}
- 0→80% charge time: ${listing.charge_to_80_mins ? `${listing.charge_to_80_mins} mins` : "not specified"}

DESCRIPTION:
${listing.description ?? "(none)"}

Return JSON with this exact schema:
{
  "decision": "approved",
  "summary": "One sentence verdict",
  "notes": "2-3 sentence explanation of the decision",
  "issues": [],
  "enriched": {
    "battery_kwh": null,
    "range_km": null,
    "dc_charge_kw": null,
    "charging_standard": null
  }
}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 600,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(raw) as InspectionResult;
    if (!["approved", "rejected", "flagged"].includes(parsed.decision)) parsed.decision = "flagged";
    parsed.summary = parsed.summary ?? "AI inspection completed.";
    parsed.notes = parsed.notes ?? "";
    parsed.issues = Array.isArray(parsed.issues) ? parsed.issues : [];
    parsed.enriched = parsed.enriched ?? {};
    return parsed;
  } catch {
    return {
      decision: "flagged",
      summary: "AI inspection could not parse a result — flagged for manual review.",
      notes: "JSON parse error.",
      issues: [],
      enriched: {},
    };
  }
}

/**
 * Apply inspection result to a dealer_listings row.
 * Works entirely with the existing schema (no new columns required).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function applyInspectionResult(admin: any, listingId: string, result: InspectionResult) {
  const updates: Record<string, unknown> = {};

  if (result.decision === "approved") {
    updates.status = "live";
    updates.rejection_reason = null;
    // Apply AI-enriched spec corrections if provided
    if (result.enriched.battery_kwh != null)       updates.battery_kwh       = result.enriched.battery_kwh;
    if (result.enriched.range_km != null)           updates.range_km          = result.enriched.range_km;
    if (result.enriched.dc_charge_kw != null)       updates.dc_charge_kw      = result.enriched.dc_charge_kw;
    if (result.enriched.charging_standard != null)  updates.charging_standard = result.enriched.charging_standard;
  } else if (result.decision === "rejected") {
    updates.status = "rejected";
    const issueText = result.issues.length ? " — " + result.issues.join("; ") : "";
    updates.rejection_reason = `[AI] ${result.summary}${issueText}`;
  }
  // "flagged" → stays as "pending" for human admin review (no update needed for status)

  if (Object.keys(updates).length > 0) {
    const { error } = await admin.from("dealer_listings").update(updates).eq("id", listingId);
    if (error) console.error("[AI inspect] apply error:", error.message);
  }
}
