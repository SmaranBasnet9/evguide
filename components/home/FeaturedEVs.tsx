"use client";

import type { EVModel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import VehicleImagePlaceholder from "@/components/vehicles/VehicleImagePlaceholder";

interface FeaturedEVsProps {
  models: EVModel[];
}

function estimateMonthlyCost(price: number) {
  const deposit = price * 0.1;
  const principal = price - deposit;
  const monthlyRate = 0.069 / 12;
  const months = 48;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment + 112);
}

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDealBadge(model: EVModel): { label: string; color: string } {
  if (model.price <= 33000 || model.badge === "Best Value")
    return { label: "Great value", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" };
  if (model.price <= 47000 || model.badge === "Long Range")
    return { label: "Popular pick", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" };
  return { label: "Premium", color: "text-violet-400 border-violet-400/30 bg-violet-400/10" };
}

const SPECS = (model: EVModel) => [
  { label: "Price", value: formatGBP(model.price) },
  { label: "Range", value: `${model.rangeKm} km` },
  { label: "Battery", value: `${model.batteryKWh} kWh` },
  { label: "Monthly", value: `${formatGBP(estimateMonthlyCost(model.price))}/mo`, highlight: true },
];

export default function FeaturedEVs({ models }: FeaturedEVsProps) {
  const displayModels = models.slice(0, 3);

  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Featured EVs</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Top EVs for UK buyers right now
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/50">
              A curated shortlist to move from browsing into a smarter decision.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-hover"
          >
            Browse all EVs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 xl:grid-cols-3">
          {displayModels.map((model, i) => {
            const badge = getDealBadge(model);
            const specs = SPECS(model);

            return (
              <motion.article
                key={model.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.03] transition-all duration-300 hover:border-brand/25 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
              >
                {/* Image */}
                <div className="relative aspect-[16/11] overflow-hidden bg-[#111]">
                  {model.heroImage ? (
                    <Image
                      src={model.heroImage}
                      alt={`${model.brand} ${model.model}`}
                      fill
                      unoptimized
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <VehicleImagePlaceholder
                      brand={model.brand}
                      model={model.model}
                      className="absolute inset-0"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top badge */}
                  <div className="absolute left-4 top-4">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
                      {model.brand}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-white">{model.model}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Specs grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {specs.map((spec) => (
                      <div
                        key={spec.label}
                        className={`rounded-xl p-3 ${spec.highlight ? "border border-brand/20 bg-brand/10" : "border border-white/6 bg-white/[0.03]"}`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">{spec.label}</p>
                        <p className={`mt-1.5 text-sm font-semibold ${spec.highlight ? "text-brand" : "text-white"}`}>
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Best for */}
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white/40">
                    <Zap className="h-3.5 w-3.5 text-brand" />
                    Best for {model.bestFor.toLowerCase()}
                  </div>

                  {/* CTAs */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/cars/${model.id}`}
                      className={cn(
                        buttonVariants(),
                        "flex-1 rounded-full bg-brand text-center text-sm font-semibold text-white hover:bg-brand-hover",
                      )}
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/compare?carA=${model.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "flex-1 rounded-full border-white/10 bg-transparent text-center text-sm font-semibold text-white hover:border-white/20 hover:bg-white/5",
                      )}
                    >
                      Compare
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/compare"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2 rounded-full border-white/10 bg-white/[0.03] px-8 py-6 text-sm font-semibold text-white hover:border-white/20 hover:bg-white/[0.06]",
            )}
          >
            Compare EVs side by side
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
