import { ArrowRight, Percent, ShieldCheck } from "lucide-react";
import type { BankOffer } from "@/types";

interface BankSelectionOffer extends BankOffer {
  marketingNote: string;
}

interface FinanceStepBankSelectionProps {
  banks: BankSelectionOffer[];
  selectedBankId: string;
  onSelectBank: (bankId: string) => void;
  onContinue: () => void;
}

export default function FinanceStepBankSelection({
  banks,
  selectedBankId,
  onSelectBank,
  onContinue,
}: FinanceStepBankSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Step 1</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Choose your bank profile</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Start by selecting the lender profile you want to model. The chosen rate feeds the rest
          of the finance flow automatically.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {banks.map((bank) => {
          const active = bank.id === selectedBankId;

          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank.id)}
              className={`rounded-[1.75rem] border p-5 text-left transition duration-300 ${
                active
                  ? "border-emerald-400/35 bg-emerald-400/10 shadow-[0_20px_40px_rgba(16,185,129,0.12)]"
                  : "border-white/8 bg-black/20 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Bank option
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{bank.bank}</h3>
                </div>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {bank.marketingNote}
                </span>
              </div>

              <div className="mt-5 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Percent className="h-4 w-4 text-zinc-500" />
                  Interest rate
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">{bank.interestRate.toFixed(1)}%</p>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                <div>
                  <p className="text-sm font-medium text-white">{bank.tag}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    Up to {bank.maxTenureYears} years with {bank.processingFee} processing fee guidance.
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedBankId}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to vehicle selection
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
