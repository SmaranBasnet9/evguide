import type { EVModel } from "@/types";

export type RouteFrequency = "daily" | "weekly" | "occasional";
export type Season = "summer" | "average" | "winter";

export interface UserRoute {
  label: string;
  fromPostcode: string;
  toPostcode: string;
  distanceMiles: number;
  roundTrip: boolean;
  frequency: RouteFrequency;
}

export interface RouteAnalysis {
  route: UserRoute;
  usableRangeMiles: number;
  routeMiles: number;
  canComplete: boolean;
  chargingStops: number;
  chargeTimeMinutes: number;
  rangeUsedPct: number;
  winterCaution: boolean;
  verdict: "easy" | "comfortable" | "tight" | "needs_charge" | "multiple_stops";
}

export interface EVRangeFitResult {
  ev: EVModel;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  gradeLabel: string;
  routes: RouteAnalysis[];
  summary: string;
  summerRangeMiles: number;
  winterRangeMiles: number;
  peakDcKw: number;
  chargeTimeTo80Mins: number;
}

export interface RangeFitInputs {
  routes: UserRoute[];
  season: Season;
}
