import { Star, Quote } from "lucide-react";

const testimonials = [
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
      "The shortlist made sense immediately. It balanced price, charging, and real-world use better than any dealership conversation I had before.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Proof and trust</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Real buyers using EVGuide AI to decide faster</h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Realistic stories from UK buyers who used AI Match and affordability tools to make a clearer EV decision.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="relative rounded-[2rem] border border-white/10 bg-[#111111] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-[#151515]">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-white/6" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4.5 w-4.5 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                {item.matched} · {item.city} · {item.timing}
              </div>
              <p className="mt-6 text-lg leading-8 text-zinc-300">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-8">
                <p className="text-base font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{item.city}, UK</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
