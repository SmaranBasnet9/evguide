"use client";

import { motion } from "framer-motion";
import { BrainCircuit, PoundSterling, ShieldCheck, SplitSquareVertical } from "lucide-react";

const items = [
  {
    title: "UK-focused EV data",
    description: "Models, pricing, and context shaped for British buyers.",
    icon: ShieldCheck,
  },
  {
    title: "Real cost analysis",
    description: "Monthly affordability and ownership signals, not headline price.",
    icon: PoundSterling,
  },
  {
    title: "AI-powered matching",
    description: "Shortlist logic based on budget, mileage, charging, and priorities.",
    icon: BrainCircuit,
  },
  {
    title: "Compare and finance tools",
    description: "Move from research into action without restarting your journey.",
    icon: SplitSquareVertical,
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-white/5 bg-[#0D0D0D] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 transition duration-300 hover:border-brand/20 hover:bg-white/[0.05]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                  <Icon className="h-4.5 w-4.5 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-white/40">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
