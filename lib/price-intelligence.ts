import { evModels } from "@/data/evModels";
import type { EVModel, PriceCategory, PriceIntelligence } from "@/types";

export type { PriceCategory, PriceIntelligence };

let _brandAverages: Record<string, number> | null = null;

export function computeBrandAverages(): Record<string, number> {
  if (_brandAverages) return _brandAverages;

  const totals: Record<string, { sum: number; count: number }> = {};

  for (const model of evModels) {
    if (!model.price || model.price === 0) continue;
    if (!totals[model.brand]) {
      totals[model.brand] = { sum: 0, count: 0 };
    }
    totals[model.brand].sum += model.price;
    totals[model.brand].count += 1;
  }

  const averages: Record<string, number> = {};
  for (const [brand, { sum, count }] of Object.entries(totals)) {
    averages[brand] = sum / count;
  }

  _brandAverages = averages;
  return _brandAverages;
}

export function getPriceIntelligence(vehicle: EVModel): PriceIntelligence | null {
  if (!vehicle.price || vehicle.price === 0) return null;

  const brandCounts: Record<string, number> = {};
  for (const model of evModels) {
    if (!model.price || model.price === 0) continue;
    brandCounts[model.brand] = (brandCounts[model.brand] ?? 0) + 1;
  }

  if ((brandCounts[vehicle.brand] ?? 0) <= 1) return null;

  const averages = computeBrandAverages();
  const brandAvg = averages[vehicle.brand];
  if (!brandAvg) return null;

  const pct = Math.round(((vehicle.price - brandAvg) / brandAvg) * 1000) / 10;

  let category: PriceCategory;
  let label: string;
  let description: string;

  if (pct < -8) {
    category = "great_deal";
    label = "Great Deal";
    description = `Priced ${Math.abs(pct)}% below the ${vehicle.brand} average — exceptional value.`;
  } else if (pct < -3) {
    category = "good_deal";
    label = "Good Deal";
    description = `Priced ${Math.abs(pct)}% below the ${vehicle.brand} average — good value.`;
  } else if (pct <= 3) {
    category = "fair_price";
    label = "Fair Price";
    description = `Priced within 3% of the ${vehicle.brand} average — typical market rate.`;
  } else {
    category = "above_average";
    label = "Above Average";
    description = `Priced ${pct}% above the ${vehicle.brand} average.`;
  }

  return {
    category,
    label,
    percentageFromAvg: pct,
    brandAveragePriceGbp: Math.round(brandAvg),
    description,
  };
}
