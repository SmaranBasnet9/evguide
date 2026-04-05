"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { EVModel } from "@/types";

type Props = {
  vehicles: EVModel[];
};

export default function AllVehiclesGrid({ vehicles }: Props) {
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vehicles.map((vehicle) => {
        const isExpanded = Boolean(expandedById[vehicle.id]);

        return (
          <article
            key={vehicle.id}
            id={`vehicle-${vehicle.id}`}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Link href={`/cars/${vehicle.id}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                  src={vehicle.heroImage}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800">
                  {vehicle.rangeKm} km range
                </span>
              </div>
            </Link>

            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{vehicle.brand}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{vehicle.model}</h2>
              <p className="mt-1 text-xl font-bold text-slate-900">£{vehicle.price.toLocaleString()}</p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="rounded-xl bg-slate-50 px-2 py-2">
                  Battery: <span className="font-semibold text-slate-900">{vehicle.batteryKWh} kWh</span>
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-2">
                  Power: <span className="font-semibold text-slate-900">{vehicle.motorCapacityKw} kW</span>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <p className={`text-sm text-slate-700 ${isExpanded ? "" : "line-clamp-2"}`}>
                  {vehicle.description}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpanded(vehicle.id)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
                <Link
                  href={`/cars/${vehicle.id}`}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  View
                </Link>
              </div>

              <Link
                href={`/finance?car=${vehicle.id}`}
                className="mt-2 block rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Finance
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
