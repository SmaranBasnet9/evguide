import type { EVModel } from "@/types";

export type AffordabilityLevel = "Comfortable" | "Moderate" | "Stretch";

export interface FinanceMetrics {
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayable: number;
  balloonPayment: number;
}

export interface RunningCostEstimate {
  charging: number;
  insurance: number;
  maintenance: number;
  totalMonthly: number;
}

export interface FinanceScenario {
  deposit: number;
  monthlyPayment: number;
  ownershipCost: number;
  totalInterest: number;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateFinanceMetrics({
  carPrice,
  deposit,
  apr,
  termYears,
  balloonPayment = 0,
}: {
  carPrice: number;
  deposit: number;
  apr: number;
  termYears: number;
  balloonPayment?: number;
}): FinanceMetrics {
  const safePrice = Math.max(carPrice, 0);
  const safeDeposit = clamp(deposit, 0, safePrice);
  const loanAmount = Math.max(0, safePrice - safeDeposit);
  const months = Math.max(termYears * 12, 1);
  const monthlyRate = apr / 100 / 12;
  const safeBalloon = clamp(balloonPayment, 0, loanAmount);

  let monthlyPayment = 0;

  if (loanAmount > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = (loanAmount - safeBalloon) / months;
    } else {
      const discountedBalloon = safeBalloon / Math.pow(1 + monthlyRate, months);
      monthlyPayment =
        ((loanAmount - discountedBalloon) * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -months));
    }
  }

  const totalRepayable = safeDeposit + monthlyPayment * months + safeBalloon;
  const totalInterest = Math.max(0, totalRepayable - safePrice);

  return {
    loanAmount,
    monthlyPayment,
    totalInterest,
    totalRepayable,
    balloonPayment: safeBalloon,
  };
}

export function estimateRunningCost(model: EVModel | null, carPrice: number): RunningCostEstimate {
  const averageMonthlyMiles = 780;
  const electricityPerKwh = 0.24;
  const priceAnchor = Math.max(carPrice, 26000);

  const efficiencyKwhPerKm = model
    ? model.batteryKWh / Math.max(model.rangeKm, 1)
    : 0.17;
  const averageMonthlyKm = averageMonthlyMiles * 1.60934;
  const charging = averageMonthlyKm * efficiencyKwhPerKm * electricityPerKwh;
  const insurance = priceAnchor * 0.0135 / 12 + 28;
  const maintenance = priceAnchor * 0.0022 / 12 + 24;

  return {
    charging,
    insurance,
    maintenance,
    totalMonthly: charging + insurance + maintenance,
  };
}

export function getAffordabilityLevel(
  monthlyOwnershipCost: number,
  monthlyBudget: number,
): AffordabilityLevel {
  const safeBudget = Math.max(monthlyBudget, 1);
  const ratio = monthlyOwnershipCost / safeBudget;

  if (ratio <= 0.85) return "Comfortable";
  if (ratio <= 1.05) return "Moderate";
  return "Stretch";
}

export function buildScenario(
  carPrice: number,
  deposit: number,
  apr: number,
  termYears: number,
  runningCostMonthly: number,
  balloonPayment = 0,
): FinanceScenario {
  const metrics = calculateFinanceMetrics({
    carPrice,
    deposit,
    apr,
    termYears,
    balloonPayment,
  });

  return {
    deposit,
    monthlyPayment: metrics.monthlyPayment,
    ownershipCost: metrics.monthlyPayment + runningCostMonthly,
    totalInterest: metrics.totalInterest,
  };
}

export function getSafeImageSrc(heroImage: string) {
  if (
    heroImage.includes("topgear.com") ||
    heroImage.includes("images.unsplash.com") ||
    heroImage.includes("supabase.co")
  ) {
    return heroImage;
  }

  return "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80";
}
