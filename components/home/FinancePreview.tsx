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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.92fr)] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1FBF9F]">Finance preview</p>
            <h2 className="mt-4 text-4xl font-semibold text-[#1A1A1A] sm:text-5xl">Know your monthly cost before you buy</h2>
            <p className="mt-5 text-lg leading-8 text-[#6B7280]">
              Pressure-test a likely finance setup early so you know whether an EV feels comfortable, stretched, or worth comparing against alternatives.
            </p>
            <div className="mt-8">
              <Link href="/finance" className="inline-flex items-center justify-center rounded-full bg-[#1FBF9F] px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-[#17A589]">
                Check affordability
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E5E7EB] bg-[#F8FAF9] p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D1F2EB] bg-[#E8F8F5]">
                <Calculator className="h-5 w-5 text-[#1FBF9F]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Mini affordability view</p>
                <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">Tesla Model 3 example</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Car price</p>
                <p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{formatCurrency(vehiclePrice)}</p>
              </div>

              <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-white p-4">
                <div className="flex items-center justify-between text-sm text-[#6B7280]">
                  <span>Deposit</span>
                  <span className="font-medium text-[#1A1A1A]">{depositPercent}% · {formatCurrency(result.depositAmount)}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={depositPercent}
                  onChange={(event) => setDepositPercent(Number(event.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E5E7EB] accent-[#1FBF9F]"
                />
              </div>

              <div className="rounded-[1.5rem] border border-[#D1F2EB] bg-[#E8F8F5] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Estimated monthly cost</p>
                <p className="mt-2 text-3xl font-semibold text-[#1FBF9F]">{formatCurrency(result.monthlyCost)}/mo</p>
                <p className="mt-2 text-sm text-[#6B7280]">Includes a simple finance estimate plus typical monthly running costs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
