import Link from "next/link";
import Image from "next/image";
import { evModels } from "@/data/evModels";
import type { EVModel } from "@/types";

type Props = {
  models?: EVModel[];
};

export default function AllModelsComparison({ models }: Props) {
  const source = models && models.length > 0 ? models : evModels;
  const popular = source.slice(0, 10);

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-bold text-slate-900">Popular EVs Comparison</h2>
        <p className="mt-2 text-slate-600">
          Quick-start with popular electric vehicles and jump directly into side-by-side comparison.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popular.map((model) => (
            <article
              key={model.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Image
                src={model.heroImage}
                alt={`${model.brand} ${model.model}`}
                width={1200}
                height={675}
                unoptimized
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">2026 {model.brand}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{model.model}</h3>
                <p className="mt-1 text-sm text-slate-600">{model.bestFor}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">£{model.price.toLocaleString()}</span>
                  <span className="text-slate-600">{model.rangeKm} km</span>
                </div>
                <Link
                  href={`/cars/${model.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Start with this EV
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}