"use client";

import { useMemo, useState } from "react";
import AffordabilityInsight from "./AffordabilityInsight";
import BestNextMove from "./BestNextMove";
import FinanceCalculator from "./FinanceCalculator";
import FinanceCTA from "./FinanceCTA";
import FinanceHero from "./FinanceHero";
import FinanceScenarioCards from "./FinanceScenarioCards";
import RelatedBudgetEVs from "./RelatedBudgetEVs";
import {
  buildScenario,
  calculateFinanceMetrics,
  clamp,
  estimateRunningCost,
  formatCurrency,
  getAffordabilityLevel,
} from "./financeUtils";
import type { EVModel } from "@/types";

interface FinanceDashboardProps {
  initialCarId: string;
  allModels: EVModel[];
}

export default function FinanceDashboard({ initialCarId, allModels }: FinanceDashboardProps) {
  const fallbackVehicle = useMemo(
    () => allModels.find((model) => model.id === initialCarId) ?? allModels[0] ?? null,
    [allModels, initialCarId],
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState(initialCarId || allModels[0]?.id || "");
  const [carPrice, setCarPrice] = useState(fallbackVehicle?.price ?? 42990);
  const [deposit, setDeposit] = useState(
    fallbackVehicle ? Math.round(fallbackVehicle.price * 0.15) : 6000,
  );
  const [termYears, setTermYears] = useState(4);
  const [apr, setApr] = useState(6.9);
  const [monthlyBudget, setMonthlyBudget] = useState(675);
  const [includeBalloonPayment, setIncludeBalloonPayment] = useState(false);
  const [balloonPercent, setBalloonPercent] = useState(20);

  const selectedVehicle = useMemo(
    () => allModels.find((model) => model.id === selectedVehicleId) ?? fallbackVehicle,
    [allModels, fallbackVehicle, selectedVehicleId],
  );

  const balloonPayment = includeBalloonPayment
    ? Math.round(carPrice * (balloonPercent / 100))
    : 0;
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
  const runningCost = useMemo(
    () => estimateRunningCost(selectedVehicle, carPrice),
    [carPrice, selectedVehicle],
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
            <FinanceCalculator
              allModels={allModels}
              selectedVehicleId={selectedVehicleId}
              onVehicleSelect={(nextId) => {
                setSelectedVehicleId(nextId);
                const nextVehicle = allModels.find((model) => model.id === nextId);
                if (nextVehicle) {
                  setCarPrice(nextVehicle.price);
                  setDeposit(Math.round(nextVehicle.price * 0.15));
                }
              }}
              carPrice={carPrice}
              setCarPrice={(value) => setCarPrice(Math.max(0, value))}
              deposit={deposit}
              setDeposit={(value) => setDeposit(clamp(value, 0, carPrice))}
              termYears={termYears}
              setTermYears={setTermYears}
              apr={apr}
              setApr={setApr}
              monthlyBudget={monthlyBudget}
              setMonthlyBudget={setMonthlyBudget}
              includeBalloonPayment={includeBalloonPayment}
              setIncludeBalloonPayment={setIncludeBalloonPayment}
              balloonPercent={balloonPercent}
              setBalloonPercent={setBalloonPercent}
              financeMetrics={financeMetrics}
              runningCost={runningCost}
              monthlyOwnershipCost={monthlyOwnershipCost}
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
