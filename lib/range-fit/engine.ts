import type { EVModel } from "@/types";
import type {
  UserRoute,
  RouteAnalysis,
  EVRangeFitResult,
  Season,
} from "./types";

// ── Real-world range derivation ───────────────────────────────────────────────

const KM_TO_MILES = 0.621371;

// WLTP to real-world factors (UK-specific research)
// Summer: ~82% of WLTP  |  Average: ~78%  |  Winter: ~65%
const SEASON_FACTOR: Record<Season, { summer: number; winter: number }> = {
  summer:  { summer: 0.82, winter: 0.72 },
  average: { summer: 0.78, winter: 0.67 },
  winter:  { summer: 0.72, winter: 0.62 },
};

// "Usable" range = what you actually use day-to-day
// Drivers typically charge to 80-90% and avoid going below 10-15%
// Effective usable window ≈ 78% of total real-world range
const USABLE_FACTOR = 0.78;

// Average rapid charge time per stop in minutes (25–30 min for meaningful top-up)
const RAPID_CHARGE_STOP_MINS = 28;

export function getSummerRangeMiles(ev: EVModel): number {
  if (ev.realWorldRangeMiles) return ev.realWorldRangeMiles;
  return Math.round(ev.rangeKm * KM_TO_MILES * 0.82);
}

export function getWinterRangeMiles(ev: EVModel): number {
  return Math.round(getSummerRangeMiles(ev) * 0.80);
}

export function getPeakDcKw(ev: EVModel): number {
  return ev.chargingSpeedDcKw ?? 50;
}

// Estimate charge time 10→80% in minutes from DC kW and usable battery
export function getChargeTimeTo80(ev: EVModel): number {
  if (ev.chargeTimeTo80Mins) return ev.chargeTimeTo80Mins;
  const usableKwh = ev.batteryKWh * 0.7;
  const dc = getPeakDcKw(ev);
  return Math.round((usableKwh / dc) * 60);
}

// ── Single route analysis ─────────────────────────────────────────────────────

function analyzeRoute(
  ev: EVModel,
  route: UserRoute,
  season: Season,
): RouteAnalysis {
  const factors = SEASON_FACTOR[season];
  const summerRange = getSummerRangeMiles(ev);
  const winterRange = Math.round(summerRange * (factors.winter / factors.summer));

  // Use whichever season is selected as the "working" range
  const workingRange = season === "winter" ? winterRange : summerRange;
  const usableRange = Math.round(workingRange * USABLE_FACTOR);

  const routeMiles = route.roundTrip
    ? route.distanceMiles * 2
    : route.distanceMiles;

  const winterUsable = Math.round(winterRange * USABLE_FACTOR);
  const winterCaution = routeMiles > winterUsable && season !== "winter";

  let chargingStops = 0;
  if (routeMiles > usableRange) {
    chargingStops = Math.ceil(routeMiles / usableRange) - 1;
  }

  const rangeUsedPct = Math.min(100, Math.round((routeMiles / usableRange) * 100));
  const chargeTimeMinutes = chargingStops * RAPID_CHARGE_STOP_MINS;

  let verdict: RouteAnalysis["verdict"];
  if (!chargingStops) {
    if (rangeUsedPct <= 65)      verdict = "easy";
    else if (rangeUsedPct <= 80) verdict = "comfortable";
    else                          verdict = "tight";
  } else if (chargingStops === 1) {
    verdict = "needs_charge";
  } else {
    verdict = "multiple_stops";
  }

  return {
    route,
    usableRangeMiles: usableRange,
    routeMiles,
    canComplete: true,
    chargingStops,
    chargeTimeMinutes,
    rangeUsedPct,
    winterCaution,
    verdict,
  };
}

// ── Score calculation ─────────────────────────────────────────────────────────

function buildSummary(analyses: RouteAnalysis[]): string {
  const noStops = analyses.every((a) => a.chargingStops === 0);
  if (noStops) {
    const anyTight = analyses.some((a) => a.verdict === "tight");
    if (anyTight) return "Covers all routes. Some routes use most of the charge.";
    return "Covers all your routes with charge to spare.";
  }
  const stopRoutes = analyses
    .filter((a) => a.chargingStops > 0)
    .map((a) => `${a.chargingStops}×${a.chargeTimeMinutes}min stop on ${a.route.label}`)
    .join(", ");
  return `Needs charging: ${stopRoutes}.`;
}

function calculateScore(analyses: RouteAnalysis[], ev: EVModel): number {
  let score = 100;

  analyses.forEach((a, idx) => {
    const isPrimary = idx === 0;
    const weight = isPrimary ? 1.0 : 0.6;

    if (a.chargingStops === 0) {
      if (a.verdict === "tight")        score -= 8  * weight;
      else if (a.verdict === "comfortable") score -= 2 * weight;
      // "easy" → no deduction
    } else if (a.chargingStops === 1) {
      score -= (isPrimary ? 22 : 12) * weight;
    } else {
      score -= (isPrimary ? 38 : 22) * weight;
    }

    if (a.winterCaution) score -= 6 * weight;
  });

  // Bonus: fast DC charger (quick stops hurt less)
  const dc = getPeakDcKw(ev);
  if (dc >= 150) score += 5;
  else if (dc >= 100) score += 3;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToGrade(score: number): EVRangeFitResult["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 55) return "C";
  if (score >= 35) return "D";
  return "F";
}

const GRADE_LABELS: Record<EVRangeFitResult["grade"], string> = {
  A: "Perfect fit",
  B: "Great fit",
  C: "Good fit",
  D: "Manageable",
  F: "Not ideal",
};

// ── Public API ────────────────────────────────────────────────────────────────

export function scoreEVForRoutes(
  ev: EVModel,
  routes: UserRoute[],
  season: Season,
): EVRangeFitResult {
  const analyses = routes.map((r) => analyzeRoute(ev, r, season));
  const score = calculateScore(analyses, ev);
  const grade = scoreToGrade(score);

  return {
    ev,
    score,
    grade,
    gradeLabel: GRADE_LABELS[grade],
    routes: analyses,
    summary: buildSummary(analyses),
    summerRangeMiles: getSummerRangeMiles(ev),
    winterRangeMiles: getWinterRangeMiles(ev),
    peakDcKw: getPeakDcKw(ev),
    chargeTimeTo80Mins: getChargeTimeTo80(ev),
  };
}

export function rankEVsForRoutes(
  evs: EVModel[],
  routes: UserRoute[],
  season: Season,
): EVRangeFitResult[] {
  return evs
    .map((ev) => scoreEVForRoutes(ev, routes, season))
    .sort((a, b) => b.score - a.score);
}

// ── Location resolution (postcode OR place name) ──────────────────────────────

const UK_POSTCODE_RE = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i;

async function resolveLocation(
  input: string,
): Promise<{ lat: number; lng: number; label: string; postcode: string | null } | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (UK_POSTCODE_RE.test(trimmed)) {
    // Postcode lookup
    const clean = encodeURIComponent(trimmed.replace(/\s+/g, "").toUpperCase());
    const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`).then((r) => r.json());
    if (res.status !== 200) return null;
    return {
      lat: res.result.latitude,
      lng: res.result.longitude,
      label: res.result.postcode as string,
      postcode: res.result.postcode as string,
    };
  }

  // Place name lookup via postcodes.io /places
  const res = await fetch(
    `https://api.postcodes.io/places?q=${encodeURIComponent(trimmed)}&limit=1`,
  ).then((r) => r.json());
  if (res.status !== 200 || !res.result?.length) return null;
  const place = res.result[0];
  const lat = place.latitude as number;
  const lng = place.longitude as number;

  // Predict the postcode for this place by reverse-geocoding its coordinates.
  const postcode = await resolveLocationFromCoords(lat, lng).then((r) => r?.postcode ?? null);

  return {
    lat,
    lng,
    label: (place.name_1 ?? trimmed) as string,
    postcode,
  };
}

export interface LocationSuggestion {
  value: string;
  label: string;
  sub?: string;
}

const POSTCODE_PREFIX_RE = /^[A-Z]{1,2}\d/i;

export async function searchLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    if (POSTCODE_PREFIX_RE.test(trimmed)) {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}/autocomplete`,
      ).then((r) => r.json());
      if (res.status === 200 && res.result?.length) {
        return (res.result as string[]).map((postcode) => ({
          value: postcode,
          label: postcode,
          sub: "Postcode",
        }));
      }
    }

    const res = await fetch(
      `https://api.postcodes.io/places?q=${encodeURIComponent(trimmed)}&limit=6`,
    ).then((r) => r.json());
    if (res.status !== 200 || !res.result?.length) return [];
    return res.result.map((place: Record<string, unknown>) => ({
      value: place.name_1 as string,
      label: place.name_1 as string,
      sub: [place.county_unitary, place.region].filter(Boolean).join(", ") || (place.country as string | undefined),
    }));
  } catch {
    return [];
  }
}

export async function resolveLocationFromCoords(
  lat: number,
  lng: number,
): Promise<{ postcode: string; label: string } | null> {
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1`,
    ).then((r) => r.json());
    if (res.status !== 200 || !res.result?.length) return null;
    const p = res.result[0];
    return {
      postcode: p.postcode as string,
      label: (p.admin_ward ?? p.parish ?? p.postcode) as string,
    };
  } catch {
    return null;
  }
}

function haversineRoadMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;
  const crow = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(crow * 1.27); // road ≈ crow-flies × 1.27
}

export async function getPostcodeDistanceMiles(
  from: string,
  to: string,
): Promise<number | null> {
  return getLocationDistanceMiles(from, to).then((r) => r?.miles ?? null);
}

export async function getLocationDistanceMiles(
  from: string,
  to: string,
): Promise<{ miles: number; fromLabel: string; toLabel: string; fromPostcode: string | null; toPostcode: string | null } | null> {
  try {
    const [loc1, loc2] = await Promise.all([resolveLocation(from), resolveLocation(to)]);
    if (!loc1 || !loc2) return null;
    return {
      miles: haversineRoadMiles(loc1.lat, loc1.lng, loc2.lat, loc2.lng),
      fromLabel: loc1.label,
      toLabel: loc2.label,
      fromPostcode: loc1.postcode,
      toPostcode: loc2.postcode,
    };
  } catch {
    return null;
  }
}
