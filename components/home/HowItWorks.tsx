import { BrainCircuit, CheckCircle2, MessageSquareQuote } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Tell us your needs",
    description: "Share your budget, mileage, charging setup, and what matters most in the decision.",
    icon: MessageSquareQuote,
  },
  {
    step: "02",
    title: "We analyse the best EVs",
    description: "We compare fit, finance pressure, and ownership practicality across the strongest options.",
    icon: BrainCircuit,
  },
  {
    step: "03",
    title: "Get your perfect match instantly",
    description: "See which EVs fit, why they fit, and what to do next while the decision is still fresh.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">How it works</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">A faster way to decide which EV actually fits</h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Every step is built to reduce decision friction, not add more research tabs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="group rounded-[2rem] border border-white/10 bg-[#111111] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25 hover:shadow-[0_24px_70px_rgba(16,185,129,0.08)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-[0.24em] text-emerald-300">STEP {item.step}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition group-hover:border-emerald-400/30 group-hover:text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-base leading-8 text-zinc-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
