import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BatteryCharging, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import type { EVModel } from "@/types";

interface HeroSectionProps {
  models: EVModel[];
}

function estimateMonthlyCost(price: number) {
  const deposit = price * 0.1;
  const principal = price - deposit;
  const monthlyRate = 0.069 / 12;
  const months = 48;
  const financePayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(financePayment + 112);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HeroSection({ models }: HeroSectionProps) {
  const heroModel = models[0];

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.18),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.14),transparent_20%),linear-gradient(180deg,#0B0B0B_0%,#090909_100%)]" />
      <div className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            AI-powered EV decisions for UK buyers
          </div>

          <h1 className="mt-8 text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Find the smartest electric car for your budget
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300 sm:text-xl">
            Compare EVs, understand real monthly costs, and get matched to the right car in minutes.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/ai-match" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.24)] hover:shadow-[0_0_42px_rgba(16,185,129,0.36)]">
              Start AI Match
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/vehicles" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-white transition hover:bg-white/10">
              Browse Top EVs
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-zinc-400">
            <span>No signup required</span>
            <span>Takes 30 seconds</span>
            <span>UK-focused EV insights</span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <p className="mt-3 text-sm font-semibold text-white">Decision-first guidance</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">Built to answer fit, affordability, and next step, not just show listings.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <BatteryCharging className="h-5 w-5 text-cyan-300" />
              <p className="mt-3 text-sm font-semibold text-white">Real monthly cost lens</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">Finance and running-cost context that feels useful before you speak to a dealer.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/8 to-transparent blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111]/90 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_35px_95px_rgba(16,185,129,0.12)]">
            {heroModel ? (
              <>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
                  <Image
                    src={heroModel.heroImage}
                    alt={`${heroModel.brand} ${heroModel.model}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
                    <TrendingUp className="h-3.5 w-3.5" />
                    92% match
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300">Featured EV preview</p>
                      <h2 className="mt-2 text-3xl font-semibold text-white">{heroModel.brand} {heroModel.model}</h2>
                    </div>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur-sm">
                      Best for {heroModel.bestFor.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Price</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(heroModel.price)}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Estimated monthly cost</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-300">{formatCurrency(estimateMonthlyCost(heroModel.price))}/mo</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Range</p>
                    <p className="mt-2 text-xl font-semibold text-white">{heroModel.rangeKm} km</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Battery</p>
                    <p className="mt-2 text-xl font-semibold text-white">{heroModel.batteryKWh} kWh</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
