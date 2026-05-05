"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, TrendingDown, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

const HIGHLIGHTS = [
  { icon: Zap, label: "2–4p per mile to charge at home vs 16p for petrol" },
  { icon: TrendingDown, label: "£0 road tax on zero-emission vehicles" },
  { icon: Calculator, label: "Lower servicing costs — no oil changes, fewer brake replacements" },
];

export default function FinancePreview() {
  const vehiclePrice = 38995;
  const [depositPercent, setDepositPercent] = useState(12);

  const result = useMemo(() => {
    const depositAmount = vehiclePrice * (depositPercent / 100);
    const principal = vehiclePrice - depositAmount;
    const monthlyRate = 0.069 / 12;
    const months = 48;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return {
      depositAmount: Math.round(depositAmount),
      monthlyCost: Math.round(payment + 112),
    };
  }, [depositPercent]);

  return (
    <section className="bg-[#0D0D0D] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Finance preview</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Know your monthly cost{" "}
              <span className="text-gradient-brand">before you commit.</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/50">
              Pressure-test a finance setup early so the decision feels clear —
              not like a guess at a dealership.
            </p>

            <ul className="mt-8 space-y-4">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3 text-sm text-white/60">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10">
                    <Icon className="h-3.5 w-3.5 text-brand" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <Link
              href="/finance"
              className={cn(
                buttonVariants(),
                "mt-10 flex w-fit items-center gap-2 rounded-full bg-brand px-8 py-6 text-base font-semibold text-white shadow-[0_0_30px_rgba(31,191,159,0.3)] hover:bg-brand-hover",
              )}
            >
              Full affordability calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right — calculator widget */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6"
          >
            {/* Widget header */}
            <div className="flex items-center gap-3 border-b border-white/6 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                <Calculator className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Quick estimate
                </p>
                <p className="mt-0.5 text-base font-semibold text-white">Tesla Model 3 example</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* Car price */}
              <div className="rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Car price</p>
                <p className="mt-1.5 text-2xl font-semibold text-white">{formatGBP(vehiclePrice)}</p>
              </div>

              {/* Deposit slider */}
              <div className="rounded-xl border border-white/6 bg-white/[0.03] px-4 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Deposit</span>
                  <span className="font-semibold text-white">
                    {depositPercent}% · {formatGBP(result.depositAmount)}
                  </span>
                </div>
                <Slider
                  min={5}
                  max={30}
                  step={1}
                  value={[depositPercent]}
                  onValueChange={(v) => setDepositPercent(Array.isArray(v) ? v[0] : v)}
                  className="mt-4"
                />
                <div className="mt-2 flex justify-between text-[10px] text-white/25">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Monthly result */}
              <div className="rounded-xl border border-brand/20 bg-brand/10 px-4 py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-brand/70">
                  Estimated monthly cost
                </p>
                <motion.p
                  key={result.monthlyCost}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2 text-4xl font-semibold text-brand"
                >
                  {formatGBP(result.monthlyCost)}
                  <span className="text-xl text-brand/60">/mo</span>
                </motion.p>
                <p className="mt-2 text-xs text-white/35">
                  Finance estimate · includes typical monthly running costs
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
