import { NextRequest, NextResponse } from "next/server";
import { calcTCO } from "@/lib/ev-intelligence";
import type { TCOInputs } from "@/types";

/**
 * POST /api/tco-calculate
 *
 * Calculate Total Cost of Ownership for an EV.
 * Body: TCOInputs
 * Response: TCOResult
 */
export async function POST(req: NextRequest) {
  let body: TCOInputs;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { vehiclePrice, batteryKWh, rangeKm } = body;
  if (!vehiclePrice || !batteryKWh || !rangeKm) {
    return NextResponse.json(
      { error: "vehiclePrice, batteryKWh, and rangeKm are required" },
      { status: 400 },
    );
  }

  try {
    const result = calcTCO(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[tco-calculate] error:", err);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
