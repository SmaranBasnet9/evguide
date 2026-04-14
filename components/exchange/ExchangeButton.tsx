"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import ExchangeModal from "./ExchangeModal";
import type { ExchangeTargetEV } from "@/types";

interface ExchangeButtonProps {
  /** Optional — pass when triggering from a specific vehicle listing. */
  vehicle?: ExchangeTargetEV;
  /** "default" = full rounded button, "compact" = small inline button */
  variant?: "default" | "compact";
  className?: string;
}

/**
 * Drop this wherever you want an "Exchange Your Car" trigger.
 * Pass the target EV details when triggering from a vehicle listing;
 * omit for generic exchange entry points (e.g. the /exchange landing page).
 */
export default function ExchangeButton({
  vehicle,
  variant = "default",
  className = "",
}: ExchangeButtonProps) {
  const [open, setOpen] = useState(false);

  const buttonClass =
    variant === "compact"
      ? `inline-flex items-center gap-1.5 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 hover:border-amber-400 ${className}`
      : `inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-amber-600 ${className}`;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        <ArrowLeftRight className="h-4 w-4" />
        {vehicle ? "Exchange This Car" : "Exchange Your Car"}
      </button>

      {open && (
        <ExchangeModal
          targetEV={vehicle ?? null}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
