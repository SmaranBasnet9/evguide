"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Olivia Carter",
    city: "London",
    matched: "Matched with MG4",
    timing: "2 months ago",
    avatar: "https://i.pravatar.cc/96?img=47",
    quote:
      "AI Match cut through the noise fast. I knew the MG4 fit my budget, city driving, and charging setup before I ever spoke to a dealer.",
  },
  {
    id: 2,
    name: "James Patel",
    city: "Manchester",
    matched: "Matched with Hyundai IONIQ 5",
    timing: "6 weeks ago",
    avatar: "https://i.pravatar.cc/96?img=12",
    quote:
      "What helped most was seeing monthly affordability early. It felt like a decision platform, not a pushy marketplace.",
  },
  {
    id: 3,
    name: "Sophie Bennett",
    city: "Bristol",
    matched: "Matched with BYD Dolphin",
    timing: "3 months ago",
    avatar: "https://i.pravatar.cc/96?img=32",
    quote:
      "The shortlist made sense immediately. It balanced price, charging, and real-world use better than any dealer conversation I had before.",
  },
  {
    id: 4,
    name: "Daniel Osei",
    city: "Birmingham",
    matched: "Matched with Kia EV6",
    timing: "1 month ago",
    avatar: "https://i.pravatar.cc/96?img=15",
    quote:
      "Comparing real-world range against my commute made the decision easy. No more guessing from brochure numbers.",
  },
  {
    id: 5,
    name: "Emma Wilson",
    city: "Leeds",
    matched: "Matched with Tesla Model Y",
    timing: "5 weeks ago",
    avatar: "https://i.pravatar.cc/96?img=5",
    quote:
      "The TCO calculator sold me — seeing charging costs vs. petrol side by side made the switch a no-brainer.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Proof and trust</p>
          <h2 className="mt-4 text-4xl font-semibold text-gray-900 sm:text-5xl">
            Real buyers. Faster decisions.
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            UK buyers who used EVGuide to cut through the noise and decide with confidence.
          </p>
          {/* Aggregate rating */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand text-brand" />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">4.9</span>
            <span className="text-sm text-gray-500">· 847 verified UK buyers</span>
          </div>
        </div>

        <div className="mt-12 -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:thin]">
          {TESTIMONIALS.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative w-[320px] shrink-0 snap-start rounded-[1.75rem] border border-gray-200 bg-gray-50 p-8 transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-white hover:shadow-lg sm:w-[360px]"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-gray-200" />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-brand text-brand" />
                ))}
              </div>

              {/* Tag */}
              <div className="mt-5 inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500">
                {item.matched} · {item.city} · {item.timing}
              </div>

              {/* Quote */}
              <p className="mt-5 text-base leading-7 text-gray-700">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-8 flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-full border border-brand/20 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.city}, UK</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
