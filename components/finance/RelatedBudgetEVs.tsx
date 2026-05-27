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
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Related EV Options
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              EVs that may fit your budget better
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-500">
              If this setup feels expensive, these alternatives keep you moving forward instead of
              exiting the journey.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-emerald-600"
          >
            Compare finance-friendly EVs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {models.map(({ model, ownershipCost }) => (
            <article
              key={model.id}
              className="group overflow-hidden rounded-[2rem] border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getSafeImageSrc(model.heroImage)}
                  alt={`${model.brand} ${model.model}`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {model.badge ?? "Finance fit"}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  {model.brand}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-900">{model.model}</h3>

                <div className="mt-5 grid gap-3">
                  <InfoRow icon={PoundSterling} label="Starting price" value={formatCurrency(model.price)} />
                  <InfoRow icon={Gauge} label="Estimated monthly cost" value={formatCurrency(ownershipCost)} />
                  <InfoRow icon={BatteryCharging} label="Range" value={`${model.rangeKm} km`} />
                </div>

                <Link
                  href={`/cars/${model.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:border-emerald-300 hover:bg-emerald-50"
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
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
      <div className="flex items-center gap-2 text-gray-500">
        <Icon className="h-4 w-4 text-gray-400" />
        {label}
      </div>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
