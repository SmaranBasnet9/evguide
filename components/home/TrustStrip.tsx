import { BrainCircuit, PoundSterling, ShieldCheck, SplitSquareVertical } from "lucide-react";

const items = [
  {
    title: "UK-focused EV data",
    description: "Models, pricing, and context shaped for British buyers.",
    icon: ShieldCheck,
  },
  {
    title: "Real cost analysis",
    description: "Monthly affordability and ownership signals, not headline price alone.",
    icon: PoundSterling,
  },
  {
    title: "AI-powered recommendations",
    description: "Fast shortlist logic based on budget, mileage, charging, and priorities.",
    icon: BrainCircuit,
  },
  {
    title: "Easy compare and finance tools",
    description: "Move from research into action without restarting your journey.",
    icon: SplitSquareVertical,
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-white/[0.03] py-7 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[1.5rem] border border-white/8 bg-[#111111]/60 px-5 py-4 transition duration-300 hover:border-emerald-400/20 hover:bg-[#151515]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icon className="h-4.5 w-4.5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
