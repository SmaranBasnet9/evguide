import { XCircle } from "lucide-react";
import Link from "next/link";

export default function DealerRejectedScreen({ reason }: { reason?: string | null }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-white">Application not approved</h1>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Unfortunately your dealership application was not approved.
          {reason ? ` Reason: ${reason}` : " Please contact our support team for more information."}
        </p>
        <Link
          href="/support"
          className="mt-8 inline-block rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
