"use client";

import { CheckCircle2 } from "lucide-react";

const STATS = [
  "2,800+ UK EVs reviewed",
  "12,000+ buyers matched",
  "4.9★ from 847 reviews",
  "Free to use · always",
  "AI-powered matching",
];

export default function TrustStrip() {
  return (
    <div className="border-b border-white/[0.05] bg-[#090909]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0 overflow-x-auto py-3"
          style={{ scrollbarWidth: "none" }}>
          {STATS.map((stat, i) => (
            <div key={stat} className="flex shrink-0 items-center">
              {i > 0 && (
                <span className="mx-4 h-3 w-px shrink-0 bg-white/10" />
              )}
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-brand" />
                <span className="whitespace-nowrap text-xs font-medium text-white/50">
                  {stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
