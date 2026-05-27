import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/security/rate-limit";

// WMI (first 3 chars) → brand
const WMI_MAP: Record<string, string> = {
  WVW: "Volkswagen",
  WV1: "Volkswagen",
  WV2: "Volkswagen",
  WAU: "Audi",
  AAA: "Audi",
  WBA: "BMW",
  WBS: "BMW",
  WDD: "Mercedes-Benz",
  YV1: "Volvo",
  YV4: "Volvo",
  SAL: "Land Rover",
  SAJ: "Jaguar",
  VF1: "Renault",
  VF3: "Renault",
  VF7: "Citroen",
  ZFA: "Fiat",
  JM1: "Nissan",
  JN1: "Nissan",
  JHM: "Honda",
  "5YJ": "Tesla",
  "7SA": "Tesla",
  SFZ: "Tesla",
  WME: "Smart",
  KNA: "Kia",
  KMH: "Hyundai",
  "1HG": "Honda",
  "2HG": "Honda",
  "1G1": "Chevrolet",
  "2G1": "Chevrolet",
  "1FA": "Ford",
  "2FA": "Ford",
  "19X": "Honda",
  "1G4": "Buick",
};

// 10th char of VIN → model year
const YEAR_MAP: Record<string, number> = {
  K: 2019,
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
};

export async function GET(request: Request) {
  const rl = applyRateLimit(request, "vin-decode", 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const vin = searchParams.get("vin")?.trim().toUpperCase() ?? "";

  if (!vin || vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return NextResponse.json(
      { error: "VIN must be exactly 17 alphanumeric characters (I, O, Q not allowed)." },
      { status: 400 },
    );
  }

  const wmi = vin.slice(0, 3);
  const brand = WMI_MAP[wmi] ?? null;

  const yearChar = vin[9];
  const year = yearChar ? (YEAR_MAP[yearChar] ?? null) : null;

  if (!brand) {
    return NextResponse.json(
      { error: "Unrecognised VIN prefix — brand could not be determined." },
      { status: 422 },
    );
  }

  return NextResponse.json({ brand, year });
}
