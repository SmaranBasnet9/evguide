import { CheckCircle2, RefreshCcw } from "lucide-react";

interface FinanceSuccessMessageProps {
  onReset: () => void;
}

export default function FinanceSuccessMessage({
  onReset,
}: FinanceSuccessMessageProps) {
  return (
    <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 px-6 py-12 text-center shadow-sm md:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold text-gray-900">Finance enquiry submitted</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-600">
        Your form has been submitted. Our consultant will contact you soon.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <RefreshCcw className="h-4 w-4" />
        Start another enquiry
      </button>
    </div>
  );
}
