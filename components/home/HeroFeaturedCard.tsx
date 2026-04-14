import Image from "next/image";
import { BatteryCharging, TrendingUp } from "lucide-react";
import VehicleImagePlaceholder from "@/components/vehicles/VehicleImagePlaceholder";
import type { EVModel } from "@/types";

interface HeroFeaturedCardProps {
  model: EVModel | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
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

export default function HeroFeaturedCard({ model }: HeroFeaturedCardProps) {
  if (!model) {
    return <HeroFeaturedCardSkeleton />;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[2rem] bg-[#D1F2EB]/40 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white p-4 shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-[#1FBF9F]/40">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9]">
          {model.heroImage ? (
            <Image
              src={model.heroImage}
              alt={`${model.brand} ${model.model}`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <VehicleImagePlaceholder
              brand={model.brand}
              model={model.model}
              className="absolute inset-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#1FBF9F]/30 bg-[#E8F8F5] px-3 py-1.5 text-xs font-semibold text-[#1FBF9F]">
            <TrendingUp className="h-3.5 w-3.5" />
            92% match
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                Featured EV preview
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                {model.brand} {model.model}
              </h2>
            </div>
            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              Best for {model.bestFor.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Price</p>
            <p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{formatCurrency(model.price)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Est. monthly cost</p>
            <p className="mt-2 text-2xl font-semibold text-[#1FBF9F]">
              {formatCurrency(estimateMonthlyCost(model.price))}/mo
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Range</p>
            <p className="mt-2 text-xl font-semibold text-[#1A1A1A]">{model.rangeKm} km</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Battery</p>
            <div className="mt-2 flex items-center gap-2 text-xl font-semibold text-[#1A1A1A]">
              <BatteryCharging className="h-5 w-5 text-[#1FBF9F]" />
              {model.batteryKWh} kWh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroFeaturedCardSkeleton() {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[2rem] bg-[#D1F2EB]/30 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white p-4 shadow-md">
        <div className="aspect-[16/10] animate-pulse rounded-[1.5rem] border border-[#E5E7EB] bg-[#E8F8F5]" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-24 animate-pulse rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9]" />
          <div className="h-24 animate-pulse rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9]" />
          <div className="h-24 animate-pulse rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9]" />
          <div className="h-24 animate-pulse rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9]" />
        </div>
      </div>
    </div>
  );
}
