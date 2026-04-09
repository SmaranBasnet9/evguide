"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, BadgePercent, BatteryCharging, FileText, PoundSterling, Sparkles } from "lucide-react";
import RecommendationQuoteModal from "./RecommendationQuoteModal";
import { getSafeRecommendationImage, type MatchResult } from "./recommendationEngine";

interface RecommendationCardProps {
  result: MatchResult;
  index: number;
}

const rankCopy = ["Top Match", "Strong Alternative", "Best Value Backup"];

export default function RecommendationCard({ result, index }: RecommendationCardProps) {
  const { model, matchScore, monthlyCost, whyItFits } = result;
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <>
      <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={getSafeRecommendationImage(model.heroImage)}
            alt={`${model.brand} ${model.model}`}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
            {rankCopy[index] ?? "Recommended"}
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/12 px-3 py-1 text-sm font-semibold text-emerald-300 backdrop-blur-md">
            <BadgePercent className="h-4 w-4" />
            {matchScore}% match
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300">{model.brand}</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">{model.model}</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric icon={PoundSterling} label="Est. monthly cost" value={`GBP${monthlyCost.toLocaleString()}`} />
            <Metric icon={BatteryCharging} label="Range" value={`${model.rangeKm} km`} />
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-sm font-medium text-white">Confidence message</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">This EV fits your daily commute and budget comfortably based on the answers you gave.</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Why it fits you</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-zinc-300">
              {whyItFits.map((reason) => (
                <li key={reason} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-cyan-300" />
              <div>
                <p className="text-sm font-medium text-white">Get a quote</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Choose a bank, save the selected lender in the database, and download an automatic quotation instantly.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowQuoteModal(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            Get a Quote
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </article>

      {showQuoteModal ? (
        <RecommendationQuoteModal result={result} onClose={() => setShowQuoteModal(false)} />
      ) : null}
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PoundSterling;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Icon className="h-4 w-4 text-zinc-500" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">{label}</span>
      </div>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
