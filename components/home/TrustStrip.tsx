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
    <section className="border-y border-[#E5E7EB] bg-white py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] px-5 py-4 transition duration-300 hover:border-[#1FBF9F]/40 hover:bg-[#E8F8F5]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D1F2EB] bg-[#E8F8F5]">
                    <Icon className="h-4.5 w-4.5 text-[#1FBF9F]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#6B7280]">{item.description}</p>
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
