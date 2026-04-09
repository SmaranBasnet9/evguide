import { ArrowLeftRight, Car, Zap } from "lucide-react";
import type { EVModel } from "@/types";

interface PremiumCompareHeroProps {
  models: EVModel[];
  selectedA: string;
  selectedB: string;
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
  onSwap: () => void;
}

export default function PremiumCompareHero({ 
  models, 
  selectedA, 
  selectedB, 
  onSelectA, 
  onSelectB,
  onSwap
}: PremiumCompareHeroProps) {
  return (
    <section className="relative pt-32 pb-16 bg-[#0B0B0B] overflow-hidden border-b border-white/5">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 pb-1.5 pt-1.5">
          <Zap className="w-3.5 h-3.5" /> Intelligence Compare
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
          Compare & Decide.
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-16">
          See exactly how models stack up mathematically. We analyze real-world range, charging speeds, and running costs to find your true winner.
        </p>

        {/* The Selector UI */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto p-4 bg-[#111111] border border-white/10 rounded-[2rem] shadow-2xl relative">
          
          <div className="w-full flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Car className="h-5 w-5 text-emerald-500/50" />
            </div>
            <select
              value={selectedA}
              onChange={(e) => onSelectA(e.target.value)}
              className="appearance-none w-full bg-zinc-900 border border-white/10 text-white pl-12 pr-10 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-semibold text-lg hover:bg-zinc-800 cursor-pointer"
            >
              <option value="" disabled>Select Vehicle A</option>
              {models.map(m => (
                <option key={m.id} value={m.id} disabled={m.id === selectedB}>{m.brand} {m.model}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <button 
            onClick={onSwap}
            disabled={!selectedA || !selectedB}
            className="hidden md:flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:opacity-50 text-black rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 -mx-10 shrink-0 border-4 border-[#111111]"
            title="Swap vehicles"
          >
            <ArrowLeftRight className="w-6 h-6" />
          </button>

          <div className="w-full flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Car className="h-5 w-5 text-cyan-500/50" />
            </div>
            <select
              value={selectedB}
              onChange={(e) => onSelectB(e.target.value)}
              className="appearance-none w-full bg-zinc-900 border border-white/10 text-white pl-12 pr-10 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-semibold text-lg hover:bg-zinc-800 cursor-pointer"
            >
              <option value="" disabled>Select Vehicle B</option>
              {models.map(m => (
                <option key={m.id} value={m.id} disabled={m.id === selectedA}>{m.brand} {m.model}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
