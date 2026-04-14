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
    <section className="bg-[#F8FAF9] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1FBF9F]">Proof and trust</p>
          <h2 className="mt-4 text-4xl font-semibold text-[#1A1A1A] sm:text-5xl">Real buyers using EVGuide AI to decide faster</h2>
          <p className="mt-5 text-lg leading-8 text-[#6B7280]">
            Realistic stories from UK buyers who used AI Match and affordability tools to make a clearer EV decision.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="relative rounded-[2rem] border border-[#E5E7EB] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1FBF9F]/40 hover:shadow-lg">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-[#E8F8F5]" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4.5 w-4.5 fill-[#1FBF9F] text-[#1FBF9F]" />
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] px-4 py-3 text-sm text-[#6B7280]">
                {item.matched} · {item.city} · {item.timing}
              </div>
              <p className="mt-6 text-lg leading-8 text-[#1A1A1A]">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-8">
                <p className="text-base font-semibold text-[#1A1A1A]">{item.name}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{item.city}, UK</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
