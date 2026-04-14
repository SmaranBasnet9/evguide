/**
 * EV Intelligence Library
 *
 * Core calculation engine for EVGuide's EV-native features:
 *  - Range confidence ("does this fit my commute?")
 *  - Total Cost of Ownership (TCO) vs comparable ICE car
 *  - Charging metrics (cost per charge, time estimates)
 *  - CO2 / environmental savings
 *
 * All monetary values in GBP. Range in miles. Energy in kWh.
 * Default assumptions reflect UK 2025/26 market conditions.
 */

import type { RangeConfidenceResult, TCOInputs, TCOResult } from "@/types";

// ── UK default constants ──────────────────────────────────────────────────────

/** Average UK domestic electricity rate (p/kWh, April 2026) */
export const DEFAULT_ENERGY_RATE_PENCE = 28;

/** Average UK public rapid charge rate (p/kWh, blended across networks) */
export const DEFAULT_PUBLIC_CHARGE_RATE_PENCE = 65;

/** Average UK petrol price per litre */
export const DEFAULT_FUEL_PRICE_GBP = 1.52;

/** Average UK annual car mileage */
export const DEFAULT_ANNUAL_MILES = 7500;

/** WLTP → real-world range discount factor (winter average) */
export const REAL_WORLD_FACTOR = 0.82;

/** Winter worst-case range factor */
export const WINTER_FACTOR = 0.70;

/** Average annual EV insurance estimate (mid-range EV, UK, 2026) */
export const AVG_EV_INSURANCE_GBP = 750;

/** Average annual EV servicing estimate (no oil changes) */
export const AVG_EV_SERVICING_GBP = 180;

/** VED rate for EVs priced over £40,000 (expensive car supplement) */
export const VED_EXPENSIVE_CAR_GBP = 190;

// ── Range Confidence ──────────────────────────────────────────────────────────

/**
 * Calculate whether an EV fits a user's daily commute.
 *
 * @param rangeKm  WLTP official range in km
 * @param dailyRoundTripMiles  Total daily round-trip distance in miles
 */
export function calcRangeConfidence(
  rangeKm: number,
  dailyRoundTripMiles: number,
): RangeConfidenceResult {
  const wltpMiles = Math.round(rangeKm * 0.621371);
  const realWorldMiles = Math.round(wltpMiles * REAL_WORLD_FACTOR);
  const winterMiles = Math.round(wltpMiles * WINTER_FACTOR);

  // Comfort buffer: 20% headroom above daily requirement
  const comfortableThreshold = dailyRoundTripMiles * 1.2;
  const comfortableYes = realWorldMiles >= comfortableThreshold;
  const seasonalCaution = !comfortableYes && winterMiles >= dailyRoundTripMiles;

  // Charges per week: how many full recharges needed based on real-world range
  const daysPerCharge = Math.floor(realWorldMiles / dailyRoundTripMiles);
  const chargesPerWeek = daysPerCharge > 0 ? Math.ceil(7 / daysPerCharge) : 7;

  let verdict: RangeConfidenceResult["verdict"];
  let verdictReason: string;

  if (comfortableYes) {
    verdict = "comfortable";
    verdictReason = `Real-world range (${realWorldMiles} mi) covers your ${dailyRoundTripMiles} mi commute with plenty to spare — even in winter.`;
  } else if (seasonalCaution) {
    verdict = "caution";
    verdictReason = `Fine most of the year, but winter range (${winterMiles} mi) is close to your ${dailyRoundTripMiles} mi commute. Home charging every night is recommended.`;
  } else {
    verdict = "tight";
    verdictReason = `Even in ideal conditions, the real-world range (${realWorldMiles} mi) may not comfortably cover your ${dailyRoundTripMiles} mi daily commute. Consider a longer-range model.`;
  }

  return {
    dailyMiles: dailyRoundTripMiles,
    wltpMiles,
    realWorldMiles,
    winterMiles,
    comfortableYes,
    seasonalCaution,
    chargesPerWeek,
    verdict,
    verdictReason,
  };
}

// ── Energy & Charging Cost ─────────────────────────────────────────────────────

/**
 * Estimate annual energy cost for an EV.
 *
 * @param batteryKWh   Usable battery capacity in kWh
 * @param rangeKm      WLTP range in km (used to derive efficiency)
 * @param annualMiles  Annual mileage in miles (default 7500)
 * @param energyRatePence  Home electricity rate in pence/kWh (default 28)
 * @param publicChargeMixPct  Percentage charged at public rapid chargers (default 20)
 */
export function calcAnnualEnergyCost(
  batteryKWh: number,
  rangeKm: number,
  annualMiles: number = DEFAULT_ANNUAL_MILES,
  energyRatePence: number = DEFAULT_ENERGY_RATE_PENCE,
  publicChargeMixPct: number = 20,
): number {
  const rangeMiles = rangeKm * 0.621371;
  const efficiencyMiPerKwh = rangeMiles / batteryKWh;
  const totalKwhNeeded = annualMiles / efficiencyMiPerKwh;

  const homePct = (100 - publicChargeMixPct) / 100;
  const publicPct = publicChargeMixPct / 100;

  const homeCost = totalKwhNeeded * homePct * (energyRatePence / 100);
  const publicCost = totalKwhNeeded * publicPct * (DEFAULT_PUBLIC_CHARGE_RATE_PENCE / 100);

  return Math.round((homeCost + publicCost) * 100) / 100;
}

/**
 * Cost per 100 miles in pence.
 */
export function calcCostPer100Miles(
  batteryKWh: number,
  rangeKm: number,
  energyRatePence: number = DEFAULT_ENERGY_RATE_PENCE,
): number {
  const rangeMiles = rangeKm * 0.621371;
  const efficiencyMiPerKwh = rangeMiles / batteryKWh;
  const kwhPer100Miles = 100 / efficiencyMiPerKwh;
  return Math.round(kwhPer100Miles * energyRatePence);
}

/**
 * Estimated full charge cost in £.
 */
export function calcFullChargeCostGbp(
  batteryKWh: number,
  energyRatePence: number = DEFAULT_ENERGY_RATE_PENCE,
): number {
  return Math.round(batteryKWh * (energyRatePence / 100) * 100) / 100;
}

// ── CO2 Savings ───────────────────────────────────────────────────────────────

/**
 * Annual CO2 saving vs average UK petrol car.
 *
 * Average UK petrol car: ~140g CO2/km (tailpipe).
 * UK grid electricity: ~180g CO2/kWh (2026, includes renewables mix).
 * Net EV CO2/km = (kWh per km) × grid intensity.
 *
 * @returns saving in kg CO2 per year
 */
export function calcCO2Saving(
  batteryKWh: number,
  rangeKm: number,
  annualMiles: number = DEFAULT_ANNUAL_MILES,
): number {
  const annualKm = annualMiles * 1.60934;
  const kwhPerKm = batteryKWh / rangeKm;

  // EV CO2: grid intensity 180g/kWh
  const evCo2GPerKm = kwhPerKm * 180;
  // ICE comparison: 140g/km tailpipe (avg UK petrol car)
  const iceCo2GPerKm = 140;

  const savingGPerKm = Math.max(0, iceCo2GPerKm - evCo2GPerKm);
  return Math.round((savingGPerKm * annualKm) / 1000); // kg
}

// ── Total Cost of Ownership ───────────────────────────────────────────────────

/**
 * Calculate 3-year Total Cost of Ownership for an EV vs a comparable ICE car.
 */
export function calcTCO(inputs: TCOInputs): TCOResult {
  const {
    vehiclePrice,
    batteryKWh,
    rangeKm,
    annualMiles = DEFAULT_ANNUAL_MILES,
    energyRatePence = DEFAULT_ENERGY_RATE_PENCE,
    publicChargeMixPct = 20,
    currentCarMpg,
    fuelPriceGbp = DEFAULT_FUEL_PRICE_GBP,
    financeTermMonths = 0,
    financeDeposit = 0,
    financeApr = 9.9,
  } = inputs;

  // Energy costs
  const annualEnergyCostGbp = calcAnnualEnergyCost(
    batteryKWh, rangeKm, annualMiles, energyRatePence, publicChargeMixPct,
  );
  const monthlyEnergyCostGbp = Math.round((annualEnergyCostGbp / 12) * 100) / 100;

  // Insurance: rough estimate based on vehicle price band
  const annualInsuranceEstGbp =
    vehiclePrice < 30000 ? 650 :
    vehiclePrice < 45000 ? 800 :
    1050;

  // Servicing: EVs have fewer service items (no oil, no exhaust, simpler brakes)
  const annualServicingEstGbp = 180;

  // VED: £0 for EVs ≤ £40k, £190/yr expensive car supplement for >£40k
  const annualVedGbp = vehiclePrice > 40000 ? VED_EXPENSIVE_CAR_GBP : 0;

  // Finance
  let monthlyFinanceGbp = 0;
  if (financeTermMonths > 0) {
    const principal = vehiclePrice - financeDeposit;
    const monthlyRate = financeApr / 100 / 12;
    if (monthlyRate > 0) {
      monthlyFinanceGbp = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, financeTermMonths)) /
        (Math.pow(1 + monthlyRate, financeTermMonths) - 1) * 100,
      ) / 100;
    } else {
      monthlyFinanceGbp = Math.round((principal / financeTermMonths) * 100) / 100;
    }
  }

  const totalMonthlyCostGbp = Math.round(
    (monthlyEnergyCostGbp + annualInsuranceEstGbp / 12 + annualServicingEstGbp / 12 + annualVedGbp / 12 + monthlyFinanceGbp) * 100,
  ) / 100;

  const total3YrCostGbp = Math.round(
    (financeDeposit + (monthlyFinanceGbp * financeTermMonths || 0)) +
    (annualEnergyCostGbp + annualInsuranceEstGbp + annualServicingEstGbp + annualVedGbp) * 3,
  );

  // ICE comparison
  let annualFuelCostIceGbp: number | null = null;
  let annualSavingVsIceGbp: number | null = null;
  let breakEvenMonths: number | null = null;

  if (currentCarMpg && currentCarMpg > 0) {
    // UK: 1 gallon = 4.546 litres
    const annualLitres = (annualMiles / currentCarMpg) * 4.546;
    annualFuelCostIceGbp = Math.round(annualLitres * fuelPriceGbp * 100) / 100;

    const iceAnnualTotal = annualFuelCostIceGbp + AVG_EV_INSURANCE_GBP + 450; // ICE servicing higher
    const evAnnualRunning = annualEnergyCostGbp + annualInsuranceEstGbp + annualServicingEstGbp + annualVedGbp;

    annualSavingVsIceGbp = Math.round((iceAnnualTotal - evAnnualRunning) * 100) / 100;
    breakEvenMonths = annualSavingVsIceGbp > 0
      ? Math.ceil((vehiclePrice / annualSavingVsIceGbp) * 12)
      : null;
  }

  const costPerMilePence = Math.round(calcCostPer100Miles(batteryKWh, rangeKm, energyRatePence) / 100 * 10) / 10;

  return {
    annualEnergyCostGbp,
    monthlyEnergyCostGbp,
    annualInsuranceEstGbp,
    annualServicingEstGbp,
    annualVedGbp,
    monthlyFinanceGbp,
    totalMonthlyCostGbp,
    total3YrCostGbp,
    annualFuelCostIceGbp,
    annualSavingVsIceGbp,
    breakEvenMonths,
    costPerMilePence,
  };
}

// ── Charge Speed Labels ───────────────────────────────────────────────────────

/** Human-readable label for DC charge speed */
export function dcChargingLabel(kw: number): string {
  if (kw >= 200) return "Ultra-rapid (200+ kW)";
  if (kw >= 100) return "Rapid (100–200 kW)";
  if (kw >= 50)  return "Fast (50–100 kW)";
  return "Slow (<50 kW)";
}

/** Human-readable label for AC home charge speed */
export function acChargingLabel(kw: number): string {
  if (kw >= 22) return "3-phase 22 kW";
  if (kw >= 11) return "7kW wallbox (overnight)";
  if (kw >= 7)  return "7 kW wallbox";
  return "Slow (3 kW granny cable)";
}

/** Estimate overnight charge time from empty to full in hours */
export function estimateOvernightChargeHours(batteryKWh: number, acKw: number): number {
  return Math.round((batteryKWh / acKw) * 10) / 10;
}

// ── Salary Sacrifice Estimate ─────────────────────────────────────────────────

/**
 * Rough salary sacrifice monthly net cost estimate.
 * BiK rate for EVs: 3% (2026/27 and 2027/28 confirmed by HMRC).
 *
 * @param p11dValue   P11D value (typically vehicle OTR price)
 * @param grossSalary Annual gross salary
 * @param taxBand     "basic" (20%), "higher" (40%), or "additional" (45%)
 */
export function calcSalarySacrificeMonthlyCost(
  p11dValue: number,
  grossSalary: number,
  taxBand: "basic" | "higher" | "additional" = "basic",
): { monthlyGrossCost: number; monthlyNetCost: number; annualSaving: number } {
  const bikRate = 0.03; // 3% confirmed through 2028
  const annualBikValue = p11dValue * bikRate;

  const taxRate = taxBand === "additional" ? 0.45 : taxBand === "higher" ? 0.40 : 0.20;
  const niRate = taxBand === "basic" ? 0.08 : 0.02; // simplified NI

  // Monthly gross cost of the sacrifice (personal contract hire equivalent)
  const monthlyGrossCost = Math.round((p11dValue * 0.008) * 100) / 100; // ~0.8% of P11D/mo typical PCH

  // Tax saving: user sacrifices gross salary, so saves income tax + NI on the sacrifice amount
  const monthlySacrifice = monthlyGrossCost;
  const monthlyTaxSaving = monthlySacrifice * (taxRate + niRate);
  const monthlyNetCost = Math.round((monthlySacrifice - monthlyTaxSaving) * 100) / 100;

  // BiK tax cost added back (small)
  const monthlyBikTax = Math.round((annualBikValue * taxRate) / 12 * 100) / 100;
  const finalNetCost = Math.round((monthlyNetCost + monthlyBikTax) * 100) / 100;

  const annualSaving = Math.round((monthlyGrossCost - finalNetCost) * 12 * 100) / 100;

  return {
    monthlyGrossCost,
    monthlyNetCost: finalNetCost,
    annualSaving,
  };
}
