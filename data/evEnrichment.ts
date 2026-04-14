/**
 * EV-native intelligence overlay for existing EV models.
 *
 * This file maps model IDs to their EV-specific data points that are not
 * captured in the base evModels definition: charge port type, AC/DC speeds,
 * charge time, battery warranty, V2G capability, etc.
 *
 * Source: Official manufacturer specs for UK market (2025/26 model year).
 * All range figures in miles. Charge speeds in kW.
 */

export interface EVEnrichmentData {
  chargingSpeedAcKw: number;
  chargingSpeedDcKw: number;
  chargePortType: string;       // CCS | CHAdeMO | NACS | Type2
  chargeTimeTo80Mins: number;
  batteryWarrantyYears: number;
  v2gCapable: boolean;
}

/** Record<vehicle_id, enrichment data> */
export const evEnrichmentMap: Record<string, EVEnrichmentData> = {
  // ── BYD ────────────────────────────────────────────────────
  "byd-atto-3": {
    chargingSpeedAcKw: 7,
    chargingSpeedDcKw: 80,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 30,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "byd-dolphin": {
    chargingSpeedAcKw: 7,
    chargingSpeedDcKw: 60,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 35,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "byd-sealion-7": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 150,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 24,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "byd-seal": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 150,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 26,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "byd-tang": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 110,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 35,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Tesla ───────────────────────────────────────────────────
  "tesla-model-3": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 170,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 25,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "tesla-model-y": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 250,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 20,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "tesla-model-s": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 250,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 20,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "tesla-model-x": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 250,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 20,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Kia ─────────────────────────────────────────────────────
  "kia-ev6": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 233,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 18,
    batteryWarrantyYears: 7,
    v2gCapable: false,
  },
  "kia-ev9": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 233,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 24,
    batteryWarrantyYears: 7,
    v2gCapable: true,
  },
  "kia-niro-ev": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 100,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 43,
    batteryWarrantyYears: 7,
    v2gCapable: false,
  },

  // ── Hyundai ─────────────────────────────────────────────────
  "hyundai-ioniq-5": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 233,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 18,
    batteryWarrantyYears: 8,
    v2gCapable: true,
  },
  "hyundai-ioniq-6": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 233,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 18,
    batteryWarrantyYears: 8,
    v2gCapable: true,
  },
  "hyundai-kona-electric": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 100,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 41,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── BMW ─────────────────────────────────────────────────────
  "bmw-i4": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 205,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 31,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "bmw-ix": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 200,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 35,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "bmw-i7": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 195,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 34,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Volkswagen ───────────────────────────────────────────────
  "vw-id4": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 135,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 28,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "vw-id3": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 135,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 28,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "volkswagen-id4": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 135,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 28,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "volkswagen-id3": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 135,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 28,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Volvo ────────────────────────────────────────────────────
  "volvo-ex30": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 153,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 26,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "volvo-xc40-recharge": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 150,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 27,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "volvo-c40-recharge": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 150,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 27,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── MG ──────────────────────────────────────────────────────
  "mg4": {
    chargingSpeedAcKw: 6.6,
    chargingSpeedDcKw: 135,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 35,
    batteryWarrantyYears: 7,
    v2gCapable: false,
  },
  "mg-zs-ev": {
    chargingSpeedAcKw: 7,
    chargingSpeedDcKw: 76,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 40,
    batteryWarrantyYears: 7,
    v2gCapable: false,
  },
  "mg5-electric": {
    chargingSpeedAcKw: 7,
    chargingSpeedDcKw: 87,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 40,
    batteryWarrantyYears: 7,
    v2gCapable: false,
  },

  // ── Polestar ─────────────────────────────────────────────────
  "polestar-2": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 205,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 28,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "polestar-3": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 250,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 30,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Audi ─────────────────────────────────────────────────────
  "audi-q4-etron": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 135,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 28,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "audi-etron-gt": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 270,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 22,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Nissan ───────────────────────────────────────────────────
  "nissan-leaf": {
    chargingSpeedAcKw: 7.4,
    chargingSpeedDcKw: 50,
    chargePortType: "CHAdeMO",
    chargeTimeTo80Mins: 60,
    batteryWarrantyYears: 8,
    v2gCapable: true,
  },
  "nissan-ariya": {
    chargingSpeedAcKw: 22,
    chargingSpeedDcKw: 130,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 30,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Omoda ────────────────────────────────────────────────────
  "omoda-e5": {
    chargingSpeedAcKw: 6.6,
    chargingSpeedDcKw: 80,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 28,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Mercedes ─────────────────────────────────────────────────
  "mercedes-eqa": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 100,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 32,
    batteryWarrantyYears: 10,
    v2gCapable: false,
  },
  "mercedes-eqb": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 100,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 32,
    batteryWarrantyYears: 10,
    v2gCapable: false,
  },

  // ── Renault ──────────────────────────────────────────────────
  "renault-megane-etech": {
    chargingSpeedAcKw: 22,
    chargingSpeedDcKw: 130,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 30,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },

  // ── Stellantis / Vauxhall / Peugeot ─────────────────────────
  "vauxhall-astra-electric": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 100,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 35,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
  "peugeot-e208": {
    chargingSpeedAcKw: 11,
    chargingSpeedDcKw: 100,
    chargePortType: "CCS",
    chargeTimeTo80Mins: 30,
    batteryWarrantyYears: 8,
    v2gCapable: false,
  },
};

/**
 * Get enrichment data for a vehicle by ID.
 * Returns null if no specific data is available.
 */
export function getEvEnrichment(vehicleId: string): EVEnrichmentData | null {
  return evEnrichmentMap[vehicleId] ?? null;
}

/**
 * Apply enrichment data to a partial EVModel object.
 * Computes derived fields (rangeMiles, realWorldRangeMiles, annualEnergyCostGbp, co2SavingKgPerYear)
 * from base fields.
 */
export function applyEvEnrichment<
  T extends {
    id: string;
    rangeKm: number;
    batteryKWh: number;
    price: number;
    chargingSpeedAcKw?: number;
    chargingSpeedDcKw?: number;
    chargePortType?: string;
    chargeTimeTo80Mins?: number;
    batteryWarrantyYears?: number;
    v2gCapable?: boolean;
    rangeMiles?: number;
    realWorldRangeMiles?: number;
    annualEnergyCostGbp?: number;
    co2SavingKgPerYear?: number;
  },
>(vehicle: T): T {
  const enrichment = getEvEnrichment(vehicle.id);

  // WLTP miles
  const rangeMiles = vehicle.rangeMiles ?? Math.round(vehicle.rangeKm * 0.621371);
  // Real world: 82% of WLTP (accounts for motorway driving, cold weather average)
  const realWorldRangeMiles = vehicle.realWorldRangeMiles ?? Math.round(rangeMiles * 0.82);

  // Annual energy cost: 7500 mi/yr ÷ (WLTP miles / battery kWh) × £0.28
  const efficiencyMiPerKwh = rangeMiles / vehicle.batteryKWh;
  const annualEnergyCostGbp =
    vehicle.annualEnergyCostGbp ??
    Math.round((7500 / efficiencyMiPerKwh) * 0.28 * 100) / 100;

  // CO2 saving: avg UK petrol car ~140g CO2/km × 7500 miles × 1.609 km/mi ÷ 1000 = kg
  // EV grid CO2 ~50g/km equivalent. Net saving ≈ 90g CO2/km
  const co2SavingKgPerYear =
    vehicle.co2SavingKgPerYear ??
    Math.round((7500 * 1.60934 * 0.09));  // 90g/km in kg

  return {
    ...vehicle,
    ...(enrichment ?? {}),
    rangeMiles,
    realWorldRangeMiles,
    annualEnergyCostGbp,
    co2SavingKgPerYear,
  };
}
