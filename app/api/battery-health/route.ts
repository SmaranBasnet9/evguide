import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { applyRateLimit } from "@/lib/security/rate-limit";

// Deterministic battery health simulation based on VIN + mileage + year
function simulateBatteryReport(params: {
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
}) {
  const { vin, brand, model, year, mileage } = params;

  // Seed from VIN for deterministic output — LCG with per-call state advancement
  let seed = vin.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = (min: number, max: number) => {
    seed = (seed * 9301 + 49297) % 233280;
    const s = seed / 233280;
    return Math.round(min + s * (max - min));
  };

  const ageYears = 2026 - year;
  // ~2-3% degradation per year + ~0.5% per 10k miles
  const ageDeg = ageYears * 2.2;
  const milesDeg = (mileage / 10000) * 0.5;
  const jitter = (rand(0, 100) - 50) / 50; // ±1%
  const soh = Math.min(100, Math.max(72, Math.round(100 - ageDeg - milesDeg + jitter)));

  const cellBalanceOptions = ["Excellent — uniform within 2mV", "Good — minor variance (±5mV)", "Acceptable — moderate variance (±12mV)"];
  const cellBalance = soh >= 95 ? cellBalanceOptions[0] : soh >= 88 ? cellBalanceOptions[1] : cellBalanceOptions[2];

  const chargeCycles = Math.round((mileage / 200) * (soh / 100));
  const fleetAvg = Math.round(100 - ageDeg * 0.85);

  const recommendations: string[] = [];
  if (soh < 85) recommendations.push("Consider negotiating price — battery below average for age/mileage");
  if (soh < 90) recommendations.push("Request battery warranty extension from dealer if available");
  if (cellBalance.includes("moderate")) recommendations.push("Full cell balance diagnostic recommended within 6 months");
  if (soh >= 95) recommendations.push("Excellent battery health — above fleet average for this model");
  if (mileage > 50000) recommendations.push("Ensure rapid charging has not been primary charging method");

  return {
    soh,
    cellBalance,
    estimatedChargeCycles: chargeCycles,
    fleetAverageSoh: fleetAvg,
    vsFleet: soh - fleetAvg,
    brand,
    model,
    year,
    mileage,
    vin: vin.toUpperCase(),
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "battery-health", 3, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to generate a battery health report." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const vin = typeof body.vin === "string" ? body.vin.trim().toUpperCase() : "";
  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";
  const year = typeof body.year === "number" ? body.year : null;
  const mileage = typeof body.mileage === "number" ? body.mileage : null;

  if (vin.length !== 17 || /[IOQ]/.test(vin)) {
    return NextResponse.json({ error: "Please enter a valid 17-character VIN (no I, O, or Q characters)." }, { status: 400 });
  }
  if (!brand || !model) {
    return NextResponse.json({ error: "Brand and model are required." }, { status: 400 });
  }
  if (!year || year < 2011 || year > 2026) {
    return NextResponse.json({ error: "Valid year required (2011–2026)." }, { status: 400 });
  }
  if (mileage === null || mileage < 0) {
    return NextResponse.json({ error: "Valid mileage required." }, { status: 400 });
  }

  const report = simulateBatteryReport({ vin, brand, model, year, mileage });

  // Log report request to DB (fire-and-forget)
  const admin = createAdminClient();
  void admin.from("battery_health_reports").insert({
    user_id: user.id,
    vin,
    brand,
    model,
    year,
    mileage,
    soh: report.soh,
    status: "complete",
  }).then(({ error }) => {
    if (error) console.error("[battery-health] log failed:", error.message);
  });

  return NextResponse.json({ report }, { status: 200 });
}
