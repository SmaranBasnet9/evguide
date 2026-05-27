import { Clock } from "lucide-react";
import Link from "next/link";

export default function DealerPendingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
          <Clock className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-white">Application under review</h1>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Your dealership application is being reviewed by our team. We aim to respond within
          2 business days. You&apos;ll receive an email once your account is approved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.10]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
