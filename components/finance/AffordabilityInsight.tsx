import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { formatCurrency, getSafeImageSrc, type AffordabilityLevel } from "./financeUtils";
import type { EVModel } from "@/types";

interface RelatedOption {
  model: EVModel;
  monthlyPayment: number;
  ownershipCost: number;
}

interface AffordabilityInsightProps {
  affordabilityLevel: AffordabilityLevel;
  monthlyPayment: number;
  monthlyOwnershipCost: number;
  monthlyBudget: number;
  higherDepositSavings: number;
  bestValueOption: RelatedOption | null;
}

const insightMap = {
  Comfortable: {
    title: "Comfortable fit",
    body: "This EV appears affordable based on your selected monthly comfort zone. You have room to move without making the deal feel tight.",
    icon: CheckCircle2,
    tone: "border-emerald-400/20 bg-emerald-400/8 text-emerald-300",
  },
  Moderate: {
    title: "Moderate stretch",
    body: "This looks achievable, but it will be a visible monthly commitment. It is worth optimising the structure before you move forward.",
    icon: AlertCircle,
    tone: "border-cyan-400/20 bg-cyan-400/8 text-cyan-300",
  },
  Stretch: {
    title: "High monthly commitment",
    body: "This setup runs above your stated comfort zone, which makes it feel more like a pressure buy than a confident EV decision.",
    icon: ShieldAlert,
    tone: "border-amber-400/20 bg-amber-400/8 text-amber-200",
  },
};

export default function AffordabilityInsight({
  affordabilityLevel,
  monthlyPayment,
  monthlyOwnershipCost,
  monthlyBudget,
  higherDepositSavings,
  bestValueOption,
}: AffordabilityInsightProps) {
  const insight = insightMap[affordabilityLevel];
  const Icon = insight.icon;
  const budgetDifference = monthlyBudget - monthlyOwnershipCost;

  return (
    <aside className="xl:sticky xl:top-24">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,182,212,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8">
        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
          Affordability Insight
        </span>

        <div className={`mt-5 rounded-[1.6rem] border p-5 ${insight.tone}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-current/20 bg-black/20">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">AI reading of this finance structure</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-zinc-300">{insight.body}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          <MiniStat label="Target budget" value={formatCurrency(monthlyBudget)} />
          <MiniStat label="Finance only" value={formatCurrency(monthlyPayment)} />
          <MiniStat
            label={budgetDifference >= 0 ? "Monthly headroom" : "Over budget"}
            value={formatCurrency(Math.abs(budgetDifference))}
          />
        </div>

        <div className="mt-6 rounded-[1.6rem] border border-white/8 bg-black/20 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-sm font-medium text-white">Smart guidance</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                A higher deposit could cut your monthly ownership cost by about{" "}
                <span className="font-semibold text-white">
                  {formatCurrency(higherDepositSavings)}
                </span>{" "}
                per month. That is often the cleanest way to improve comfort without
                compromising on the EV itself.
              </p>
            </div>
          </div>
        </div>

        {bestValueOption ? (
          <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/20">
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${getSafeImageSrc(bestValueOption.model.heroImage)})` }}
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Best finance-friendly EV option
              </p>
              <h4 className="mt-3 text-xl font-semibold text-white">
                {bestValueOption.model.brand} {bestValueOption.model.model}
              </h4>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniStat label="Estimated monthly" value={formatCurrency(bestValueOption.ownershipCost)} />
                <MiniStat label="Range" value={`${bestValueOption.model.rangeKm} km`} />
              </div>
              <Link
                href={`/cars/${bestValueOption.model.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-emerald-300"
              >
                View details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
