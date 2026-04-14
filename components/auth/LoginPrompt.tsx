"use client";

import Link from "next/link";
import { LogIn, Lock } from "lucide-react";

interface LoginPromptProps {
  /** What the user is trying to do — shown in the message */
  action?: string;
  /** Optional: current path to redirect back after login */
  returnTo?: string;
}

/**
 * Drop-in replacement for a locked form/section.
 * Shows a clean "sign in to continue" panel.
 */
export default function LoginPrompt({ action = "continue", returnTo }: LoginPromptProps) {
  const href = returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : "/login";

  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAF9] px-8 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D1F2EB] bg-[#E8F8F5]">
        <Lock className="h-6 w-6 text-[#1FBF9F]" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1A1A1A]">Sign in to {action}</h3>
        <p className="mt-1 text-sm text-[#4B5563]">
          Create a free account or log in to access this feature.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full bg-[#1FBF9F] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17A589]"
        >
          <LogIn className="h-4 w-4" />
          Log in
        </Link>
        <Link
          href={returnTo ? `/signup?next=${encodeURIComponent(returnTo)}` : "/signup"}
          className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#374151] transition hover:border-[#1FBF9F] hover:text-[#1FBF9F]"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
