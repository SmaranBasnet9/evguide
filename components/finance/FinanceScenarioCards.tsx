import { Check, Sparkles } from "lucide-react";
import { buildScenario, formatCurrency } from "./financeUtils";

interface FinanceScenarioCardsProps {
  carPrice: number;
  currentDeposit: number;
  termYears: number;
  apr: number;
  monthlyBudget: number;
  runningCostMonthly: number;
  includeBalloonPayment: boolean;
  balloonPercent: number;
}

export default function FinanceScenarioCards({
  carPrice,
  currentDeposit,
  termYears,
  apr,
  monthlyBudget,
  runningCostMonthly,
  includeBalloonPayment,
  balloonPercent,
}: FinanceScenarioCardsProps) {
  const baseBalloon = includeBalloonPayment ? Math.round(carPrice * (balloonPercent / 100)) : 0;
  const scenarioDefs = [
    {
      title: "Lower deposit",
      label: "Higher monthly",
      deposit: Math.max(0, currentDeposit - 2500),
      description: "Keeps more cash free today, but increases the monthly commitment.",
    },
    {
      title: "Balanced deposit",
      label: "Best mix",
      deposit: currentDeposit,
      description: "A middle-ground setup that usually feels more sustainable month to month.",
    },
    {
      title: "Higher deposit",
      label: "Lower monthly",
      deposit: Math.min(carPrice, currentDeposit + 2500),
      description: "Requires more upfront cash, but lowers the payment pressure over the term.",
    },
  ];

  const scenarios = scenarioDefs.map((scenario) => ({
    ...scenario,
    values: buildScenario(
      carPrice,
      scenario.deposit,
      apr,
      termYears,
      runningCostMonthly,
      baseBalloon,
    ),
  }));

  const recommendedIndex = scenarios.reduce((bestIndex, scenario, index, items) => {
    const currentDistance = Math.abs(scenario.values.ownershipCost - monthlyBudget);
    const bestDistance = Math.abs(items[bestIndex].values.ownershipCost - monthlyBudget);
    const currentPenalty = scenario.values.ownershipCost > monthlyBudget ? 40 : 0;
    const bestPenalty = items[bestIndex].values.ownershipCost > monthlyBudget ? 40 : 0;

    return currentDistance + currentPenalty < bestDistance + bestPenalty ? index : bestIndex;
  }, 0);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
            Finance Comparison
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Compare the trade-offs before you commit.
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-500">
            Three clear scenarios make it easier to see how a deposit change affects both the
            payment and the full monthly ownership picture.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {scenarios.map((scenario, index) => {
            const isRecommended = index === recommendedIndex;

            return (
              <article
                key={scenario.title}
                className={`relative rounded-[2rem] border p-6 transition duration-300 ${
                  isRecommended
                    ? "border-cyan-200 bg-cyan-50 shadow-md"
                    : "border-gray-200 bg-white hover:-translate-y-1 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {isRecommended ? (
                  <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Recommended
                  </div>
                ) : null}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                    {scenario.label}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-gray-900">{scenario.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{scenario.description}</p>
                </div>

                <div className="mt-6 grid gap-3">
                  <Row label="Deposit" value={formatCurrency(scenario.deposit)} />
                  <Row label="Monthly payment" value={formatCurrency(scenario.values.monthlyPayment)} />
                  <Row
                    label="Monthly ownership"
                    value={formatCurrency(scenario.values.ownershipCost)}
                  />
                  <Row label="Total interest" value={formatCurrency(scenario.values.totalInterest)} />
                </div>

                <div className="mt-6 rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <p className="text-sm leading-6 text-gray-500">
                      {scenario.values.ownershipCost <= monthlyBudget
                        ? "Fits inside your stated comfort budget."
                        : `Runs about ${formatCurrency(
                            scenario.values.ownershipCost - monthlyBudget,
                          )} above your comfort target.`}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
