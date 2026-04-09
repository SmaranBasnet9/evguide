"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function FinancePreview() {
  const vehiclePrice = 38995;
  const [depositPercent, setDepositPercent] = useState(12);

  const result = useMemo(() => {
    const depositAmount = vehiclePrice * (depositPercent / 100);
    const principal = vehiclePrice - depositAmount;
    const monthlyRate = 0.069 / 12;
    const months = 48;
    const financePayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return {
      depositAmount: Math.round(depositAmount),
      monthlyCost: Math.round(financePayment + 112),
    };
  }, [depositPercent]);

  return (
    <section className="bg-[#090909] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.92fr)] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Finance preview</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Know your monthly cost before you buy</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Pressure-test a likely finance setup early so you know whether an EV feels comfortable, stretched, or worth comparing against alternatives.
            </p>
            <div className="mt-8">
              <Link href="/finance" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.2)] hover:shadow-[0_0_38px_rgba(16,185,129,0.3)]">
                Check affordability
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.34)] backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Calculator className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Mini affordability view</p>
                <p className="mt-1 text-lg font-semibold text-white">Tesla Model 3 example</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Car price</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(vehiclePrice)}</p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Deposit</span>
                  <span className="font-medium text-white">{depositPercent}% · {formatCurrency(result.depositAmount)}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={depositPercent}
                  onChange={(event) => setDepositPercent(Number(event.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-emerald-400"
                />
              </div>

              <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-200">Estimated monthly cost</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(result.monthlyCost)}/mo</p>
                <p className="mt-2 text-sm text-zinc-300">Includes a simple finance estimate plus typical monthly running costs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
