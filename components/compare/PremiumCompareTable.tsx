import type { EVModel } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface PremiumCompareTableProps {
  modelA: EVModel;
  modelB: EVModel;
}

function computeEmi(price: number) {
  return Math.round((price * 0.8) / 60);
}

function computeRunningCost(batteryCapacity: number, range: number) {
  // Mock running cost: (battery / range) * electricity rate (mock £0.25/kWh) * 100km
  const costPer100km = (batteryCapacity / range) * 0.25 * 100;
  return costPer100km;
}

function computeMockScore(m: EVModel) {
  let score = 50;
  if (m.tier === "affordable") score += 20;
  if (computeEmi(m.price) < 500) score += 10;
  if (m.rangeKm > 400) score += 10;
  score += Math.min(10, m.rangeKm / 50);
  return Math.max(10, Math.min(99, Math.round(score)));
}

type CompareRowProps = {
  label: string;
  valueA: number | string;
  valueB: number | string;
  displayA?: string;
  displayB?: string;
  lowerIsBetter?: boolean;
};

function CompareRow({ label, valueA, valueB, displayA, displayB, lowerIsBetter = false }: CompareRowProps) {
  let winner: "A" | "B" | "Tie" | null = null;
  
  if (typeof valueA === "number" && typeof valueB === "number") {
    if (valueA === valueB) winner = "Tie";
    else if (lowerIsBetter) winner = valueA < valueB ? "A" : "B";
    else winner = valueA > valueB ? "A" : "B";
  }

  const strA = displayA || String(valueA);
  const strB = displayB || String(valueB);

  return (
    <div className="grid grid-cols-[1fr_2fr_2fr] sm:grid-cols-[1fr_1fr_1fr] items-center gap-4 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors px-4 rounded-xl">
      <div className="text-zinc-500 font-medium text-sm">{label}</div>
      
      <div className={`text-base font-semibold ${winner === "A" ? "text-emerald-400" : "text-white"}`}>
        <div className="flex items-center gap-2">
          {strA}
          {winner === "A" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        </div>
      </div>
      
      <div className={`text-base font-semibold ${winner === "B" ? "text-emerald-400" : "text-white"}`}>
        <div className="flex items-center gap-2">
          {strB}
          {winner === "B" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        </div>
      </div>
    </div>
  );
}

export default function PremiumCompareTable({ modelA, modelB }: PremiumCompareTableProps) {
  const emiA = computeEmi(modelA.price);
  const emiB = computeEmi(modelB.price);

  const rcA = computeRunningCost(modelA.batteryKWh, modelA.rangeKm);
  const rcB = computeRunningCost(modelB.batteryKWh, modelB.rangeKm);

  const scoreA = computeMockScore(modelA);
  const scoreB = computeMockScore(modelB);
  
  // Clean parsing of acceleration string e.g. "4.5s (0-100 kph)" to number 4.5
  const trimAccel = (str: string) => {
    const match = str.match(/([0-9.]+)/);
    return match ? parseFloat(match[1]) : 99;
  };

  return (
    <section className="bg-[#0B0B0B] py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Detailed Specifications</h2>
        
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-2 sm:p-6 shadow-2xl">
          <div className="grid grid-cols-[1fr_2fr_2fr] sm:grid-cols-[1fr_1fr_1fr] gap-4 mb-4 px-4">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Metrics</div>
            <div className="text-white text-sm font-bold">{modelA.brand} {modelA.model}</div>
            <div className="text-white text-sm font-bold">{modelB.brand} {modelB.model}</div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <CompareRow 
              label="Deal Score" 
              valueA={scoreA} 
              valueB={scoreB} 
              displayA={`${scoreA}/100`} 
              displayB={`${scoreB}/100`} 
            />
            <CompareRow 
              label="Price" 
              valueA={modelA.price} 
              valueB={modelB.price} 
              displayA={`£${modelA.price.toLocaleString()}`} 
              displayB={`£${modelB.price.toLocaleString()}`} 
              lowerIsBetter 
            />
            <CompareRow 
              label="Est. Monthly" 
              valueA={emiA} 
              valueB={emiB} 
              displayA={`£${emiA}/mo`} 
              displayB={`£${emiB}/mo`} 
              lowerIsBetter 
            />
            <CompareRow 
              label="Range (WLTP)" 
              valueA={modelA.rangeKm} 
              valueB={modelB.rangeKm} 
              displayA={`${modelA.rangeKm} km`} 
              displayB={`${modelB.rangeKm} km`} 
            />
            {/* Real world range approximation (85% of WLTP) */}
            <CompareRow 
              label="Real World Range" 
              valueA={Math.round(modelA.rangeKm * 0.85)} 
              valueB={Math.round(modelB.rangeKm * 0.85)} 
              displayA={`~${Math.round(modelA.rangeKm * 0.85)} km`} 
              displayB={`~${Math.round(modelB.rangeKm * 0.85)} km`} 
            />
            <CompareRow 
              label="Battery" 
              valueA={modelA.batteryKWh} 
              valueB={modelB.batteryKWh} 
              displayA={`${modelA.batteryKWh} kWh`} 
              displayB={`${modelB.batteryKWh} kWh`} 
            />
            <CompareRow 
              label="Charging Speed" 
              valueA={modelA.fastChargeTime} 
              valueB={modelB.fastChargeTime} 
              displayA={modelA.fastChargeTime} 
              displayB={modelB.fastChargeTime} 
            />
            <CompareRow 
              label="Running Cost per 100km" 
              valueA={rcA} 
              valueB={rcB} 
              displayA={`£${rcA.toFixed(2)}`} 
              displayB={`£${rcB.toFixed(2)}`} 
              lowerIsBetter 
            />
            <CompareRow 
              label="Acceleration (0-100)" 
              valueA={trimAccel(modelA.acceleration)} 
              valueB={trimAccel(modelB.acceleration)} 
              displayA={`${trimAccel(modelA.acceleration)}s`} 
              displayB={`${trimAccel(modelB.acceleration)}s`} 
              lowerIsBetter 
            />
            <CompareRow 
              label="Boot Space" 
              valueA={modelA.bootLitres} 
              valueB={modelB.bootLitres} 
              displayA={`${modelA.bootLitres}L`} 
              displayB={`${modelB.bootLitres}L`} 
            />
            <CompareRow 
              label="Body Type" 
              valueA={modelA.bodyType || "N/A"} 
              valueB={modelB.bodyType || "N/A"} 
            />
            <CompareRow 
              label="Warranty" 
              valueA={modelA.warranty} 
              valueB={modelB.warranty} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
