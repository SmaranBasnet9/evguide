"use client";

import { useState } from "react";
import { Shield, ChevronDown, ChevronUp, ExternalLink, CheckCircle } from "lucide-react";

interface Props {
  vehicleId: string;
  vehicleLabel: string;
}

const PROVIDERS = [
  {
    name: "By Miles",
    tagline: "Pay-per-mile — perfect for low mileage EV owners",
    note: "Avg EV driver saves £180/yr vs standard",
    badge: "Best for low mileage",
    url: "https://www.bymiles.co.uk",
    features: ["Pay only for miles driven", "Fully comprehensive", "EV specialist"],
  },
  {
    name: "Marshmallow",
    tagline: "Fair pricing for new UK drivers and EVs",
    note: "No hidden fees, cancel anytime",
    badge: null,
    url: "https://www.marshmallow.com",
    features: ["EV battery cover included", "Roadside assistance", "Flexible payment"],
  },
  {
    name: "Hastings Direct EV",
    tagline: "Dedicated EV policy — covers charging cables",
    note: "Covers home charger and public charging equipment",
    badge: "Widest coverage",
    url: "https://www.hastingsdirect.com",
    features: ["Charging cable cover", "Battery warranty protection", "24/7 EV helpline"],
  },
];

export default function InsuranceWidget({ vehicleId, vehicleLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [tracking, setTracking] = useState<string | null>(null);
  const [tracked, setTracked] = useState<Set<string>>(new Set());

  async function handleProviderClick(providerName: string, url: string) {
    if (tracked.has(providerName)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    setTracking(providerName);
    try {
      await fetch("/api/insurance-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerName,
          vehicle_id: vehicleId,
          vehicle_label: vehicleLabel,
        }),
      });
      setTracked((prev) => new Set([...prev, providerName]));
    } catch {
      // fire-and-forget — don't block user
    } finally {
      setTracking(null);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200 bg-violet-50">
            <Shield className="h-4 w-4 text-violet-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">EV insurance comparison</p>
            <p className="text-sm text-gray-600">
              Specialist EV policies — covers{" "}
              <span className="font-semibold text-violet-700">charging cables &amp; battery</span>
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">

          {/* Why EV-specific */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Charging cable", value: "Covered",     sub: "Standard & rapid" },
              { label: "Battery failure", value: "Included",   sub: "Beyond warranty" },
              { label: "Public charger", value: "Protected",   sub: "Damage & theft" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-center">
                <p className="text-sm font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Providers */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">EV specialist insurers</p>
            {PROVIDERS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">{p.name}</p>
                      {p.badge && (
                        <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-600">{p.tagline}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {p.features.map((f) => (
                        <span key={f} className="flex items-center gap-1 text-[11px] text-gray-500">
                          <CheckCircle className="h-3 w-3 text-violet-500 shrink-0" />
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400">{p.note}</p>
                  </div>
                  <button
                    onClick={() => handleProviderClick(p.name, p.url)}
                    disabled={tracking === p.name}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-60"
                  >
                    {tracking === p.name ? "…" : (
                      <>Get quote <ExternalLink className="h-3 w-3" /></>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] text-gray-400">
            EVGuide may earn a referral fee when you get a quote. This never affects our recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
