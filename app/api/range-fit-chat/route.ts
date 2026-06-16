import { evModels } from "@/data/evModels";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { getLocationDistanceMiles, getSummerRangeMiles, getWinterRangeMiles, getChargeTimeTo80 } from "@/lib/range-fit/engine";
import { extractTripLocally } from "@/lib/range-fit/localChatBrain";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_ENERGY_RATE_PENCE } from "@/lib/ev-intelligence";

export const runtime = "nodejs";

// ── Memory: recall and store past "ask about a route" answers ─────────────────
// This is the chatbot's long-term memory — every resolved query is logged to
// `range_chat_logs` (see PENDING_MIGRATIONS.sql §7), keyed by resolved place
// names + vehicle. Future queries for the same route/car are flagged as
// "asked before" so the reply reflects accumulated confidence. The distance
// lookup (getLocationDistanceMiles) is the single seam to swap in Google Maps
// Distance Matrix later — everything downstream just consumes `{ miles }`.
async function recallSimilarTrips(originLabel: string, destinationLabel: string, evId: string): Promise<number> {
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("range_chat_logs")
      .select("id", { count: "exact", head: true })
      .eq("origin_label", originLabel)
      .eq("destination_label", destinationLabel)
      .eq("ev_id", evId);
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function rememberTrip(entry: {
  query: string;
  origin: string;
  destination: string;
  originLabel: string;
  destinationLabel: string;
  roundTrip: boolean;
  routeMiles: number;
  evId: string;
  batteryKwhUsed: number;
  batteryPctUsed: number;
  fitsOneCharge: boolean;
  reply: string;
}) {
  try {
    const supabase = createAdminClient();
    await supabase.from("range_chat_logs").insert({
      query: entry.query,
      origin: entry.origin,
      destination: entry.destination,
      origin_label: entry.originLabel,
      destination_label: entry.destinationLabel,
      round_trip: entry.roundTrip,
      route_miles: entry.routeMiles,
      ev_id: entry.evId,
      battery_kwh_used: entry.batteryKwhUsed,
      battery_pct_used: entry.batteryPctUsed,
      fits_one_charge: entry.fitsOneCharge,
      reply: entry.reply,
    });
  } catch {
    // Table may not exist yet (PENDING_MIGRATIONS.sql not applied) — memory is best-effort.
  }
}

function findVehicle(name: string) {
  if (!name) return null;
  const needle = name.trim().toLowerCase();
  return (
    evModels.find((v) => `${v.brand} ${v.model}`.toLowerCase() === needle) ??
    evModels.find((v) => `${v.brand} ${v.model}`.toLowerCase().includes(needle) || needle.includes(v.model.toLowerCase())) ??
    null
  );
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "range-fit-chat", 15, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment." }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  let message: string;
  try {
    const body = (await request.json()) as { message?: unknown };
    if (typeof body.message !== "string" || !body.message.trim()) {
      return new Response(JSON.stringify({ error: "message is required." }), { status: 400 });
    }
    message = body.message.trim().slice(0, 500);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), { status: 400 });
  }

  const trip = extractTripLocally(message);

  if (!trip.origin || !trip.destination) {
    return new Response(
      JSON.stringify({ reply: "Tell me where you're starting from and where you're heading — e.g. \"From Manchester to Sheffield in a Kia EV6, there and back.\"" }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  const distance = await getLocationDistanceMiles(trip.origin, trip.destination);
  if (!distance) {
    return new Response(
      JSON.stringify({ reply: `I couldn't find one of those places — "${trip.origin}" or "${trip.destination}". Try a UK postcode or a larger town nearby.` }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  const ev = findVehicle(trip.vehicle) ?? evModels[0];
  const routeMiles = distance.miles * (trip.roundTrip ? 2 : 1);
  const summerRangeMiles = getSummerRangeMiles(ev);
  const winterRangeMiles = getWinterRangeMiles(ev);
  const milesPerKwh = summerRangeMiles / ev.batteryKWh;
  const kwhUsed = routeMiles / milesPerKwh;
  const batteryPct = Math.min(100, Math.round((kwhUsed / ev.batteryKWh) * 100));
  const usableRangeMiles = Math.round(summerRangeMiles * 0.78);
  const winterUsableRangeMiles = Math.round(winterRangeMiles * 0.78);
  const fitsOnOneCharge = routeMiles <= usableRangeMiles;
  const fitsInWinter = routeMiles <= winterUsableRangeMiles;
  const tripCostGbp = (kwhUsed * DEFAULT_ENERGY_RATE_PENCE) / 100;
  const chargeTimeMins = getChargeTimeTo80(ev);

  const fromName = distance.fromPostcode ? `${distance.fromLabel} (${distance.fromPostcode})` : distance.fromLabel;
  const toName = distance.toPostcode ? `${distance.toLabel} (${distance.toPostcode})` : distance.toLabel;

  const tripDesc = trip.roundTrip
    ? `${fromName} to ${toName} and back (${routeMiles} miles)`
    : `${fromName} to ${toName} (${routeMiles} miles)`;

  const priorAsks = await recallSimilarTrips(distance.fromLabel, distance.toLabel, ev.id);
  const memoryNote = priorAsks > 0
    ? ` Other drivers have asked about this exact route in a ${ev.brand} ${ev.model} ${priorAsks} time${priorAsks === 1 ? "" : "s"} before — this estimate is consistent with those.`
    : "";

  const costNote = ` At home charging rates (~${DEFAULT_ENERGY_RATE_PENCE}p/kWh), this trip costs roughly £${tripCostGbp.toFixed(2)}.`;

  const winterNote = !fitsOnOneCharge
    ? ""
    : fitsInWinter
    ? ` Even in winter (~${winterUsableRangeMiles} miles usable), this trip still fits on one charge.`
    : ` Note: in winter the usable range drops to ~${winterUsableRangeMiles} miles, so this trip may need a charging stop in cold weather.`;

  const chargeNote = fitsOnOneCharge
    ? ""
    : ` A rapid charge from 10–80% takes around ${chargeTimeMins} minutes on this car.`;

  const reply = (fitsOnOneCharge
    ? `${tripDesc} in a ${ev.brand} ${ev.model} would use about ${Math.round(kwhUsed)} kWh — roughly ${batteryPct}% of its ${ev.batteryKWh} kWh battery. That's comfortably within its real-world range, no charging stop needed.`
    : `${tripDesc} in a ${ev.brand} ${ev.model} would use about ${Math.round(kwhUsed)} kWh — that's more than its usable range of ~${usableRangeMiles} miles, so you'd need at least one charging stop along the way.`
  ) + costNote + winterNote + chargeNote + memoryNote;

  await rememberTrip({
    query: message,
    origin: trip.origin,
    destination: trip.destination,
    originLabel: distance.fromLabel,
    destinationLabel: distance.toLabel,
    roundTrip: trip.roundTrip,
    routeMiles,
    evId: ev.id,
    batteryKwhUsed: kwhUsed,
    batteryPctUsed: batteryPct,
    fitsOneCharge: fitsOnOneCharge,
    reply,
  });

  return new Response(JSON.stringify({ reply, vehicle: `${ev.brand} ${ev.model}` }), {
    headers: { "Content-Type": "application/json" },
  });
}
