import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Gauge, PoundSterling } from "lucide-react";
import { formatCurrency, getSafeImageSrc } from "./financeUtils";
import type { EVModel } from "@/types";

interface RelatedBudgetEVsProps {
  models: Array<{
    model: EVModel;
    monthlyPayment: number;
    ownershipCost: number;
  }>;
}

export default function RelatedBudgetEVs({ models }: RelatedBudgetEVsProps) {
  if (models.length === 0) return null;

  return (
    <section className="bg-[#0A0D10] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Related EV Options
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              EVs that may fit your budget better
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-400">
              If this setup feels expensive, these alternatives keep you moving forward instead of
              exiting the journey.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-emerald-300"
          >
            Compare finance-friendly EVs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {models.map(({ model, ownershipCost }) => (
            <article
              key={model.id}
              className="group overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getSafeImageSrc(model.heroImage)}
                  alt={`${model.brand} ${model.model}`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {model.badge ?? "Finance fit"}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  {model.brand}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{model.model}</h3>

                <div className="mt-5 grid gap-3">
                  <InfoRow icon={PoundSterling} label="Starting price" value={formatCurrency(model.price)} />
                  <InfoRow icon={Gauge} label="Estimated monthly cost" value={formatCurrency(ownershipCost)} />
                  <InfoRow icon={BatteryCharging} label="Range" value={`${model.rangeKm} km`} />
                </div>

                <Link
                  href={`/cars/${model.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
                >
                  View details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PoundSterling;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-4 py-3 text-sm">
      <div className="flex items-center gap-2 text-zinc-400">
        <Icon className="h-4 w-4 text-zinc-500" />
        {label}
      </div>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
