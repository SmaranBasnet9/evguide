import { CheckCircle2, RefreshCcw } from "lucide-react";

interface FinanceSuccessMessageProps {
  onReset: () => void;
}

export default function FinanceSuccessMessage({
  onReset,
}: FinanceSuccessMessageProps) {
  return (
    <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/8 px-6 py-12 text-center shadow-[0_30px_100px_rgba(16,185,129,0.08)] md:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/12 text-emerald-300">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold text-white">Finance enquiry submitted</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-zinc-300">
        Your form has been submitted. Our consultant will contact you soon.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <RefreshCcw className="h-4 w-4" />
        Start another enquiry
      </button>
    </div>
  );
}
