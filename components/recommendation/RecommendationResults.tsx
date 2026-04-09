"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CarFront, HandCoins, Sparkles } from "lucide-react";
import RecommendationCard from "./RecommendationCard";
import type { MatchAnswers, MatchResult } from "./recommendationEngine";

interface RecommendationResultsProps {
  results: MatchResult[];
  answers: MatchAnswers;
  onReset: () => void;
}

const answerLabels = {
  budget: {
    under_30: "Under GBP30k",
    under_40: "Under GBP40k",
    under_55: "Under GBP55k",
    open: "Open budget",
  },
  mileage: {
    city: "Mostly city",
    balanced: "Mixed driving",
    long_range: "Long distance",
  },
  charging: {
    home: "Home charging",
    public: "Public network",
    work: "Workplace charging",
    unsure: "Still deciding",
  },
  bodyType: {
    suv: "SUV or crossover",
    hatchback: "Hatchback",
    sedan: "Sedan",
    any: "Flexible body type",
  },
  priority: {
    value: "Best value",
    range: "Long range",
    tech: "Tech and software",
    family: "Family practicality",
    performance: "Performance feel",
  },
  condition: {
    new: "New only",
    used: "Used is fine",
    either: "Open to both",
  },
};

export default function RecommendationResults({ results, answers, onReset }: RecommendationResultsProps) {
  return (
    <section className="bg-[#07090B] pb-24 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,185,129,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                AI Match Results
              </span>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Your top 3 EV matches are ready.
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-300">
                We narrowed the shortlist to the three strongest fits so the decision feels simpler,
                more confident, and easier to act on.
              </p>
              <div className="mt-5 rounded-[1.5rem] border border-emerald-400/15 bg-emerald-400/[0.06] px-5 py-4 text-sm leading-7 text-zinc-200">
                Your top result fits your daily commute, charging setup, and budget more comfortably than the rest of the shortlist.
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Retake AI Match
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <SummaryPill label="Budget" value={answerLabels.budget[answers.budget]} />
            <SummaryPill label="Driving" value={answerLabels.mileage[answers.mileage]} />
            <SummaryPill label="Charging" value={answerLabels.charging[answers.charging]} />
            <SummaryPill label="Body type" value={answerLabels.bodyType[answers.bodyType]} />
            <SummaryPill label="Priority" value={answerLabels.priority[answers.priority]} />
            <SummaryPill label="Condition" value={answerLabels.condition[answers.condition]} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {results.map((result, index) => (
            <RecommendationCard key={result.model.id} result={result} index={index} />
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:grid-cols-3 md:p-8">
          <ActionCard
            href={`/compare?carA=${results[0]?.model.id ?? ""}&carB=${results[1]?.model.id ?? ""}`}
            title="Compare EVs"
            description="See your strongest two options side by side if you want a clearer final decision."
            icon={CarFront}
          />
          <ActionCard
            href={`/finance?car=${results[0]?.model.id ?? ""}`}
            title="Check affordability"
            description="See whether your top match feels comfortable, moderate, or like a stretch each month."
            icon={HandCoins}
          />
          <ActionCard
            href="/vehicles"
            title="Explore more EVs"
            description="If you want a wider view, keep browsing without losing the context you have built."
            icon={Sparkles}
          />
        </div>
      </div>
    </section>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-300">
      <span className="font-medium text-zinc-500">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </span>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.75rem] border border-white/8 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-emerald-400/25"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-emerald-300">
        Continue
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
