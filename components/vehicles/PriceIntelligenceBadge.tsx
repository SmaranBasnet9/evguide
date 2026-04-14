import type { PriceIntelligence } from "@/types";

interface PriceIntelligenceBadgeProps {
  intelligence: PriceIntelligence;
  size?: "sm" | "md";
}

const styleMap: Record<
  PriceIntelligence["category"],
  string
> = {
  great_deal: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  good_deal: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  fair_price: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30",
  above_average: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
};

export default function PriceIntelligenceBadge({
  intelligence,
  size = "sm",
}: PriceIntelligenceBadgeProps) {
  const colorClass = styleMap[intelligence.category];
  const sizeClass =
    size === "md"
      ? "text-sm px-3 py-1 rounded-full font-medium"
      : "text-xs px-2 py-0.5 rounded-full";

  const absPct = Math.abs(intelligence.percentageFromAvg);
  const direction =
    intelligence.percentageFromAvg < 0 ? "below avg" : "above avg";
  const pctLabel = `${absPct}% ${direction}`;

  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap ${colorClass} ${sizeClass}`}>
      {intelligence.label}
      {absPct > 0 && (
        <>
          <span className="opacity-50">·</span>
          {pctLabel}
        </>
      )}
    </span>
  );
}
