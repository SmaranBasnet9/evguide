import type { EVModel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import VehicleImagePlaceholder from "@/components/vehicles/VehicleImagePlaceholder";

interface FeaturedEVsProps {
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

function getDealLabel(model: EVModel) {
  if (model.price <= 33000 || model.badge === "Best Value") return "Great";
  if (model.price <= 47000 || model.badge === "Long Range") return "Fair";
  return "Premium";
}

export default function FeaturedEVs({ models }: FeaturedEVsProps) {
  const displayModels = models.slice(0, 3);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1FBF9F]">Featured EVs</p>
            <h2 className="mt-4 text-4xl font-semibold text-[#1A1A1A] sm:text-5xl">Top EVs for UK buyers right now</h2>
            <p className="mt-5 text-lg leading-8 text-[#4B5563]">
              A curated shortlist to help you move from browsing into a smarter compare-or-match decision.
            </p>
          </div>
          <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1FBF9F] transition hover:text-[#17A589]">
            Browse all EVs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {displayModels.map((model) => {
            const monthlyCost = estimateMonthlyCost(model.price);
            const dealLabel = getDealLabel(model);

            return (
              <article key={model.id} className="group overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1FBF9F]/40 hover:shadow-lg">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9]">
                  {model.heroImage ? (
                    <Image
                      src={model.heroImage}
                      alt={`${model.brand} ${model.model}`}
                      fill
                      unoptimized
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <VehicleImagePlaceholder brand={model.brand} model={model.model} className="absolute inset-0" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {model.bestFor}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">{model.brand}</p>
                      <h3 className="mt-2 text-3xl font-semibold text-white">{model.model}</h3>
                    </div>
                    <div className="rounded-full border border-[#1FBF9F]/40 bg-[#E8F8F5] px-3 py-1.5 text-xs font-semibold text-[#1FBF9F] backdrop-blur-sm">
                      {dealLabel} deal score
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-[1.25rem] border border-[#E5E7EB] bg-[#F8FAF9] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#374151]">Price</p>
                      <p className="mt-2 text-base font-semibold text-[#1A1A1A]">{formatCurrency(model.price)}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#E5E7EB] bg-[#F8FAF9] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#374151]">Range</p>
                      <p className="mt-2 text-base font-semibold text-[#1A1A1A]">{model.rangeKm} km</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#E5E7EB] bg-[#F8FAF9] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#374151]">Battery</p>
                      <p className="mt-2 text-base font-semibold text-[#1A1A1A]">{model.batteryKWh} kWh</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#E5E7EB] bg-[#E8F8F5] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#374151]">Monthly</p>
                      <p className="mt-2 text-base font-semibold text-[#1FBF9F]">{formatCurrency(monthlyCost)}/mo</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-[1.25rem] border border-[#E5E7EB] bg-[#F8FAF9] px-4 py-3 text-sm text-[#4B5563]">
                    <Zap className="h-4 w-4 text-[#1FBF9F]" />
                    Best for {model.bestFor.toLowerCase()}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link href={`/cars/${model.id}`} className="flex-1 rounded-full bg-[#1FBF9F] px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#17A589]">
                      View Details
                    </Link>
                    <Link href={`/compare?carA=${model.id}`} className="flex-1 rounded-full border border-[#1FBF9F] bg-white px-5 py-3 text-center text-sm font-semibold text-[#1FBF9F] transition hover:bg-[#E8F8F5]">
                      Compare
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/compare" className="inline-flex items-center gap-2 rounded-full border border-[#1FBF9F] bg-white px-6 py-3 text-sm font-semibold text-[#1FBF9F] transition hover:bg-[#E8F8F5]">
            Compare EVs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
