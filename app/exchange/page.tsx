import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import ExchangeButton from "@/components/exchange/ExchangeButton";
import { ArrowRight, CheckCircle, Zap, Clock, Shield, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Exchange Your Vehicle | EVGuide AI",
  description:
    "Get an instant AI-powered valuation for your current vehicle and exchange it for an EV. Fast, transparent, no obligation.",
};

const steps = [
  {
    number: "01",
    title: "Tell us about your car",
    description:
      "Enter your vehicle details — make, model, year, mileage, and condition. Takes under 2 minutes.",
  },
  {
    number: "02",
    title: "Get an instant valuation",
    description:
      "Our AI analyses current UK market data to give you a realistic part-exchange estimate on the spot.",
  },
  {
    number: "03",
    title: "Choose your EV",
    description:
      "Browse our EV inventory and apply your exchange value as a deposit towards your next electric vehicle.",
  },
  {
    number: "04",
    title: "We handle the rest",
    description:
      "A consultant confirms your final offer after a quick inspection, then sorts the paperwork for you.",
  },
];

const whyPoints = [
  {
    icon: <Zap className="h-5 w-5 text-amber-400" />,
    title: "AI-Powered Valuations",
    body: "Live UK market analysis — not a generic price guide — means your estimate reflects what dealers are actually paying today.",
  },
  {
    icon: <Clock className="h-5 w-5 text-amber-400" />,
    title: "Instant Result",
    body: "No waiting, no phone calls. You get a valuation the moment you submit your details.",
  },
  {
    icon: <Shield className="h-5 w-5 text-amber-400" />,
    title: "Zero Obligation",
    body: "The instant estimate is just that — an estimate. You're under no obligation to proceed.",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-amber-400" />,
    title: "EV Upgrade Savings",
    body: "Combine your exchange value with our finance options and government grants to maximise your EV budget.",
  },
];

const faqs = [
  {
    q: "What vehicles can I exchange?",
    a: "Any roadworthy car — petrol, diesel, hybrid, or even an older EV. We accept all makes and models.",
  },
  {
    q: "Is the instant valuation the final offer?",
    a: "The online valuation is an estimate. A consultant confirms the final offer after a brief physical inspection, which usually matches the estimate closely.",
  },
  {
    q: "Do I have to buy an EV to exchange?",
    a: "No. You can submit an exchange request even if you haven't chosen an EV yet. We'll match you with suitable models based on your exchange value and budget.",
  },
  {
    q: "How long does the process take?",
    a: "The online form takes under 2 minutes. The full exchange — from inspection to handover — typically completes within 3–5 business days.",
  },
  {
    q: "Will you collect my vehicle?",
    a: "Yes. For approved exchanges we offer free collection from your home or workplace within mainland UK.",
  },
];

export default function ExchangePage() {
  return (
    <>
      <PremiumNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-600">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Part Exchange
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
            Exchange your car.
            <br />
            <span className="text-amber-500">Drive electric sooner.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#6B7280]">
            Get an instant AI valuation for your current vehicle and use it as a deposit
            towards your next EV — fully transparent, zero obligation.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ExchangeButton
              variant="default"
              className="px-8 py-4 text-base font-bold rounded-full"
            />
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#1A1A1A]"
            >
              See how it works <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[#6B7280]">
            {["Free valuation", "No obligation", "Instant result", "UK market data"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#1FBF9F]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#F8FAF9] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-[#1A1A1A]">How it works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#6B7280]">
            From valuation to handover in four simple steps.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:border-amber-300/60 hover:shadow-md transition-all">
                <span className="text-4xl font-black text-amber-300 select-none">{step.number}</span>
                <h3 className="mt-3 text-base font-semibold text-[#1A1A1A]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why EVGuide Exchange ──────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-[#1A1A1A]">Why exchange with us?</h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyPoints.map((pt) => (
              <div key={pt.title} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAF9] p-6 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-300/40">
                  {pt.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">{pt.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{pt.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────────────────────── */}
      <section className="bg-amber-500 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Ready to find out what your car is worth?
          </h2>
          <p className="mt-3 text-amber-100">
            Takes less than 2 minutes. No account required.
          </p>
          <div className="mt-8 flex justify-center">
            <ExchangeButton
              variant="default"
              className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 text-base font-bold rounded-full shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAF9] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold text-[#1A1A1A]">Frequently asked questions</h2>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-[#1A1A1A]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PremiumFooter />
    </>
  );
}
