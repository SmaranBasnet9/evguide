"use client";

import { useMemo, useState } from "react";
import { bankOffers } from "@/data/bankOffers";
import type { EVModel } from "@/types";
import AffordabilityInsight from "./AffordabilityInsight";
import BestNextMove from "./BestNextMove";
import FinanceCTA from "./FinanceCTA";
import FinanceEnquiryFlow from "./FinanceEnquiryFlow";
import FinanceHero from "./FinanceHero";
import FinanceScenarioCards from "./FinanceScenarioCards";
import RelatedBudgetEVs from "./RelatedBudgetEVs";
import {
  buildScenario,
  calculateFinanceEnquirySummary,
  calculateFinanceMetrics,
  clamp,
  estimateRunningCost,
  formatCurrency,
  getAffordabilityLevel,
  parsePercentageValue,
} from "./financeUtils";

interface FinanceDashboardProps {
  initialCarId: string;
  allModels: EVModel[];
}

export default function FinanceDashboard({ initialCarId, allModels }: FinanceDashboardProps) {
  const sortedBanks = useMemo(
    () => [...bankOffers].sort((a, b) => a.interestRate - b.interestRate),
    [],
  );
  const fallbackVehicle = useMemo(
    () => allModels.find((model) => model.id === initialCarId) ?? allModels[0] ?? null,
    [allModels, initialCarId],
  );

  const [selectedBankId, setSelectedBankId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialCarId || allModels[0]?.id || "");
  const [carPrice, setCarPrice] = useState(fallbackVehicle?.price ?? 42990);
  const [deposit, setDeposit] = useState(
    fallbackVehicle ? Math.round(fallbackVehicle.price * 0.15) : 6000,
  );
  const [termYears, setTermYears] = useState(4);
  const [monthlyBudget, setMonthlyBudget] = useState(675);
  const [includeBalloonPayment, setIncludeBalloonPayment] = useState(false);
  const [balloonPercent, setBalloonPercent] = useState(20);
  const [insuranceCostOverride, setInsuranceCostOverride] = useState<number | null>(null);
  const [processingFeeOverride, setProcessingFeeOverride] = useState<number | null>(null);

  const selectedBank = useMemo(
    () => sortedBanks.find((bank) => bank.id === selectedBankId) ?? null,
    [selectedBankId, sortedBanks],
  );
  const apr = selectedBank?.interestRate ?? sortedBanks[0]?.interestRate ?? 6.9;
  const selectedVehicle = useMemo(
    () => allModels.find((model) => model.id === selectedVehicleId) ?? fallbackVehicle,
    [allModels, fallbackVehicle, selectedVehicleId],
  );

  const balloonPayment = includeBalloonPayment ? Math.round(carPrice * (balloonPercent / 100)) : 0;
  const financeMetrics = useMemo(
    () =>
      calculateFinanceMetrics({
        carPrice,
        deposit,
        apr,
        termYears,
        balloonPayment,
      }),
    [apr, balloonPayment, carPrice, deposit, termYears],
  );

  const baseRunningCost = useMemo(
    () => estimateRunningCost(selectedVehicle, carPrice),
    [carPrice, selectedVehicle],
  );
  const insuranceCost = insuranceCostOverride ?? Math.round(baseRunningCost.insurance);
  const runningCost = useMemo(
    () => ({
      ...baseRunningCost,
      insurance: insuranceCost,
      totalMonthly: baseRunningCost.charging + insuranceCost + baseRunningCost.maintenance,
    }),
    [baseRunningCost, insuranceCost],
  );

  const recommendedProcessingFee = useMemo(() => {
    const processingFeePercent = selectedBank ? parsePercentageValue(selectedBank.processingFee) : 0;
    return Math.round(financeMetrics.loanAmount * (processingFeePercent / 100));
  }, [financeMetrics.loanAmount, selectedBank]);
  const processingFee = processingFeeOverride ?? recommendedProcessingFee;
  const enquirySummary = useMemo(
    () =>
      calculateFinanceEnquirySummary({
        carPrice,
        deposit,
        apr,
        termYears,
        insuranceCost,
        processingFeeAmount: processingFee,
        balloonPayment,
      }),
    [apr, balloonPayment, carPrice, deposit, insuranceCost, processingFee, termYears],
  );

  const monthlyOwnershipCost = financeMetrics.monthlyPayment + runningCost.totalMonthly;
  const affordabilityLevel = getAffordabilityLevel(monthlyOwnershipCost, monthlyBudget);
  const budgetGap = monthlyBudget - monthlyOwnershipCost;

  const higherDepositScenario = buildScenario(
    carPrice,
    clamp(deposit + 2000, 0, carPrice),
    apr,
    termYears,
    runningCost.totalMonthly,
    balloonPayment,
  );

  const relatedEVs = useMemo(() => {
    const depositRate = carPrice > 0 ? deposit / carPrice : 0.15;

    return allModels
      .filter((model) => model.id !== selectedVehicleId)
      .map((model) => {
        const estimatedDeposit = Math.round(model.price * depositRate);
        const metrics = calculateFinanceMetrics({
          carPrice: model.price,
          deposit: estimatedDeposit,
          apr,
          termYears,
        });
        const monthlyOwnership =
          metrics.monthlyPayment + estimateRunningCost(model, model.price).totalMonthly;

        return {
          model,
          monthlyPayment: metrics.monthlyPayment,
          ownershipCost: monthlyOwnership,
          affordabilityDelta: Math.abs(monthlyOwnership - monthlyBudget),
        };
      })
      .sort((a, b) => {
        const aWithinBudget = a.ownershipCost <= monthlyBudget ? 0 : 1;
        const bWithinBudget = b.ownershipCost <= monthlyBudget ? 0 : 1;

        if (aWithinBudget !== bWithinBudget) return aWithinBudget - bWithinBudget;
        return a.affordabilityDelta - b.affordabilityDelta;
      })
      .slice(0, 3);
  }, [allModels, apr, carPrice, deposit, monthlyBudget, selectedVehicleId, termYears]);

  const bestValueOption = relatedEVs[0] ?? null;

  const nextMoves = useMemo(() => {
    const moves = [];

    if (budgetGap < 0) {
      moves.push({
        title: `Increase deposit by ${formatCurrency(2000)}`,
        description: `That would bring this setup down by roughly ${formatCurrency(
          monthlyOwnershipCost - higherDepositScenario.ownershipCost,
        )} per month without changing vehicle.`,
        href: "/finance",
        cta: "Optimise this setup",
        icon: "deposit" as const,
      });
    }

    if (bestValueOption) {
      moves.push({
        title: `Consider ${bestValueOption.model.brand} ${bestValueOption.model.model}`,
        description: `This looks like the strongest finance-friendly alternative near your target, at about ${formatCurrency(
          bestValueOption.ownershipCost,
        )} per month all-in.`,
        href: `/cars/${bestValueOption.model.id}`,
        cta: "View details",
        icon: "compare" as const,
      });
    }

    moves.push({
      title: "Get matched with real dealer offers",
      description:
        "Turn this estimate into action with live dealer pricing, availability, and a better sense of whether this payment is achievable now.",
      href: "/recommend",
      cta: "Start AI match",
      icon: "ai" as const,
    });

    return moves.slice(0, 3);
  }, [bestValueOption, budgetGap, higherDepositScenario.ownershipCost, monthlyOwnershipCost]);

  return (
    <>
      <FinanceHero
        selectedVehicle={selectedVehicle}
        carPrice={carPrice}
        deposit={deposit}
        termYears={termYears}
        monthlyPayment={financeMetrics.monthlyPayment}
        affordabilityLevel={affordabilityLevel}
        monthlyOwnershipCost={monthlyOwnershipCost}
      />

      <section className="relative z-10 -mt-12 bg-[#090C0E] pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <FinanceEnquiryFlow
              banks={sortedBanks}
              allModels={allModels}
              selectedBank={selectedBank}
              selectedBankId={selectedBankId}
              onSelectBank={(bankId) => {
                const nextBank = sortedBanks.find((bank) => bank.id === bankId) ?? null;
                setSelectedBankId(bankId);
                setProcessingFeeOverride(null);
                if (nextBank && termYears > nextBank.maxTenureYears) {
                  setTermYears(nextBank.maxTenureYears);
                }
              }}
              selectedVehicle={selectedVehicle}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={(vehicleId) => {
                setSelectedVehicleId(vehicleId);
                const nextVehicle = allModels.find((model) => model.id === vehicleId);
                if (nextVehicle) {
                  setCarPrice(nextVehicle.price);
                  setDeposit(Math.round(nextVehicle.price * 0.15));
                }
                setInsuranceCostOverride(null);
                setProcessingFeeOverride(null);
              }}
              carPrice={carPrice}
              onCarPriceChange={(value) => setCarPrice(Math.max(0, value))}
              deposit={deposit}
              onDepositChange={(value) => setDeposit(clamp(value, 0, carPrice))}
              insuranceCost={insuranceCost}
              onInsuranceCostChange={(value) => setInsuranceCostOverride(Math.max(0, value))}
              onResetInsuranceCost={() => setInsuranceCostOverride(null)}
              processingFee={processingFee}
              recommendedProcessingFee={recommendedProcessingFee}
              onProcessingFeeChange={(value) => setProcessingFeeOverride(Math.max(0, value))}
              onResetProcessingFee={() => setProcessingFeeOverride(null)}
              termYears={termYears}
              onTermYearsChange={setTermYears}
              apr={apr}
              monthlyBudget={monthlyBudget}
              onMonthlyBudgetChange={(value) => setMonthlyBudget(Math.max(0, value))}
              includeBalloonPayment={includeBalloonPayment}
              onIncludeBalloonPaymentChange={setIncludeBalloonPayment}
              balloonPercent={balloonPercent}
              onBalloonPercentChange={setBalloonPercent}
              summary={enquirySummary}
              runningCost={runningCost}
              monthlyOwnershipCost={monthlyOwnershipCost}
              onResetSelections={() => {
                setSelectedBankId("");
                setSelectedVehicleId(initialCarId || allModels[0]?.id || "");
                setCarPrice(fallbackVehicle?.price ?? 42990);
                setDeposit(fallbackVehicle ? Math.round(fallbackVehicle.price * 0.15) : 6000);
                setTermYears(4);
                setMonthlyBudget(675);
                setIncludeBalloonPayment(false);
                setBalloonPercent(20);
                setInsuranceCostOverride(null);
                setProcessingFeeOverride(null);
              }}
            />
            <AffordabilityInsight
              affordabilityLevel={affordabilityLevel}
              monthlyPayment={financeMetrics.monthlyPayment}
              monthlyOwnershipCost={monthlyOwnershipCost}
              monthlyBudget={monthlyBudget}
              higherDepositSavings={monthlyOwnershipCost - higherDepositScenario.ownershipCost}
              bestValueOption={bestValueOption}
            />
          </div>
        </div>
      </section>

      <FinanceScenarioCards
        carPrice={carPrice}
        currentDeposit={deposit}
        termYears={termYears}
        apr={apr}
        monthlyBudget={monthlyBudget}
        runningCostMonthly={runningCost.totalMonthly}
        includeBalloonPayment={includeBalloonPayment}
        balloonPercent={balloonPercent}
      />

      <BestNextMove moves={nextMoves} />

      <RelatedBudgetEVs models={relatedEVs} />

      <FinanceCTA />
    </>
  );
}
