"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Olivia Carter",
    city: "London",
    matched: "Matched with MG4",
    timing: "2 months ago",
    quote:
      "AI Match cut through the noise fast. I knew the MG4 fit my budget, city driving, and charging setup before I ever spoke to a dealer.",
  },
  {
    id: 2,
    name: "James Patel",
    city: "Manchester",
    matched: "Matched with Hyundai IONIQ 5",
    timing: "6 weeks ago",
    quote:
      "What helped most was seeing monthly affordability early. It felt like a decision platform, not a pushy marketplace.",
  },
  {
    id: 3,
    name: "Sophie Bennett",
    city: "Bristol",
    matched: "Matched with BYD Dolphin",
    timing: "3 months ago",
    quote:
      "The shortlist made sense immediately. It balanced price, charging, and real-world use better than any dealer conversation I had before.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Proof and trust</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Real buyers. Faster decisions.
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/50">
            UK buyers who used EVGuide to cut through the noise and decide with confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-5 xl:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-[1.75rem] border border-white/6 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:bg-white/[0.05]"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-white/5" />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-brand text-brand" />
                ))}
              </div>

              {/* Tag */}
              <div className="mt-5 inline-flex rounded-lg border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40">
                {item.matched} · {item.city} · {item.timing}
              </div>

              {/* Quote */}
              <p className="mt-5 text-base leading-7 text-white/75">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-sm font-semibold text-brand">
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-white/35">{item.city}, UK</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
